import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import { 
  Box, Button, Card, CardContent, CircularProgress, 
  FormControl, Grid, InputLabel, MenuItem, Select, 
  TextField, Typography, Alert, Snackbar, Table, 
  TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Chip 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Download, Refresh } from '@mui/icons-material';

const API_BASE_URL = 'http://localhost:5000';

const ReportGen = () => {
  const [reportType, setReportType] = useState('billing');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [reportData, setReportData] = useState(null);

  const statusOptions = {
    patients: [
      { value: 'all', label: 'All Statuses' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ],
    appointments: [
      { value: 'all', label: 'All Statuses' },
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' }
    ],
    billing: [
      { value: 'all', label: 'All Statuses' },
      { value: 'paid', label: 'Paid' },
      { value: 'unpaid', label: 'Unpaid' },
      { value: 'partial', label: 'Partial' }
    ],
    beds: [
      { value: 'all', label: 'All Statuses' },
      { value: 'occupied', label: 'Occupied' },
      { value: 'available', label: 'Available' },
      { value: 'maintenance', label: 'Maintenance' }
    ]
  };

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setReportData(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/billreport`, {
        params: { 
          type: reportType,
          startDate: moment(startDate).format('YYYY-MM-DD'),
          endDate: moment(endDate).format('YYYY-MM-DD'),
          status: statusFilter !== 'all' ? statusFilter : undefined
        },
        timeout: 10000
      });

      if (response.data?.success) {
        setReportData(response.data);
        setSuccess(`Generated ${response.data.data.length} ${reportType} records`);
      } else {
        throw new Error(response.data?.message || 'Invalid response from server');
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApiError = (err) => {
    let errorMessage = 'Failed to generate report';
    
    if (err.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Server is taking too long to respond.';
    } else if (err.response) {
      errorMessage = err.response.data?.message || 
        `Server error (${err.response.status})`;
    } else if (err.request) {
      errorMessage = `Cannot connect to server at ${API_BASE_URL}\n\nPlease ensure:
      1. The backend server is running
      2. You have network connectivity
      3. No CORS restrictions are blocking the request`;
    } else {
      errorMessage = err.message || 'An unexpected error occurred';
    }
    
    setError(errorMessage);
  };

  const generatePDF = () => {
    if (!reportData) return;
    
    const doc = new jsPDF();
    const title = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`;
    const dateRange = `From ${moment(startDate).format('MMM D, YYYY')} to ${moment(endDate).format('MMM D, YYYY')}`;
    doc.setFontSize(18);
    doc.setTextColor(40, 53, 147);
    doc.text(title, 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(dateRange, 14, 30);
    
    if (statusFilter !== 'all') {
      doc.text(`Status: ${statusFilter}`, 14, 38);
    }
    doc.setFontSize(14);
    doc.text('Summary', 14, 50);
    const summaryHeaders = ['Metric', 'Value'];
    let summaryRows = [];
    
    switch(reportType) {
      case 'patients':
        summaryRows = [
          ['Total Patients', reportData.summary.totalPatients],
          ['Active Patients', reportData.summary.activePatients],
          ['Inactive Patients', reportData.summary.inactivePatients]
        ];
        break;
      case 'appointments':
        summaryRows = [
          ['Total Appointments', reportData.summary.totalAppointments],
          ['Scheduled', reportData.summary.scheduled],
          ['Completed', reportData.summary.completed],
          ['Cancelled', reportData.summary.cancelled]
        ];
        break;
      case 'billing':
        summaryRows = [
          ['Total Bills', reportData.summary.totalBills],
          ['Total Amount', `$${reportData.summary.totalAmount.toFixed(2)}`],
          ['Total Paid', `$${reportData.summary.totalPaid.toFixed(2)}`],
          ['Total Balance', `$${reportData.summary.totalBalance.toFixed(2)}`],
          ['Paid Bills', reportData.summary.paid],
          ['Unpaid Bills', reportData.summary.unpaid],
          ['Partial Payments', reportData.summary.partial]
        ];
        break;
      case 'beds':
        summaryRows = [
          ['Total Beds', reportData.summary.totalBeds],
          ['Occupied', reportData.summary.occupied],
          ['Available', reportData.summary.available],
          ['Maintenance', reportData.summary.maintenance]
        ];
        break;
    }
    
    autoTable(doc, {
      startY: 55,
      head: [summaryHeaders],
      body: summaryRows,
      styles: { 
        fontSize: 10,
        cellPadding: 4,
      },
      headStyles: { 
        fillColor: [40, 53, 147],
        textColor: 255,
        fontStyle: 'bold'
      }
    });
    doc.setFontSize(14);
    doc.text('Detailed Records', 14, doc.lastAutoTable.finalY + 15);
    let headers = [];
    let rows = [];
    
    switch(reportType) {
      case 'patients':
        headers = ['Name', 'Phone', 'Gender', 'Age', 'Status', 'Registered On'];
        rows = reportData.data.map(p => [
          p.name,
          p.phone || 'N/A',
          p.gender || 'N/A',
          p.age || 'N/A',
          p.status || 'N/A',
          p.registeredDate || 'N/A'
        ]);
        break;
      case 'appointments':
        headers = ['Patient', 'Contact', 'Doctor', 'Specialization', 'Date', 'Time', 'Status', 'Reason'];
        rows = reportData.data.map(a => [
          a.patientName,
          a.patientContact,
          a.doctorName,
          a.doctorSpecialization,
          a.date,
          a.time,
          a.status,
          a.reason || 'N/A'
        ]);
        break;
      case 'billing':
        headers = ['Invoice #', 'Patient', 'Contact', 'Bed #', 'Billing Date', 'Due Date', 'Amount', 'Paid', 'Balance', 'Status'];
        rows = reportData.data.map(b => [
          b.invoiceNumber || 'N/A',
          b.patientName,
          b.patientContact,
          b.bedNumber,
          b.billingDate,
          b.dueDate,
          `$${b.totalAmount?.toFixed(2) || '0.00'}`,
          `$${b.paidAmount?.toFixed(2) || '0.00'}`,
          `$${b.balance?.toFixed(2) || '0.00'}`,
          b.paymentStatus || 'N/A'
        ]);
        break;
      case 'beds':
        headers = ['Bed #', 'Type', 'Status', 'Patient', 'Contact', 'Ward', 'Ward Type', 'Admission Date', 'Rate/Day'];
        rows = reportData.data.map(b => [
          b.bedNumber || 'N/A',
          b.bedType || 'N/A',
          b.status || 'N/A',
          b.patientName || 'N/A',
          b.patientContact || 'N/A',
          b.wardName || 'N/A',
          b.wardType || 'N/A',
          b.admissionDate || 'N/A',
          b.ratePerDay ? `$${b.ratePerDay.toFixed(2)}` : 'N/A'
        ]);
        break;
    }
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [headers],
      body: rows,
      styles: { 
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak'
      },
      headStyles: { 
        fillColor: [40, 53, 147],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      margin: { horizontal: 5 }
    });
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(
        `Page ${i} of ${pageCount} • Generated on ${moment().format('MMM D, YYYY h:mm A')}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
    
    doc.save(`${title.replace(/ /g, '_')}_${moment().format('YYYYMMDD_HHmmss')}.pdf`);
  };

  const handleReset = () => {
    setReportType('billing');
    setStartDate(new Date());
    setEndDate(new Date());
    setStatusFilter('all');
    setError(null);
    setSuccess(null);
    setReportData(null);
  };

  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active':
      case 'completed':
      case 'paid':
      case 'available':
        return 'success';
      case 'scheduled':
      case 'partial':
        return 'warning';
      case 'inactive':
      case 'cancelled':
      case 'unpaid':
      case 'occupied':
      case 'maintenance':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Hospital Report Generator
      </Typography>
      
      {}
     
      
      {}
      <Snackbar open={!!error} autoHideDuration={10000} onClose={handleCloseAlert}>
        <Alert severity="error" onClose={handleCloseAlert} sx={{ whiteSpace: 'pre-line' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar open={!!success} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert severity="success" onClose={handleCloseAlert}>
          {success}
        </Alert>
      </Snackbar>
      
      {}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => {
                    setReportType(e.target.value);
                    setStatusFilter('all');
                  }}
                  label="Report Type"
                >
                  <MenuItem value="patients">Patients</MenuItem>
                  <MenuItem value="appointments">Appointments</MenuItem>
                  <MenuItem value="billing">Billing</MenuItem>
                  <MenuItem value="beds">Bed Management</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  {statusOptions[reportType]?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  maxDate={endDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  minDate={startDate}
                  maxDate={new Date()}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={fetchReportData}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
              
              {reportData && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={generatePDF}
                  startIcon={<Download />}
                >
                  Download PDF
                </Button>
              )}
              
              <Button
                variant="outlined"
                onClick={handleReset}
                startIcon={<Refresh />}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {}
      {reportData && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Report Summary
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {Object.entries(reportData.summary).map(([key, value]) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                  <Typography variant="body1">
                    <strong>{key.split(/(?=[A-Z])/).join(' ')}:</strong> {
                      typeof value === 'number' && key.toLowerCase().includes('amount')
                        ? `$${value.toFixed(2)}`
                        : value
                    }
                  </Typography>
                </Grid>
              ))}
            </Grid>
            
            <Typography variant="h6" gutterBottom>
              Detailed Records ({reportData.data.length})
            </Typography>
            
            <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {reportType === 'patients' && (
                      <>
                        <TableCell>Name</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Registered On</TableCell>
                      </>
                    )}
                    {reportType === 'appointments' && (
                      <>
                        <TableCell>Patient</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Doctor</TableCell>
                        <TableCell>Specialization</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Reason</TableCell>
                      </>
                    )}
                    {reportType === 'billing' && (
                      <>
                        <TableCell>Invoice #</TableCell>
                        <TableCell>Patient</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Bed #</TableCell>
                        <TableCell>Billing Date</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Balance</TableCell>
                        <TableCell>Status</TableCell>
                      </>
                    )}
                    {reportType === 'beds' && (
                      <>
                        <TableCell>Bed #</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Patient</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Ward</TableCell>
                        <TableCell>Ward Type</TableCell>
                        <TableCell>Admission Date</TableCell>
                        <TableCell>Rate/Day</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.data.map((item, index) => (
                    <TableRow key={index}>
                      {reportType === 'patients' && (
                        <>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.phone || 'N/A'}</TableCell>
                          <TableCell>{item.gender || 'N/A'}</TableCell>
                          <TableCell>{item.age || 'N/A'}</TableCell>
                          <TableCell>
                            <Chip 
                              label={item.status} 
                              color={getStatusColor(item.status)} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>{item.registeredDate || 'N/A'}</TableCell>
                        </>
                      )}
                      {reportType === 'appointments' && (
                        <>
                          <TableCell>{item.patientName}</TableCell>
                          <TableCell>{item.patientContact}</TableCell>
                          <TableCell>{item.doctorName}</TableCell>
                          <TableCell>{item.doctorSpecialization}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>{item.time}</TableCell>
                          <TableCell>
                            <Chip 
                              label={item.status} 
                              color={getStatusColor(item.status)} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>{item.reason || 'N/A'}</TableCell>
                        </>
                      )}
                      {reportType === 'billing' && (
                        <>
                          <TableCell>{item.invoiceNumber || 'N/A'}</TableCell>
                          <TableCell>{item.patientName}</TableCell>
                          <TableCell>{item.patientContact}</TableCell>
                          <TableCell>{item.bedNumber}</TableCell>
                          <TableCell>{item.billingDate}</TableCell>
                          <TableCell>{item.dueDate}</TableCell>
                          <TableCell>${item.totalAmount?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell>${item.paidAmount?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell>${item.balance?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell>
                            <Chip 
                              label={item.paymentStatus} 
                              color={getStatusColor(item.paymentStatus)} 
                              size="small" 
                            />
                          </TableCell>
                        </>
                      )}
                      {reportType === 'beds' && (
                        <>
                          <TableCell>{item.bedNumber || 'N/A'}</TableCell>
                          <TableCell>{item.bedType || 'N/A'}</TableCell>
                          <TableCell>
                            <Chip 
                              label={item.status} 
                              color={getStatusColor(item.status)} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>{item.patientName || 'N/A'}</TableCell>
                          <TableCell>{item.patientContact || 'N/A'}</TableCell>
                          <TableCell>{item.wardName || 'N/A'}</TableCell>
                          <TableCell>{item.wardType || 'N/A'}</TableCell>
                          <TableCell>{item.admissionDate || 'N/A'}</TableCell>
                          <TableCell>
                            {item.ratePerDay ? `$${item.ratePerDay.toFixed(2)}` : 'N/A'}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ReportGen;