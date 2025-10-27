import { Patient, User, Appointment } from "../models/Models.js";
import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';
import moment from 'moment';
function drawTable(doc, table) {
  const startX = 50;
  let startY = doc.y;
  const rowHeight = 20;
  const colPadding = 10;
  doc.font('Helvetica');
  const colWidths = table.headers.map((header, colIndex) => {
    const headerWidth = doc.widthOfString(header) + colPadding * 2;
    const contentWidths = table.rows.map(row => 
      doc.widthOfString(String(row[colIndex])) + colPadding * 2
    );
    return Math.max(headerWidth, ...contentWidths);
  });

  const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);
  doc.font('Helvetica-Bold');
  let x = startX;
  table.headers.forEach((header, i) => {
    doc.text(header, x + colPadding, startY, {
      width: colWidths[i] - colPadding * 2,
      align: 'left'
    });
    x += colWidths[i];
  });
  doc.moveTo(startX, startY + rowHeight)
     .lineTo(startX + tableWidth, startY + rowHeight)
     .stroke();
  doc.font('Helvetica');
  table.rows.forEach((row) => {
    startY += rowHeight;
    x = startX;
    
    row.forEach((cell, colIndex) => {
      doc.text(String(cell), x + colPadding, startY, {
        width: colWidths[colIndex] - colPadding * 2,
        align: 'left'
      });
      doc.moveTo(x + colWidths[colIndex], startY - rowHeight)
         .lineTo(x + colWidths[colIndex], startY + rowHeight)
         .stroke();
      
      x += colWidths[colIndex];
    });
    doc.moveTo(startX, startY + rowHeight)
       .lineTo(startX + tableWidth, startY + rowHeight)
       .stroke();
  });
  
  doc.moveDown(2);
}


export const generateDoctorReport = async (req, res) => {
  try {
    const { dateRange } = req.body;
    
    const query = { role: 'doctor' };
    if (dateRange?.start && dateRange?.end) {
      query.createdAt = {
        $gte: new Date(dateRange.start),
        $lte: new Date(dateRange.end)
      };
    }
    
    const doctors = await User.find(query).sort({ createdAt: -1 }).lean();
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition', 
      `attachment; filename=Doctor_Report_${moment().format('YYYY-MM-DD')}.pdf`
    );
    doc.pipe(res);
    doc.fontSize(20).text('Doctor Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${moment().format('MMMM Do YYYY, h:mm:ss a')}`);
    
    if (dateRange?.start && dateRange?.end) {
      doc.text(`Date Range: ${moment(dateRange.start).format('MM/DD/YYYY')} - ${moment(dateRange.end).format('MM/DD/YYYY')}`);
    }
    
    doc.moveDown(2);
    const table = {
      headers: ['Name', 'Specialization', 'Phone', 'Email', 'Status'],
      rows: doctors.map(d => [
        d.name || 'N/A',
        d.specialization || 'N/A',
        d.phone || 'N/A',
        d.email || 'N/A',
        d.status ? d.status.charAt(0).toUpperCase() + d.status.slice(1) : 'N/A'
      ])
    };
    
    drawTable(doc, table);
    doc.end();
    
  } catch (error) {
    console.error('Doctor report error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate doctor report' });
  }
};


export const generatePatientReport = async (req, res) => {
  try {
    const { dateRange } = req.body;
    const query = {};
    if (dateRange?.start && dateRange?.end) {
      query.createdAt = {
        $gte: new Date(dateRange.start),
        $lte: new Date(dateRange.end)
      };
    }
    
    const patients = await Patient.find(query).sort({ createdAt: -1 }).lean();
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition', 
      `attachment; filename=Patient_Report_${moment().format('YYYY-MM-DD')}.pdf`
    );
    doc.pipe(res);
    doc.fontSize(20).text('Patient Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${moment().format('MMMM Do YYYY, h:mm:ss a')}`);
    
    if (dateRange?.start && dateRange?.end) {
      doc.text(`Date Range: ${moment(dateRange.start).format('MM/DD/YYYY')} - ${moment(dateRange.end).format('MM/DD/YYYY')}`);
    }
    
    doc.moveDown(2);
    const table = {
      headers: ['Name', 'Age', 'Gender', 'Contact', 'Status'],
      rows: patients.map(p => [
        p.name || 'N/A',
        p.age || 'N/A',
        p.gender || 'N/A',
        p.contact || 'N/A',
        p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1) : 'N/A'
      ])
    };
    
    drawTable(doc, table);
    doc.end();
    
  } catch (error) {
    console.error('Patient report error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate patient report' });
  }
};

export const generateAppointmentReport = async (req, res) => {
  try {
    const { dateRange } = req.body;
    
    const query = {};
    if (dateRange?.start && dateRange?.end) {
      query.date = {
        $gte: new Date(dateRange.start),
        $lte: new Date(dateRange.end)
      };
    }
    
    const appointments = await Appointment.find(query)
      .populate('patient', 'name contact')
      .populate('doctor', 'name specialization phone')
      .sort({ date: -1 })
      .lean();
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition', 
      `attachment; filename=Appointment_Report_${moment().format('YYYY-MM-DD')}.pdf`
    );
    doc.pipe(res);
    doc.fontSize(20).text('Appointment Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${moment().format('MMMM Do YYYY, h:mm:ss a')}`);
    
    if (dateRange?.start && dateRange?.end) {
      doc.text(`Date Range: ${moment(dateRange.start).format('MM/DD/YYYY')} - ${moment(dateRange.end).format('MM/DD/YYYY')}`);
    }
    
    doc.moveDown(2);
    const table = {
      headers: ['Date', 'Patient', 'Doctor', 'Specialization', 'Status'],
      rows: appointments.map(a => [
        a.date ? moment(a.date).format('MM/DD/YYYY hh:mm A') : 'N/A',
        a.patient?.name || 'N/A',
        a.doctor?.name || 'N/A',
        a.doctor?.specialization || 'N/A',
        a.status ? a.status.charAt(0).toUpperCase() + a.status.slice(1) : 'N/A'
      ])
    };
    
    drawTable(doc, table);
    doc.end();
    
  } catch (error) {
    console.error('Appointment report error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate appointment report' });
  }
};