import { Patient } from "../../models/Models.js";

export const getPatient = async (req, res) => {


  try {
    const patient = await Patient.find();
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (e) {
    console.error("Error fetching patient:", e.message);
    res.status(500).json({ message: "Server error" });
  }
};
