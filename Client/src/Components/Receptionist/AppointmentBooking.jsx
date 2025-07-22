// src/components/AppointmentModule/AppointmentBooking.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiClock, FiUser, FiArrowLeft, FiCheckCircle, FiAlertCircle, FiPlusCircle } from 'react-icons/fi';
import { CustomLoadingSpinner, CustomInput, CustomSelect, CustomButton } from './CustomModal'; // Adjust path as needed
import { toast } from 'react-toastify';

const API_BASE_URL = "http://localhost:5000/api";

const getAuthToken = () => localStorage.getItem("authToken");

export default function AppointmentBooking({ doctorId, doctorName, onBack }) {
    
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // YYYY-MM-DD format
    });
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [isLoadingPatients, setIsLoadingPatients] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const token = getAuthToken();

    // Fetch available slots for the selected doctor and date
    const fetchAvailableSlots = useCallback(async () => {
        if (!doctorId || !selectedDate) return;

        try {
            setIsLoadingSlots(true);
            const { data } = await axios.get(
                `${API_BASE_URL}/booking/doctor/${doctorId}/available-slots/${selectedDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,      
                    },
                }
            );
            setAvailableSlots(Array.isArray(data) ? data : []);
            setSelectedTime(''); // Reset selected time when date changes
        } catch (error) {
            console.error('Error fetching available slots:', error);
            toast.error('Failed to load available slots.');
            setAvailableSlots([]);
        } finally {
            setIsLoadingSlots(false);
        }
    }, [doctorId, selectedDate, token]);

    // Fetch all patients for the dropdown
    const fetchPatients = useCallback(async () => {
        try {
            setIsLoadingPatients(true);
            const { data } = await axios.get(`${API_BASE_URL}/patients`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPatients(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching patients:', error);
            toast.error('Failed to load patients for selection.');
            setPatients([]);
        } finally {
            setIsLoadingPatients(false);
        }
    }, [token]);

    useEffect(() => {
        fetchAvailableSlots();
    }, [fetchAvailableSlots]);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const handlePatientChange = (e) => {
        setSelectedPatient(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!selectedPatient || !selectedTime || !selectedDate) {
            toast.error('Please select a patient, date, and time for the appointment.');
            setIsSubmitting(false);
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/booking`, {
                doctor: doctorId,
                patient: selectedPatient,
                date: selectedDate,
                time: selectedTime,
                notes: '' 
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Appointment booked successfully!');
            onBack(); // Go back to doctor selection or a confirmation page
        } catch (error) {
            console.error('Error booking appointment:', error);
            toast.error(error.response?.data?.message || 'Failed to book appointment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const patientOptions = patients.map(p => ({
        value: p._id,
        label: `${p.name} ${p.email ? `(${p.email})` : ''}`
    }));

    const minDate = new Date().toISOString().split('T')[0]; // Cannot select past dates

    return (
        <div className="p-6 space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <CustomButton variant="outline" onClick={onBack} className="flex items-center gap-2">
                    <FiArrowLeft /> Back to Doctors
                </CustomButton>
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-800">Book Appointment for Dr. {doctorName}</h1>
                    <p className="text-gray-600 text-md mt-1">
                        Select a date, an available time slot, and the patient.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-6">
                {/* Date Selection */}
                <CustomInput
                    label="Select Date"
                    type="date"
                    name="appointmentDate"
                    value={selectedDate}
                    onChange={handleDateChange}
                    icon={<FiCalendar className="text-gray-400" />}
                    min={minDate}
                    required
                />

                {/* Available Time Slots */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <FiClock className="text-teal-600" /> Available Time Slots for {new Date(selectedDate).toLocaleDateString()}
                    </h3>
                    {isLoadingSlots ? (
                        <CustomLoadingSpinner />
                    ) : availableSlots.length === 0 ? (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg flex items-center gap-3">
                            <FiAlertCircle size={20} />
                            <span>No available slots for this date. Please choose another date.</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                            <AnimatePresence>
                                {availableSlots.map((slot) => (
                                    <motion.button
                                        key={slot}
                                        type="button"
                                        onClick={() => handleTimeSelect(slot)}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                        className={`px-4 py-2 rounded-md text-sm font-medium border
                                                    ${selectedTime === slot
                                                        ? 'bg-teal-600 text-white border-teal-700 shadow-md'
                                                        : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                                                    }
                                                    transition-all duration-200`}
                                    >
                                        {slot}
                                    </motion.button>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Patient Selection */}
                <CustomSelect
                    label="Select Patient"
                    name="patient"
                    value={selectedPatient}
                    onChange={handlePatientChange}
                    options={patientOptions}
                    icon={<FiUser className="text-gray-400" />}
                    required
                    disabled={isLoadingPatients || patientOptions.length === 0}
                />
                {patientOptions.length === 0 && !isLoadingPatients && (
                    <p className="text-red-500 text-sm mt-1">No patients found. Please add patients first.</p>
                )}


                {/* Submit Button */}
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <CustomButton
                        type="submit"
                        loading={isSubmitting}
                        variant="primary"
                        disabled={!selectedTime || !selectedPatient}
                    >
                        {isSubmitting ? 'Booking...' : (
                            <>
                                <FiPlusCircle className="mr-2" /> Book Appointment
                            </>
                        )}
                    </CustomButton>
                </div>
            </form>
        </div>
    );
}
