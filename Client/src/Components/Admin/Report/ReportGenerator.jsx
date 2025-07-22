import React, { useState } from 'react';
import { FiDownload, FiCalendar, FiUser, FiUsers } from 'react-icons/fi';
import Select from '../ui/Select';
import Button from '../ui/Button';
import DatePicker from '../ui/DatePicker';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export default function ReportGenerator() {
  const [reportType, setReportType] = useState('patients');
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { value: 'patients', label: 'Patient Report', icon: <FiUser /> },
    { value: 'doctors', label: 'Doctor Report', icon: <FiUsers /> },
    { value: 'appointments', label: 'Appointment Report', icon: <FiCalendar /> }
  ];
  const token= localStorage.getItem("authToken");
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/reports/${reportType}`,
        { dateRange },
        { headers: { Authorization: `Bearer ${token}` } },
        { responseType: 'blob' }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error(`Failed to generate report: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Generate Reports</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Report Type
          </label>
          <Select
            name="reportType"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            options={reportTypes.map(type => ({
              value: type.value,
              label: (
                <div className="flex items-center">
                  <span className="mr-2">{type.icon}</span>
                  {type.label}
                </div>
              )
            }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <DatePicker
              selected={dateRange.start}
              onChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
              selectsStart
              startDate={dateRange.start}
              endDate={dateRange.end}
              placeholderText="Select start date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <DatePicker
              selected={dateRange.end}
              onChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
              selectsEnd
              startDate={dateRange.start}
              endDate={dateRange.end}
              minDate={dateRange.start}
              placeholderText="Select end date"
            />
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={handleGenerateReport}
            variant="primary"
            loading={isGenerating}
            icon={<FiDownload className="mr-2" />}
            disabled={!reportType}
            className="w-full md:w-auto"
          >
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
}