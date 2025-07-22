// 📄 controllers/patientController.js
import {Patient} from "../models/Models.js";

// Add new patient
export const addPatient = async (req, res) => {
  try {
    const { name, age, gender, contact, condition } = req.body;
    const newPatient = new Patient({ name, age, gender, contact, condition });
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a patient by ID
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a patient
export const updatePatient = async (req, res) => {
  try {
    const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a patient
export const deletePatient = async (req, res) => {
  try {
    const deleted = await Patient.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json({ message: "Patient deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
