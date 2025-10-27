import { Appointment } from '../../models/Models.js';

export const getAppointmentsByDoctor = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate("patient", "name") // fetch patient name
      .populate("doctor", "name"); // optional: fetch doctor name

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Failed to get appointments" });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const requiredFields = ['patient', 'doctor', 'date', 'time'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    const [patientExists, doctorExists] = await Promise.all([
      User.exists({ _id: req.body.patient, role: 'patient' }),
      User.exists({ _id: req.body.doctor, role: 'doctor' })
    ]);

    if (!patientExists || !doctorExists) {
      return res.status(404).json({
        message: `${!patientExists ? 'Patient' : 'Doctor'} not found`
      });
    }
    const existingAppointment = await Appointment.findOne({
      doctor: req.body.doctor,
      date: req.body.date,
      time: req.body.time,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(409).json({
        message: 'Time slot already booked'
      });
    }
    const appointmentData = {
      patient: req.body.patient,
      doctor: req.body.doctor,
      date: req.body.date,
      time: req.body.time,
      reason: req.body.reason || '',
      status: 'scheduled' // Default status
    };

    const newAppointment = new Appointment(appointmentData);
    const savedAppointment = await newAppointment.save();
    const populatedAppointment = await Appointment.findById(savedAppointment._id)
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization');

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: populatedAppointment
    });

  } catch (err) {
    console.error('Appointment creation error:', err);
    res.status(500).json({
      message: 'Failed to create appointment',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error updating appointment' });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting appointment' });
  }
};
