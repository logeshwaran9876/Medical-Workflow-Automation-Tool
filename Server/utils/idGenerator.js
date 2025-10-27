
import { User } from "../models/Models.js";


export const generateDoctorId = async () => {
  try {
    const currentYear = new Date().getFullYear();
    const lastDoctor = await User.findOne({ role: 'doctor' })
      .sort({ createdAt: -1 })
      .select('doctorId');
    
    let sequenceNumber = 1;
    
    if (lastDoctor?.doctorId) {
      const idParts = lastDoctor.doctorId.split('-');
      if (idParts.length === 3 && idParts[1] === currentYear.toString()) {
        sequenceNumber = parseInt(idParts[2]) + 1;
      }
    }
    return `DOC-${currentYear}-${sequenceNumber.toString().padStart(4, '0')}`;
  } catch (error) {
    console.error('Failed to generate doctor ID:', error);
    return `DOC-${Date.now().toString().slice(-6)}`;
  }
};


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
    return `PT-${currentYear}-${sequenceNumber.toString().padStart(5, '0')}`;
  } catch (error) {
    console.error('Failed to generate patient ID:', error);
    return `PT-${Date.now().toString().slice(-8)}`;
  }
};
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