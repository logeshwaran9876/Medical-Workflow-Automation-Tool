import { User,Appointment } from "../models/Models.js";
export const createDoctor = async (req, res) => {
  try {
    const doctorData = { ...req.body, role: "doctor" }; // force role
    const doctor = new User(doctorData);
    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getDoctors = async (req, res) => {
  try {
   
    const doctors = await User.find({ role: "doctor" }).lean(); // Use .lean() for better performance

    
    const doctorsWithCounts = await Promise.all(
      doctors.map(async (doctor) => {
        
        const appointmentCount = await Appointment.countDocuments({
          doctor: doctor._id,
        });

       
        return {
          ...doctor,
          appointmentCount: appointmentCount,
        };
      })
    );

    res.status(200).json(doctorsWithCounts);
  } catch (err) {
    console.error("Error fetching doctors with appointment counts:", err); 
    res.status(500).json({ message: "Failed to fetch doctors: " + err.message });
  }
};
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: "doctor" });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updateDoctor = async (req, res) => {
  try {
    const updated = await User.findOneAndUpdate(
      { _id: req.params.id, role: "doctor" },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Doctor not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const deleteDoctor = async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({
      _id: req.params.id,
      role: "doctor",
    });
    if (!deleted) return res.status(404).json({ message: "Doctor not found" });
    res.status(200).json({ message: "Doctor deleted", id: deleted._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllDoctorwithCount = async (req, res) => {
  try {
    const doctors = await User.find({role:"doctor"});

    const doctorsWithCounts = await Promise.all(
      doctors.map(async (doctor) => {
        const appointmentCount = await Appointment.countDocuments({
          doctor: doctor._id,
        });
        return {
          _id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          specialty: doctor.specialty,
          contact: doctor.contact,
          appointmentCount: appointmentCount,
        };
      })
    );

    res.status(200).json(doctorsWithCounts);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server error while fetching doctors." });
  }
};
