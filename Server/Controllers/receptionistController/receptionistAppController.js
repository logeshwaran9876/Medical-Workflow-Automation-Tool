
import { Appointment } from "../../models/Models.js"
export const bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time, reason, status } = req.body;

    const newAppointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      date,
      time,
      reason,
      status
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAppointments = async (req, res) => {
  try {
    const filter = {};

    if (req.query.doctor) {
      filter.doctor = req.query.doctor;
    }

    if (req.query.date) {
      const dateOnly = new Date(req.query.date);
      const nextDate = new Date(dateOnly);
      nextDate.setDate(dateOnly.getDate() + 1);
      filter.appointmentDate = {
        $gte: dateOnly,
        $lt: nextDate,
      };
    }

    const appointments = await Appointment.find(filter)
      .populate("patient", "name")
      .populate("doctor", "name");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    
    res.status(200).json({ 
      message: "Appointment deleted successfully",
      id: appointment._id 
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message || "Failed to delete appointment" 
    });
  }
};
