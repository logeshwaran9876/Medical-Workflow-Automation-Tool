// src/components/AppointmentModule/AppointmentModule.jsx
import React, { useState } from 'react';
import DoctorSelection from './DoctorSelection'; // Adjust path as needed
import AppointmentBooking from './AppointmentBooking'; // Adjust path as needed
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

export default function AppointmentModule() {
    const [currentView, setCurrentView] = useState('doctorSelection'); // 'doctorSelection' or 'booking'
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);
    const [selectedDoctorName, setSelectedDoctorName] = useState('');

    const handleSelectDoctor = (id, name) => {
        setSelectedDoctorId(id);
        setSelectedDoctorName(name);
        setCurrentView('booking');
    };

    const handleBackToDoctorSelection = () => {
        setCurrentView('doctorSelection');
        setSelectedDoctorId(null);
        setSelectedDoctorName('');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {currentView === 'doctorSelection' && (
                <DoctorSelection onSelectDoctor={handleSelectDoctor} />
            )}

            {currentView === 'booking' && selectedDoctorId && (
                <AppointmentBooking
                    doctorId={selectedDoctorId}
                    doctorName={selectedDoctorName}
                    onBack={handleBackToDoctorSelection}
                />
            )}

            {/* ToastContainer for notifications */}
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}
