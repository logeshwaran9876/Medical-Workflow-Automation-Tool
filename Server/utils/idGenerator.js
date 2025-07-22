// utils/idGenerator.js
import { User } from "../models/Models.js";

/**
 * Generates a unique doctor ID with pattern: DOC-YYYY-XXXX
 * Where XXXX is an auto-incremented number
 */
export const generateDoctorId = async () => {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear();
    
    // Find the highest existing doctor ID for this year
    const lastDoctor = await User.findOne({ role: 'doctor' })
      .sort({ createdAt: -1 })
      .select('doctorId');
    
    let sequenceNumber = 1;
    
    if (lastDoctor?.doctorId) {
      // Extract sequence number from existing ID
      const idParts = lastDoctor.doctorId.split('-');
      if (idParts.length === 3 && idParts[1] === currentYear.toString()) {
        sequenceNumber = parseInt(idParts[2]) + 1;
      }
    }
    
    // Format with leading zeros (DOC-2023-0001)
    return `DOC-${currentYear}-${sequenceNumber.toString().padStart(4, '0')}`;
  } catch (error) {
    console.error('Failed to generate doctor ID:', error);
    // Fallback ID with timestamp
    return `DOC-${Date.now().toString().slice(-6)}`;
  }
};

/**
 * Generates a staff ID based on role (pattern: [ROLE]-YYYY-XXXX)
 */
export const generateStaffId = async (role) => {
  const rolePrefix = {
    doctor: 'DOC',
    nurse: 'NUR',
    receptionist: 'REC',
    admin: 'ADM'
  }[role?.toLowerCase()] || 'STAFF';

  try {
    const currentYear = new Date().getFullYear();
    
    const lastStaff = await User.findOne({ role })
      .sort({ createdAt: -1 })
      .select('staffId');
    
    let sequenceNumber = 1;
    
    if (lastStaff?.staffId) {
      const idParts = lastStaff.staffId.split('-');
      if (idParts.length === 3 && idParts[1] === currentYear.toString()) {
        sequenceNumber = parseInt(idParts[2]) + 1;
      }
    }
    
    return `${rolePrefix}-${currentYear}-${sequenceNumber.toString().padStart(4, '0')}`;
  } catch (error) {
    console.error(`Failed to generate ${role} ID:`, error);
    return `${rolePrefix}-${Date.now().toString().slice(-6)}`;
  }
};

/**
 * Generates a patient ID with pattern: PT-YYYY-XXXXX
 */
export const generatePatientId = async () => {
  try {
    const currentYear = new Date().getFullYear();
    
    const lastPatient = await User.findOne({ role: 'patient' })
      .sort({ createdAt: -1 })
      .select('patientId');
    
    let sequenceNumber = 1;
    
    if (lastPatient?.patientId) {
      const idParts = lastPatient.patientId.split('-');
      if (idParts.length === 3 && idParts[1] === currentYear.toString()) {
        sequenceNumber = parseInt(idParts[2]) + 1;
      }
    }
    
    // 5 digits for patient IDs
    return `PT-${currentYear}-${sequenceNumber.toString().padStart(5, '0')}`;
  } catch (error) {
    console.error('Failed to generate patient ID:', error);
    return `PT-${Date.now().toString().slice(-8)}`;
  }
};

// Unified ID generator that routes based on role
export const generateId = async (role) => {
  switch (role?.toLowerCase()) {
    case 'doctor':
      return generateDoctorId();
    case 'patient':
      return generatePatientId();
    default:
      return generateStaffId(role);
  }
};

export default {
  generateDoctorId,
  generateStaffId,
  generatePatientId,
  generateId
};