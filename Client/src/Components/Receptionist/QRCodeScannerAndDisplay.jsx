
import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence
import {
  FiUser, FiPhone, FiHeart, FiDroplet, FiCalendar, FiFileText, FiXCircle, FiInfo
} from 'react-icons/fi';
import { BsQrCodeScan } from 'react-icons/bs';
import { BiQrScan } from 'react-icons/bi'; // Import BiQrScan for the 'scan' icon
import Modal from "./ui/Modal";
import Button from './ui/Button';
import LoadingSpinner from './ui/LoadingSpinner';
import Badge from './ui/Badge';

const API_BASE_URL = 'http://localhost:5000/api';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  archived: 'bg-blue-100 text-blue-800',
};

export default function QRCodeScannerAndDisplay() {
  const [scanResult, setScanResult] = useState(null);
  const [scannedPatient, setScannedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const qrCodeScannerRef = useRef(null);

  const startScanner = () => {
    setScannedPatient(null); // Clear previous patient details on new scan
    setScanResult(null); // Clear previous scan result
    setIsScannerActive(true);
  };

  const stopScanner = () => {
    setIsScannerActive(false);
    if (qrCodeScannerRef.current) {
      qrCodeScannerRef.current.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. If you're seeing this, it's likely due to a race condition where the scanner is already stopped.", error);
      });
    }
  };

  useEffect(() => {
    if (isScannerActive) {
      const qrCodeReaderElement = document.getElementById("qr-code-reader");
      if (!qrCodeReaderElement) {
        console.error("QR Code Reader element not found.");
        setIsScannerActive(false); // Stop scanner if element is missing
        return;
      }

      qrCodeScannerRef.current = new Html5QrcodeScanner(
        "qr-code-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      const onScanSuccess = async (decodedText, decodedResult) => {
        if (decodedText) {
          stopScanner(); // Stop scanner immediately after a successful scan
          setScanResult(decodedText);
          try {
            const qrData = JSON.parse(decodedText);
            if (qrData.id) {
              setIsLoading(true);
              const { data } = await axios.get(`${API_BASE_URL}/patients/${qrData.id}`);
              setScannedPatient(data);
              toast.success(`Patient "${data.name}" found!`);
            } else {
              toast.error('QR code does not contain patient ID.');
              setScanResult(null);
            }
          } catch (error) {
            console.error('Error parsing QR code or fetching patient:', error);
            toast.error('Invalid QR code or patient not found.');
            setScanResult(null);
          } finally {
            setIsLoading(false);
          }
        }
      };

      const onScanError = (errorMessage) => {
      };

      qrCodeScannerRef.current.render(onScanSuccess, onScanError);

      return () => {
        if (qrCodeScannerRef.current) {
          qrCodeScannerRef.current.clear().catch(error => {
            console.error("Failed to clear html5QrcodeScanner on unmount/deactivation", error);
          });
        }
      };
    }
  }, [isScannerActive]);

  const fetchPatientHistory = async (patientId) => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${API_BASE_URL}/patients/${patientId}/history`);
      console.log('Patient History:', data);
      toast.info('Patient history fetched (check console for now). You can implement a detailed view here!');
    } catch (error) {
      toast.error('Failed to fetch patient history.');
      console.error('Error fetching patient history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-teal-200">
        {}
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-6 sm:p-8 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <BiQrScan className="text-white text-4xl" /> Patient QR Scan
          </h1>
          <AnimatePresence mode="wait">
            {!isScannerActive ? (
              <motion.div
                key="start-button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Button variant="secondary" onClick={startScanner} icon={<BsQrCodeScan className="text-lg" />}>
                  Start Scanner
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="stop-button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Button variant="danger" onClick={stopScanner} icon={<FiXCircle className="text-lg" />}>
                  Stop Scanner
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {}
        <div className="p-6 sm:p-8 space-y-8">
          <AnimatePresence mode="wait">
            {isScannerActive && (
              <motion.div
                key="scanner-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center space-y-6 bg-gray-50 p-6 rounded-2xl shadow-inner border border-gray-200"
              >
                <p className="text-xl text-gray-700 font-semibold tracking-wide">
                  <FiInfo className="inline-block mr-2 text-blue-500" /> Position the patient's QR code within the frame.
                </p>
                <div
                  id="qr-code-reader"
                  className="w-full max-w-sm aspect-square bg-white rounded-xl overflow-hidden border-4 border-dashed border-teal-400 p-2"
                  style={{ boxShadow: '0 0 0 8px rgba(0, 128, 128, 0.1)' }}
                ></div>
                {isLoading && <LoadingSpinner />}
              </motion.div>
            )}

            {!isScannerActive && !scannedPatient && scanResult && (
              <motion.div
                key="no-patient-found"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-center bg-red-50 p-6 rounded-2xl border border-red-200 shadow-md"
              >
                <p className="text-lg font-semibold text-red-700 flex items-center justify-center gap-2">
                  <FiXCircle className="text-2xl" /> No patient found for the scanned QR code. Please ensure it's a valid patient QR.
                </p>
                <p className="text-gray-600 mt-2">Click "Start Scanner" to try again.</p>
              </motion.div>
            )}

            {scannedPatient && (
              <motion.div
                key="patient-details-view"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="bg-teal-50 rounded-2xl p-6 sm:p-8 shadow-2xl border-4 border-teal-400 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-teal-300 opacity-10 blur-xl"></div> {}
                <h2 className="text-3xl font-bold text-teal-800 mb-6 flex items-center gap-3 relative z-10">
                  <FiUser className="text-teal-600 text-4xl" /> Patient Profile
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 relative z-10">
                  <DetailItem icon={<FiUser />} label="Name" value={scannedPatient.name} />
                  <DetailItem icon={<FiInfo />} label="Age" value={`${scannedPatient.age} years`} />
                  <DetailItem icon={<FiUser />} label="Gender" value={scannedPatient.gender} />
                  <DetailItem icon={<FiPhone />} label="Contact" value={scannedPatient.contact} />
                  <DetailItem icon={<FiHeart />} label="Condition" value={scannedPatient.condition || 'N/A'} />
                  <DetailItem
                    icon={<FiDroplet />}
                    label="Blood Type"
                    value={<Badge color={scannedPatient.bloodType ? 'indigo' : 'gray'}>{scannedPatient.bloodType || 'Unknown'}</Badge>}
                  />
                  <DetailItem
                    icon={<FiCalendar />}
                    label="Status"
                    value={<Badge className={statusColors[scannedPatient.status]}>{scannedPatient.status}</Badge>}
                  />
                </div>

                <div className="mt-8 text-center relative z-10">
                  <Button
                    variant="primary" // Changed to primary for more prominence
                    onClick={() => fetchPatientHistory(scannedPatient._id)}
                    icon={<FiFileText className="text-lg" />}
                  >
                    View Patient History
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {isLoading && <LoadingSpinner fullPage />}
    </div>
  );
}
const DetailItem = ({ icon, label, value }) => (
  <motion.p
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay: 0.1 }}
    className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100"
  >
    <span className="text-teal-500 text-xl">{icon}</span>
    <strong className="font-semibold text-gray-700">{label}:</strong>
    <span className="text-gray-900">{value}</span>
  </motion.p>
);