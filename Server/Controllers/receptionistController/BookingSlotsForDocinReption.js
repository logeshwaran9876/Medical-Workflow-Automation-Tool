// server/controllers/appointmentController.js
import mongoose from 'mongoose';
import { Appointment ,Patient ,User}from '../../models/Models.js';

// Helper function to generate time slots
const generateTimeSlots = (startHour, endHour, intervalMinutes) => {
    const slots = [];
    for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += intervalMinutes) {
            const hour = String(h).padStart(2, '0');
            const minute = String(m).padStart(2, '0');
            slots.push(`${hour}:${minute}`);
        }
    }
    return slots;
};

// GET available time slots for a specific doctor on a specific date
export const getAvailableSlots = async (req, res) => {
    try {
        const { doctorId, date } = req.params;

        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({ message: 'Invalid Doctor ID.' });
        }
        const doctorExists = await User.findById(doctorId);
        if (!doctorExists) {
            return res.status(404).json({ message: 'Doctor not found.' });
        }

        const selectedDate = new Date(date);
        if (isNaN(selectedDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        const startOfDay = new Date(selectedDate);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(selectedDate);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const bookedAppointments = await Appointment.find({
            doctor: doctorId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            status: { $ne: 'cancelled' }
        }).select('time');

        const bookedTimes = new Set(bookedAppointments.map(appt => appt.time));
        const allPossibleSlots = generateTimeSlots(9, 17, 30);
        const availableSlots = allPossibleSlots.filter(slot => !bookedTimes.has(slot));

        res.status(200).json(availableSlots);
    } catch (error) {
        console.error('Error fetching available slots:', error);
        res.status(500).json({ message: 'Server error while fetching available slots.' });
    }
};

// POST a new appointment
export const createAppointment = async (req, res) => {
    const { doctor, patient, date, time, notes } = req.body;

    try {
        if (!doctor || !patient || !date || !time) {
            return res.status(400).json({ message: 'Missing required fields: doctor, patient, date, time.' });
        }

        const doctorExists = await User.findById(doctor);
        const patientExists = await Patient.findById(patient);

        if (!doctorExists) {
            return res.status(404).json({ message: 'Doctor not found.' });
        }
        if (!patientExists) {
            return res.status(404).json({ message: 'Patient not found.' });
        }

        const existingAppointment = await Appointment.findOne({
            doctor,
            date: new Date(date),
            time,
            status: { $ne: 'cancelled' }
        });

        if (existingAppointment) {
            return res.status(409).json({ message: 'This time slot is already booked for the selected doctor.' });
        }

        const newAppointment = new Appointment({
            doctor,
            patient,
            date: new Date(date),
            time,
            notes: notes || ''
        });

        await newAppointment.save();
        res.status(201).json({ message: 'Appointment scheduled successfully!', appointment: newAppointment });
    } catch (error) {
        console.error('Error creating appointment:', error);
        if (error.code === 11000) {
            return res.status(409).json({ message: 'This appointment slot is already taken.' });
        }
        res.status(500).json({ message: 'Server error while scheduling appointment.' });
    }
};

// GET all appointments
export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({})
            .populate('doctor', 'name specialty')
            .populate('patient', 'name contact email');
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Server error while fetching appointments.' });
    }
};

// GET appointment by ID
export const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('doctor', 'name specialty')
            .populate('patient', 'name contact email');
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }
        res.status(200).json(appointment);
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// PUT update appointment
export const updateAppointment = async (req, res) => {
    const { date, time, status, notes } = req.body;
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        if ((date && new Date(date).getTime() !== appointment.date.getTime()) || (time && time !== appointment.time)) {
            const newDate = date ? new Date(date) : appointment.date;
            const newTime = time || appointment.time;

            const conflict = await Appointment.findOne({
                doctor: appointment.doctor,
                date: newDate,
                time: newTime,
                _id: { $ne: req.params.id },
                status: { $ne: 'cancelled' }
            });

            if (conflict) {
                return res.status(409).json({ message: 'The new date/time slot is already booked for this doctor.' });
            }
        }

        appointment.date = date ? new Date(date) : appointment.date;
        appointment.time = time || appointment.time;
        appointment.status = status || appointment.status;
        appointment.notes = notes || appointment.notes;

        await appointment.save();
        res.status(200).json({ message: 'Appointment updated successfully!', appointment });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// DELETE appointment
export const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }
        res.status(200).json({ message: 'Appointment deleted successfully!' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};
