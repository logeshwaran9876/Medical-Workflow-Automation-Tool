import {Beds as Bed,Ward,Patient } from "../../models/Models.js";

// @desc    Get all beds
// @route   GET /api/beds
// @access  Private
export const getBeds = async (req, res) => {
  try {
    const { status, ward, available } = req.query;
    const filters = {};
    
    if (status) filters.status = status;
    if (ward) filters.ward = ward;
    if (available === 'true') filters.status = 'available';
    
    const beds = await Bed.find(filters)
      .populate('ward', 'name type')
      .populate('patient', 'name condition contact gender age');
      
    res.status(200).json({
      success: true,
      count: beds.length,
      data: beds
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Assign patient to bed
// @route   POST /api/beds/:id/assign
// @access  Private
export const assignBed = async (req, res) => {
  try {
    const { patientId, admissionDate, expectedDischarge } = req.body;
    
    // Validate required fields
    if (!patientId) {
      return res.status(400).json({
        success: false,
        error: 'Patient ID is required'
      });
    }

    const bed = await Bed.findById(req.params.id);
    if (!bed) {
      return res.status(404).json({
        success: false,
        error: 'Bed not found'
      });
    }
    
    if (bed.status !== 'available') {
      return res.status(400).json({
        success: false,
        error: 'Bed is not available'
      });
    }
    
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }
    
    // Update bed without lastUpdatedBy
    bed.patient = patientId;
    bed.status = 'occupied';
    bed.admissionDate = admissionDate || new Date();
    bed.dischargeDate = expectedDischarge;
    
    await bed.save();
    
    // Update ward occupancy
    await Ward.findByIdAndUpdate(bed.ward, { $inc: { currentOccupancy: 1 } });
    
    res.status(200).json({
      success: true,
      data: bed
    });
    
  } catch (err) {
    console.error('Error assigning bed:', err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: err.message
    });
  }
};

// @desc    Discharge patient from bed
// @route   POST /api/beds/:id/discharge
// @access  Private
export const dischargeBed = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id);
    if (!bed) {
      return res.status(404).json({
        success: false,
        error: 'Bed not found'
      });
    }
    
    if (bed.status !== 'occupied') {
      return res.status(400).json({
        success: false,
        error: 'Bed is not occupied'
      });
    }
    
    const wardId = bed.ward;
    
    bed.patient = undefined;
    bed.status = 'available';
    bed.admissionDate = undefined;
    bed.dischargeDate = undefined;

    
    await bed.save();
    
    await Ward.findByIdAndUpdate(wardId, { $inc: { currentOccupancy: -1 } });
    
    res.status(200).json({
      success: true,
      data: bed
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Create new bed
// @route   POST /api/beds
// @access  Private/Admin
export const createBed = async (req, res) => {
  try {
    const { bedNumber, ward, ratePerDay, features } = req.body;
    
    // Validate required fields
    if (!bedNumber || !ward || !ratePerDay) {
      return res.status(400).json({
        success: false,
        error: 'Please provide bedNumber, ward, and ratePerDay'
      });
    }
    
    const wardExists = await Ward.findById(ward);
    if (!wardExists) {
      return res.status(404).json({
        success: false,
        error: 'Ward not found'
      });
    }
    
    const bed = await Bed.create({
      bedNumber,
      ward,
      ratePerDay,
      features: features || []
      // Removed createdBy since we're not using auth yet
    });
    
    res.status(201).json({
      success: true,
      data: bed
    });
    
  } catch (err) {
    console.error('Error creating bed:', err);
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    if (err.code === 11000) { // Duplicate key error
      return res.status(400).json({
        success: false,
        error: 'Bed number must be unique'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};