import { Ward } from "../../models/Models.js";

// @desc    Get all wards with optional filtering
// @route   GET /api/wards
// @access  Private
export const getWards = async (req, res) => {
  try {
    // Add filtering if needed (example: by ward type)
    const { type } = req.query;
    const filter = type ? { type } : {};

    const wards = await Ward.find(filter)
      .sort({ name: 1 }) // Sort alphabetically by name
      .lean(); // Convert to plain JS objects

    if (!wards || wards.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No wards found",
      });
    }

    res.status(200).json({
      success: true,
      count: wards.length,
      data: wards,
    });
  } catch (err) {
    console.error("Error fetching wards:", err);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: err.message,
    });
  }
};

// @desc    Create new ward
// @route   POST /api/wards
// @access  Private/Admin
export const createWard = async (req, res) => {
  try {
    const { 
      name, 
      type, 
      capacity, 
      floor, 
      inCharge, 
      description 
    } = req.body;
    
    // Validate required fields
    if (!name || !type || !capacity) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, type, and capacity'
      });
    }

    // Check if ward already exists
    const existingWard = await Ward.findOne({ name });
    if (existingWard) {
      return res.status(400).json({
        success: false,
        error: 'Ward with this name already exists'
      });
    }

    // Create the ward without createdBy field
    const ward = await Ward.create({
      name,
      type,
      capacity,
      floor: floor || 1,
      currentOccupancy: 0,
      inCharge: inCharge || null,
      description: description || null
      // Removed createdBy since we're not using auth yet
    });

    res.status(201).json({
      success: true,
      data: ward
    });

  } catch (err) {
    console.error('Error creating ward:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: err.message
    });
  }
};