
import { Prescription, Appointment, User, Patient } from "../models/Models.js";
const populatePrescription = (query) => {
  return query.populate({
    path: "appointment",
    populate: [
      { path: "patient", model: "Patient", select: "name" }, // Select only name for patient
      { path: "doctor", model: "User", select: "name specialization" } // Select name and specialization for doctor
    ]
  });
};
export const createPrescription = async (req, res) => {
  try {
    const { meds, notes } = req.body;
    const { appointmentId } = req.params;

    const appointmentExists = await Appointment.findById(appointmentId);
    if (!appointmentExists) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    const existingPrescription = await Prescription.findOne({ appointment: appointmentId });
    if (existingPrescription) {
      return res.status(409).json({ message: "A prescription already exists for this appointment. Please update it instead." });
    }

    const newPrescription = new Prescription({
      appointment: appointmentId,
      meds,
      notes
    });

    await newPrescription.save();

    const populatedPrescription = await populatePrescription(
      Prescription.findById(newPrescription._id)
    );

    res.status(201).json(populatedPrescription);
  } catch (error) {
    console.error("Error creating prescription:", error.message);
    res.status(500).json({ message: "Failed to create prescription", error: error.message });
  }
};
export const getPrescriptionByAppointmentId = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const prescription = await populatePrescription(
      Prescription.findOne({ appointment: appointmentId })
    );

    if (!prescription) {
      return res.status(404).json({ message: "No prescription found for this appointment." });
    }

    res.status(200).json(prescription);
  } catch (err) {
    console.error("Error fetching prescription by appointment ID:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await populatePrescription(
      Prescription.find({})
    ).sort({ createdAt: -1 });

    res.status(200).json(prescriptions);
  } catch (err) {
    console.error("Error fetching all prescriptions:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const getPrescriptionsByDoctorId = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const prescriptions = await Prescription.find({})
      .populate({
        path: 'appointment',
        match: { doctor: doctorId }, // Match appointments belonging to this doctor
        populate: [
          { path: 'patient', model: 'Patient', select: 'name' },
          { path: 'doctor', model: 'User', select: 'name specialization' }
        ]
      })
      .exec(); // Execute the query
    const filteredPrescriptions = prescriptions.filter(p => p.appointment !== null);

    if (!filteredPrescriptions.length) {
      return res.status(200).json([]); // Return an empty array if no prescriptions found for the doctor
    }

    res.status(200).json(filteredPrescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions by doctor ID:", error.message);
    res.status(500).json({ message: "Failed to fetch prescriptions for doctor", error: error.message });
  }
};
export const updatePrescription = async (req, res) => {
  const { id } = req.params;
  const { meds, notes } = req.body; // Removed 'appointment' from destructuring, generally not updated here

  try {
    const updatedPrescription = await populatePrescription(
      Prescription.findByIdAndUpdate(
        id,
        { meds, notes }, // Only update these fields
        { new: true, runValidators: true }
      )
    );

    if (!updatedPrescription) {
      return res.status(404).json({ message: "Prescription not found." });
    }

    res.status(200).json(updatedPrescription);
  } catch (err) {
    console.error("Error updating prescription:", err.message);
    res.status(500).json({ message: "Failed to update prescription", error: err.message });
  }
};
export const deletePrescription = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPrescription = await Prescription.findByIdAndDelete(id);

    if (!deletedPrescription) {
      return res.status(404).json({ message: "Prescription not found." });
    }

    res.status(200).json({ message: "Prescription deleted successfully." });
  } catch (err) {
    console.error("Error deleting prescription:", err.message);
    res.status(500).json({ message: "Failed to delete prescription", error: err.message });
  }
};