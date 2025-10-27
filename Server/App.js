import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import Prescriptionrouter from "./routes/prescriptionRoutes.js";
import followupRoutes from "./routes/followupRoutes.js";
import reportRoutes from './routes/reportRoutes.js';
import doctorRouter from "./routes/doctorsRoutes.js"


import DocPatrouter from "./routes/DoctorsRouter/PatientForDocRouter.js"
import appdocrrouter from "./routes/DoctorsRouter/AppDocRoute.js"
import bedRoutes from "./routes/receptionistRouter/bedroutes.js"
import wardRoutes from "./routes/receptionistRouter/wardsRoutes.js"



import billingRoutes from "./routes/receptionistRouter/billingroutes.js";
import Bookingrouter from "./routes/receptionistRouter/slotBooking.js"

import reportRouter from "./routes/receptionistRouter/reportRoutes.js"


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);


app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", Prescriptionrouter);
app.use("/api/followups", followupRoutes);
app.use('/api/reports', reportRoutes);
app.use("/api/doctor",doctorRouter);





app.use("/api/doctors",DocPatrouter);
app.use("/api/appdoctors",appdocrrouter);
app.use("/api/booking",Bookingrouter);





app.use('/api/beds', bedRoutes);
app.use('/api/wards', wardRoutes);
app.use("/api/billreport",reportRouter)
app.use("/api/billing", billingRoutes);



mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ Mong oDB connected");
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error("❌ MongoDB connection error:", err.message);
});
