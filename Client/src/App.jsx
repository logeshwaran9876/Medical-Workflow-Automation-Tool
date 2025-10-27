import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Components/Admin/Layout'
import Dashboard from './Components/Admin/pages/Dashboard'
import Appointments from './Components/Admin/appointments/Appointment'
import Doctors from './Components/Admin/Doctor/Doctors'
import Patients from './Components/Admin/patients/Patients'
import ReportGenerator from './Components/Admin/Report/ReportGenerator'

import DoctorLayout from './Components/Doctor/Layout'
import DoctorDashboard from './Components/Doctor/Dashboard'
import DoctorAppointments from './Components/Doctor/DoctorAppointments'
import PatientManager from './Components/Doctor/PatientHistory'
import DoctorPrescriptions from './Components/Doctor/DoctorPrescriptions'
import DoctorFollowUps from './Components/Doctor/DoctorFollowups'

import ReceptionistLayout from './Components/Receptionist/ReceptionistLayout'
import ReceptionistDashboard from './Components/Receptionist/Dashboard'
import ReceptionistPatient from "./Components/Receptionist/Pateint";
import BedManagement from "./Components/Receptionist/BedManagement"
import AppointmentModule from "./Components/Receptionist/AppointmentModule"
import QRCodeScannerAndDisplay from "./Components/Receptionist/QRCodeScannerAndDisplay"

import BillingDashboard from './Components/Receptionist/BillingDashboard'
import BillingDetail from './Components/Receptionist/BillingDetail'
import BillingForm from './Components/Receptionist/BillingForm'
import ReportGenBill from "./Components/Receptionist/ReportGenBill"

import LoginPage from "./Components/Login"

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './ProtectedRoute';  

import { Navigate } from 'react-router-dom';

import { ThemeProvider } from './Components/Admin/context/ThemeContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            {}
            <Route path="/login" element={<LoginPage />} />
            
            {}
            <Route element={<ProtectedRoute />}>
              {}
              <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
          
            <Route path="appointments" element={<Appointments />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="patients" element={<Patients />} />
            <Route path="reports" element={<ReportGenerator />} />
          </Route>

              {}
              <Route path="doctor" element={<DoctorLayout />}>
            <Route index element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="patients" element={<PatientManager />} />
            <Route path="prescriptions" element={<DoctorPrescriptions />} />
            <Route path="followups" element={<DoctorFollowUps />} />
          </Route>

          {}
          <Route path="receptionist" element={<ReceptionistLayout />}>
            <Route index element={<ReceptionistDashboard />} />
            <Route path="appointments" element={<AppointmentModule />} />
            <Route path="patients" element={<ReceptionistPatient />} />
            <Route path="beds" element={<BedManagement />} />
            {}
            <Route path="billing" element={<BillingDashboard />} />
            <Route path="billing/new" element={<BillingForm />} />
            <Route path="billing/:id" element={<BillingDetail />} />
            <Route path="billing/:id/edit" element={<BillingForm />} />
            <Route path="reports" element={<ReportGenBill />} />
            <Route path="scanpatient" element={<QRCodeScannerAndDisplay />} />

          </Route>
          </Route>

            {}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <ToastContainer position="bottom-right" />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}