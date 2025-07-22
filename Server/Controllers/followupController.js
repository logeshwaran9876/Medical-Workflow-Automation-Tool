// 📄 controllers/followupController.js
import { FollowUp, Patient, User } from "../models/Models.js"; // Import Patient and User models

// Helper function for consistent population
const populateFollowUp = (query) => {
  return query
    .populate({
      path: "patient",
      model: "Patient",
      select: "name email contact", // Select necessary patient fields
    })
    .populate({
      path: "doctor",
      model: "User", // Your doctor is a User model
      select: "name email specialization", // Select necessary doctor fields
    });
};

export const scheduleFollowUp = async (req, res) => {
  try {
    const { patient, doctor, followUpDate } = req.body;

    // Basic validation
    if (!patient || !doctor || !followUpDate) {
      return res.status(400).json({ message: "Patient, doctor, and follow-up date are required." });
    }

    // Check if patient exists
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Check if doctor (User) exists and has 'doctor' role
    const doctorExists = await User.findOne({ _id: doctor, role: 'doctor' });
    if (!doctorExists) {
      return res.status(404).json({ message: "Doctor not found or invalid doctor ID." });
    }

    const newFollowUp = new FollowUp({ patient, doctor, followUpDate });
    await newFollowUp.save();

    // Populate the new follow-up before sending it back
    const populatedFollowUp = await populateFollowUp(
      FollowUp.findById(newFollowUp._id)
    );

    res.status(201).json(populatedFollowUp);
  } catch (error) {
    console.error("Schedule FollowUp Error:", error.message);
    res.status(500).json({ message: "Failed to schedule follow-up", error: error.message });
  }
};

// GET: /api/followups/doctor/:doctorId
export const getFollowUpsByDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    // Check if doctor (User) exists and has 'doctor' role
    const doctorExists = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctorExists) {
      return res.status(404).json({ message: "Doctor not found or invalid doctor ID." });
    }

    const followups = await populateFollowUp(
      FollowUp.find({ doctor: doctorId })
    ).sort({ followUpDate: 1 }); // optional: show earliest first

    res.status(200).json(followups);
  } catch (error) {
    console.error("Get FollowUps Error:", error.message);
    res.status(500).json({ message: "Failed to fetch follow-ups", error: error.message });
  }
};

// Mark follow-up as notified
export const markNotified = async (req, res) => {
  try {
    const updated = await populateFollowUp( // Populate after update
      FollowUp.findByIdAndUpdate(
        req.params.id,
        { notified: true },
        { new: true }
      )
    );
    if (!updated) return res.status(404).json({ message: "Follow-up not found" });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Mark Notified Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Update a follow-up
export const updateFollowUp = async (req, res) => {
  try {
    const { patient, doctor, followUpDate, notified } = req.body; // Destructure all updatable fields

    // Basic validation for updates
    if (!followUpDate) { // Patient/Doctor typically not updated after creation
        return res.status(400).json({ message: "Follow-up date is required for update." });
    }

    const updated = await populateFollowUp( // Populate after update
      FollowUp.findByIdAndUpdate(
        req.params.id,
        { followUpDate, notified }, // Only update these fields
        { new: true, runValidators: true } // runValidators ensures schema validation on update
      )
    );
    if (!updated) return res.status(404).json({ message: "Follow-up not found" });
    res.status(200).json(updated); // Changed to 200 for successful update
  } catch (err) {
    console.error("Update FollowUp Error:", err.message);
    res.status(400).json({ message: "Failed to update follow-up", error: err.message });
  }
};

// Delete a follow-up
export const deleteFollowUp = async (req, res) => {
  try {
    const deleted = await FollowUp.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Follow-up not found" });
    res.status(200).json({ message: "Follow-up deleted successfully" }); // Consistent success message
  } catch (err) {
    console.error("Delete FollowUp Error:", err.message);
    res.status(500).json({ message: "Failed to delete follow-up", error: err.message });
  }
};