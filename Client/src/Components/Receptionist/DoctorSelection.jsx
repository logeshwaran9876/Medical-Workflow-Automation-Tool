
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiCalendar, FiArrowRight, FiTag, FiMail, FiPhone, FiMapPin, FiStar, FiClock } from 'react-icons/fi'; // Added more icons
import { CustomLoadingSpinner, SearchBar } from './CustomModal'; // Adjust path as needed
import { toast } from 'react-toastify';

const API_BASE_URL = "http://localhost:5000/api";

const getAuthToken = () => localStorage.getItem("authToken");

export default function DoctorSelection({ onSelectDoctor }) {
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const token = getAuthToken();
    const fetchDoctors = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get(`${API_BASE_URL}/doctor`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const activeDoctors = Array.isArray(data)
                ? data.filter(doctor => doctor.status === "active")
                : [];

            setDoctors(activeDoctors);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            toast.error('Failed to load doctors. Please try again.');
            setDoctors([]);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);
    const filteredDoctors = useMemo(() => {
        if (!searchTerm) {
            return doctors;
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return doctors.filter(doctor =>
            doctor.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            doctor.specialization?.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [doctors, searchTerm]);
    const groupedDoctors = useMemo(() => {
        const groups = new Map();

        filteredDoctors.forEach(doctor => {
            const specialization = doctor.specialization?.trim() || 'Unspecified';
            if (!groups.has(specialization)) {
                groups.set(specialization, []);
            }
            groups.get(specialization).push(doctor);
        });

        return Array.from(groups.entries()).sort(([specializationA], [specializationB]) =>
            specializationA.localeCompare(specializationB)
        );
    }, [filteredDoctors]);
    if (isLoading) {
        return <CustomLoadingSpinner fullPage />;
    }

    return (
        <div className="p-6 space-y-8 max-w-6xl mx-auto">
            {}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-800">Select a Doctor</h1>
                    <p className="text-gray-600 text-md mt-1">
                        Choose a doctor to view their available appointment slots.
                    </p>
                </div>
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search doctors by name or specialization..."
                />
            </div>

            {}
            {Object.keys(groupedDoctors).length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <FiUser className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Doctors Found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchTerm ? "Try adjusting your search." : "There are no active doctors registered yet."}
                    </p>
                </div>
            )}

            {}
            {Object.keys(groupedDoctors).length > 0 && (
                <div className="space-y-10">
                    <AnimatePresence mode="wait">
                        {groupedDoctors.map(([specialization, doctorsInSpecialization], groupIndex) => (
                            <div key={specialization} className="space-y-5">
                                {}
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: groupIndex * 0.1, duration: 0.3 }}
                                    className="text-2xl font-bold text-gray-800 flex items-center gap-2"
                                >
                                    <FiTag className="text-teal-500" />
                                    {specialization === 'Unspecified' ? 'Other Doctors' : specialization}
                                </motion.h2>

                                {}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> {}
                                    <AnimatePresence>
                                        {doctorsInSpecialization.map((doctor, index) => (
                                            <motion.div
                                                key={doctor._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ delay: index * 0.05, duration: 0.3 }}
                                                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden
                                                        hover:shadow-lg hover:border-teal-400 transform hover:-translate-y-1 transition-all duration-300
                                                        cursor-pointer flex flex-col"
                                                onClick={() => onSelectDoctor(doctor._id, doctor.name)}
                                            >
                                                {}
                                                <div className="p-6 flex-grow flex flex-col items-center text-center">
                                                    {}
                                                    <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center mb-4 border-2 border-teal-300">
                                                        {doctor.profileImageUrl ? (
                                                            <img
                                                                src={doctor.profileImageUrl}
                                                                alt={doctor.name}
                                                                className="w-full h-full rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <FiUser className="h-12 w-12 text-teal-600" />
                                                        )}
                                                    </div>

                                                    <h2 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h2>
                                                    <p className="text-sm font-semibold text-teal-600 mb-3">{doctor.specialization || 'General Practitioner'}</p>

                                                    <div className="space-y-2 text-gray-700 text-sm w-full">
                                                        {doctor.experience && ( // Display experience if available
                                                            <p className="flex items-center justify-center gap-2">
                                                                <FiClock className="text-gray-400" />
                                                                <span className="font-medium">{doctor.experience}</span> Years Exp.
                                                            </p>
                                                        )}
                                                        {doctor.rating && ( // Display rating if available
                                                            <p className="flex items-center justify-center gap-2">
                                                                <FiStar className="text-yellow-500" />
                                                                <span className="font-medium">{doctor.rating.toFixed(1)}</span> (
                                                                    {doctor.reviewsCount || 0} reviews
                                                                )
                                                            </p>
                                                        )}
                                                        <p className="flex items-center justify-center gap-2">
                                                            <FiMail className="text-gray-400" /> {doctor.email}
                                                        </p>
                                                        {doctor.phone && ( // Display phone if available
                                                            <p className="flex items-center justify-center gap-2">
                                                                <FiPhone className="text-gray-400" /> {doctor.phone}
                                                            </p>
                                                        )}
                                                        {doctor.address && ( // Display address if available
                                                            <p className="flex items-center justify-center gap-2 text-center">
                                                                <FiMapPin className="text-gray-400 flex-shrink-0" />
                                                                <span className="truncate">{doctor.address}</span>
                                                            </p>
                                                        )}
                                                        <p className="flex items-center justify-center gap-2 pt-2 border-t border-gray-100 mt-2">
                                                            <FiCalendar className="text-gray-400" />
                                                            <span className="font-medium text-teal-600">
                                                                {doctor.appointmentCount || 0}
                                                            </span> Appointments Scheduled
                                                        </p>
                                                    </div>
                                                </div>
                                                {}
                                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                                                    <button
                                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md
                                                                shadow-sm text-teal-700 bg-teal-100 hover:bg-teal-200 transition-colors"
                                                    >
                                                        Book Appointment <FiArrowRight className="ml-2" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}