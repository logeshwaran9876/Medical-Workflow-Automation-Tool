import { Appointment, Patient, Bill, Beds } from "../../models/Models.js";
import moment from "moment";

export const generateReportData = async (req, res) => {
  const { type, startDate, endDate, status } = req.query;
  if (!type || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "Missing required parameters: type, startDate, endDate",
      example:
        "/api/reports?type=billing&startDate=2023-01-01&endDate=2023-12-31",
    });
  }

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()))
      throw new Error("Invalid start date format (use YYYY-MM-DD)");
    if (isNaN(end.getTime()))
      throw new Error("Invalid end date format (use YYYY-MM-DD)");
    if (start > end) throw new Error("Start date must be before end date");
    const dateField = type === "billing" ? "billingDate" : "createdAt";
    const query = {
      [dateField]: {
        $gte: moment(start).startOf("day").toDate(),
        $lte: moment(end).endOf("day").toDate(),
      },
    };
    if (status && status !== "all") {
      query.status = status;
    }

    let data;
    let summary = {};

    switch (type) {
      case "patients":
        data = await Patient.find(query)
          .select("name phone gender dob status createdAt")
          .lean();

        data = data.map((p) => ({
          ...p,
          age: p.dob ? moment().diff(moment(p.dob), "years") : "N/A",
          registeredDate: moment(p.createdAt).format("YYYY-MM-DD"),
        }));

        summary = {
          totalPatients: data.length,
          activePatients: data.filter((p) => p.status === "active").length,
          inactivePatients: data.filter((p) => p.status === "inactive").length,
        };
        break;

      case "appointments":
        data = await Appointment.find(query)
          .populate("patient", "name contact") // correct
          .populate("doctor", "name specialization") // ✅ fix here
          .select("date time status patient doctor reason") // keep doctor here
          .lean();

        data = data.map((a) => ({
          ...a,
          patientName: a.patient?.name || "N/A",
          patientContact: a.patient?.contact || "N/A",
          doctorName: a.doctor?.name || "N/A",
          doctorSpecialization: a.doctor?.specialization || "N/A",
          date: moment(a.date).format("YYYY-MM-DD"),
          time: a.time || "N/A",
        }));

        summary = {
          totalAppointments: data.length,
          scheduled: data.filter((a) => a.status === "scheduled").length,
          completed: data.filter((a) => a.status === "completed").length,
          cancelled: data.filter((a) => a.status === "cancelled").length,
        };
        break;

      case "billing":
        data = await Bill.find(query)
          .populate("patient", "name contact")
          .populate("bed", "bedNumber")
          .select(
            "invoiceNumber totalAmount paidAmount paymentStatus paymentMethod billingDate dueDate"
          )
          .lean();

        data = data.map((b) => ({
          ...b,
          patientName: b.patient?.name || "N/A",
          patientContact: b.patient?.contact || "N/A",
          bedNumber: b.bed?.bedNumber || "N/A",
          balance: b.totalAmount - b.paidAmount,
          billingDate: moment(b.billingDate).format("YYYY-MM-DD"),
          dueDate: b.dueDate ? moment(b.dueDate).format("YYYY-MM-DD") : "N/A",
        }));

        summary = {
          totalBills: data.length,
          totalAmount: data.reduce((sum, b) => sum + b.totalAmount, 0),
          totalPaid: data.reduce((sum, b) => sum + b.paidAmount, 0),
          totalBalance: data.reduce(
            (sum, b) => sum + (b.totalAmount - b.paidAmount),
            0
          ),
          paid: data.filter((b) => b.paymentStatus === "paid").length,
          unpaid: data.filter((b) => b.paymentStatus === "unpaid").length,
          partial: data.filter((b) => b.paymentStatus === "partial").length,
        };
        break;

      case "beds":
        data = await Beds.find(query)
          .populate("patient", "name contact")
          .populate("ward", "name type")
          .select(
            "bedNumber bedType status patient ward admissionDate updatedAt ratePerDay"
          )
          .lean();

        data = data.map((b) => ({
          ...b,
          patientName: b.patient?.name || "N/A",
          patientContact: b.patient?.contact || "N/A",
          wardName: b.ward?.name || "N/A",
          wardType: b.ward?.type || "N/A",
          admissionDate: b.admissionDate
            ? moment(b.admissionDate).format("YYYY-MM-DD")
            : "N/A",
          updatedAt: moment(b.updatedAt).format("YYYY-MM-DD"),
        }));

        summary = {
          totalBeds: data.length,
          occupied: data.filter((b) => b.status === "occupied").length,
          available: data.filter((b) => b.status === "available").length,
          maintenance: data.filter((b) => b.status === "maintenance").length,
        };
        break;

      default:
        return res.status(400).json({
          success: false,
          message:
            "Invalid report type. Valid types: patients, appointments, billing, beds",
        });
    }

    res.status(200).json({
      success: true,
      data,
      summary,
      meta: {
        type,
        startDate,
        endDate,
        statusFilter: status || "all",
        count: data.length,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Report generation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate report",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};
