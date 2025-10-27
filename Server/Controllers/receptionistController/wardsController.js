import { Ward } from "../../models/Models.js";
export const getWards = async (req, res) => {
  try {
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
    if (!name || !type || !capacity) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, type, and capacity'
      });
    }
    const existingWard = await Ward.findOne({ name });
    if (existingWard) {
      return res.status(400).json({
        success: false,
        error: 'Ward with this name already exists'
      });
    }
    const ward = await Ward.create({
      name,
      type,
      capacity,
      floor: floor || 1,
      currentOccupancy: 0,
      inCharge: inCharge || null,
      description: description || null
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