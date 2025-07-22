import mongoose from "mongoose";
import { Bill, Patient, Beds, Ward, User } from "../../models/Models.js";
import { generateInvoiceNumber } from "../../utils/billingUtils.js";
import PDFDocument from 'pdfkit';
import fs from 'fs';


export const createBilling = async (req, res) => {
  try {
    const { patientId, bedId, items, discount, notes, dueDate } = req.body;
    

    // Validate patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Validate bed if provided
    let bed = null;
    if (bedId) {
      bed = await Beds.findById(bedId);
      if (!bed) {
        return res.status(404).json({ success: false, message: 'Bed not found' });
      }
    }

    // Calculate amounts
    const subtotal = items.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
    const tax = items.reduce((sum, item) => sum + (item.rate * item.quantity * (item.taxRate || 0) / 100), 0);
    const totalAmount = subtotal + tax - (discount || 0);

    // Create billing record
    const billing = new Bill({
      patient: patientId,
      bed: bedId,
      items,
      subtotal,
      tax,
      discount: discount || 0,
      totalAmount,
      dueDate: dueDate ? new Date(dueDate) : null,
      notes,
      status: items.length > 0 ? 'generated' : 'draft',
     
    });

    await billing.save();

    // Update bed status if bed is assigned
    if (bedId) {
      bed.status = 'occupied';
      bed.patient = patientId;
      bed.admissionDate = new Date();
     
      await bed.save();
    }

    res.status(201).json({ success: true, data: billing });
  } catch (err) {
    console.error('Error creating billing:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const getBillings = async (req, res) => {
  try {
    const { status, patientId, bedId, fromDate, toDate } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (patientId) filter.patient = patientId;
    if (bedId) filter.bed = bedId;
    
    if (fromDate || toDate) {
      filter.billingDate = {};
      if (fromDate) filter.billingDate.$gte = new Date(fromDate);
      if (toDate) filter.billingDate.$lte = new Date(toDate);
    }

    const billings = await Bill.find(filter)
      .populate('patient', 'name contact')
      .populate('bed', 'bedNumber ward')
      .populate('createdBy', 'name')
      .sort({ billingDate: -1 });

    res.json({ success: true, count: billings.length, data: billings });
  } catch (err) {
    console.error('Error fetching billings:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const getFinancialSummary = async (req, res) => {
  try {
    const summary = await Bill.getFinancialSummary();
    
    // Additional stats by status
    const statusStats = await Bill.aggregate([
      { $group: { _id: "$status", total: { $sum: "$totalAmount" }, count: { $sum: 1 } } }
    ]);
    
    res.json({ 
      success: true, 
      data: {
        ...summary,
        byStatus: statusStats
      }
    });
  } catch (err) {
    console.error('Error fetching financial summary:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const getBilling = async (req, res) => {
  try {
    const billing = await Bill.findById(req.params.id)
      .populate('patient')
      .populate('bed')
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name')
      .populate('payments.recordedBy', 'name');
      
    if (!billing) {
      return res.status(404).json({ success: false, message: 'Billing record not found' });
    }
    
    res.json({ success: true, data: billing });
  } catch (err) {
    console.error('Error fetching billing:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const updateBilling = async (req, res) => {
  try {
    const { items, discount, notes, status, dueDate } = req.body;
  
    
    const billing = await Bill.findById(req.params.id);
    if (!billing) {
      return res.status(404).json({ success: false, message: 'Billing record not found' });
    }
    
    // Update fields
    if (items) billing.items = items;
    if (discount !== undefined) billing.discount = discount;
    if (notes) billing.notes = notes;
    if (status) billing.status = status;
    if (dueDate) billing.dueDate = new Date(dueDate);
    
    
    await billing.save();
    
    res.json({ success: true, data: billing });
  } catch (err) {
    console.error('Error updating billing:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const recordPayment = async (req, res) => {
  try {
    const { amount, paymentMethod, transactionId, notes } = req.body;
    
    
    const billing = await Bill.findById(req.params.id);
    if (!billing) {
      return res.status(404).json({ success: false, message: 'Billing record not found' });
    }
    
    // Validate payment amount doesn't exceed balance
    const remainingBalance = billing.totalAmount - billing.paidAmount;
    if (amount > remainingBalance) {
      return res.status(400).json({ 
        success: false, 
        message: `Payment amount exceeds remaining balance of ₹${remainingBalance.toFixed(2)}` 
      });
    }
    
    // Create payment
    const payment = {
      amount,
      paymentMethod,
      transactionId,
      notes
 
    };
    
    billing.payments.push(payment);
    billing.paidAmount += amount;
  
    
    await billing.save();
    
    res.json({ success: true, data: billing });
  } catch (err) {
    console.error('Error recording payment:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const generateInvoice = async (req, res) => {
  try {
    const billing = await Bill.findById(req.params.id)
      .populate('patient')
      .populate('bed')
      .populate('createdBy', 'name');
      
    if (!billing) {
      return res.status(404).json({ success: false, message: 'Billing record not found' });
    }

    const invoiceNumber = generateInvoiceNumber(billing);
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoiceNumber}.pdf`);
    
    // Pipe the PDF directly to the response
    doc.pipe(res);

    // Add invoice header
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();
    
    // Invoice info
    doc.fontSize(10)
       .text(`Invoice Number: ${invoiceNumber}`, { align: 'left' })
       .text(`Date: ${new Date(billing.createdAt).toLocaleDateString()}`, { align: 'left' })
       .moveDown();

    // Patient information
    doc.fontSize(12).text('Bill To:', { underline: true });
    doc.fontSize(10)
       .text(`Name: ${billing.patient.name}`)
       .text(`Contact: ${billing.patient.contact}`)
       .moveDown();

    // Bill items table header
    doc.fontSize(12).text('Itemized Charges:', { underline: true });
    doc.moveDown();

    // Table headers
    doc.font('Helvetica-Bold')
       .text('Description', 50, doc.y)
       .text('Qty', 250, doc.y)
       .text('Rate', 300, doc.y)
       .text('Amount', 350, doc.y, { width: 100, align: 'right' });
    doc.moveDown();

    // Bill items
    doc.font('Helvetica');
    billing.items.forEach(item => {
      doc.text(item.description, 50, doc.y)
         .text(item.quantity.toString(), 250, doc.y)
         .text(`₹${item.rate.toFixed(2)}`, 300, doc.y)
         .text(`₹${item.amount.toFixed(2)}`, 350, doc.y, { width: 100, align: 'right' });
      doc.moveDown();
    });

    // Summary
    doc.moveDown().moveDown();
    doc.font('Helvetica-Bold')
       .text('Subtotal:', 300, doc.y)
       .text(`₹${billing.subtotal.toFixed(2)}`, 350, doc.y, { width: 100, align: 'right' });
    
    doc.font('Helvetica-Bold')
       .text('Tax:', 300, doc.y)
       .text(`₹${billing.tax.toFixed(2)}`, 350, doc.y, { width: 100, align: 'right' });
    
    if (billing.discount > 0) {
      doc.font('Helvetica-Bold')
         .text('Discount:', 300, doc.y)
         .text(`-₹${billing.discount.toFixed(2)}`, 350, doc.y, { width: 100, align: 'right' });
    }

    doc.font('Helvetica-Bold')
       .text('Total Amount:', 300, doc.y)
       .text(`₹${billing.totalAmount.toFixed(2)}`, 350, doc.y, { width: 100, align: 'right' });

    // Footer
    doc.moveDown(3);
    doc.fontSize(8)
       .text('Thank you for your business!', { align: 'center' });

    // Finalize the PDF
    doc.end();

  } catch (err) {
    console.error('Error generating invoice:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Helper function for PDF generation (placeholder)
async function generatePdfInvoice({ billing, invoiceNumber, invoiceDate }) {
  // Implement actual PDF generation using your preferred library
  // This is just a placeholder
  return {
    pipe: () => {}
  };
}