import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  specialization: String,
  phone: String,
  schedule: String,
  status: String,
  avatar: String,
  role: {
    type: String,
    enum: ["admin", "doctor", "receptionist"],
    default: "receptionist",
  },
});

const PatientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  contact: String,
  condition: String,
  bloodType: String,
  visitHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
}, { timestamps: true });

 
const AppointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: Date,
  time: String,
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled",
  },
}, { timestamps: true });
const PrescriptionSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  meds: [
    {
      name: String,
      dosage: String,
      frequency: String,
    },
  ],
  notes: String,
});


const FollowUpSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  followUpDate: Date,
  notified: { type: Boolean, default: false },
});

const bedSchema = new mongoose.Schema(
  {
    bedNumber: { type: String, unique: true },
    ward: { type: mongoose.Schema.Types.ObjectId, ref: "Ward" },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
    },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    admissionDate: Date,
    dischargeDate: Date,
    ratePerDay: { type: Number },
    features: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Make this optional
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Make this optional
    },
  },
  { timestamps: true }
);

const wardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    type: {
      type: String,
      required: true,
      enum: [
        "general",
        "icu",
        "private",
        "semi-private",
        "pediatric",
        "maternity",
      ],
    },
    capacity: { type: Number, required: true },
    currentOccupancy: { type: Number, default: 0 },
    floor: { type: Number, required: true },
    inCharge: { type: String },
    description: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);



const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'upi', 'insurance', 'other'],
    required: true 
  },
  transactionId: String,
  notes: String,
  date: { type: Date, default: Date.now },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const billingItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true },
  taxRate: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  category: { type: String, enum: ['room', 'medication', 'procedure', 'test', 'other'] }
});

const billingSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  admission: { type: mongoose.Schema.Types.ObjectId, ref: 'Admission' },
  bed: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed' },
  billingDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  items: [billingItemSchema],
  subtotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  balance: { type: Number, default: function() { return this.totalAmount - this.paidAmount; } },
  status: {
    type: String,
    enum: ['draft', 'generated', 'partial', 'paid', 'overdue', 'cancelled', 'refunded'],
    default: 'draft'
  },
  payments: [paymentSchema],
  notes: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });


billingSchema.pre('save', function(next) {
 
  this.subtotal = this.items.reduce((sum, item) => sum + item.amount, 0);
  
 
  this.totalAmount = this.subtotal + this.tax - this.discount;
  
 
  this.balance = this.totalAmount - this.paidAmount;
  

  if (this.status !== 'cancelled' && this.status !== 'refunded') {
    if (this.balance <= 0) {
      this.status = 'paid';
    } else if (this.paidAmount > 0) {
      this.status = 'partial';
    } else if (this.dueDate && this.dueDate < new Date()) {
      this.status = 'overdue';
    } else if (this.status === 'draft' && this.items.length > 0) {
      this.status = 'generated';
    }
  }
  
  next();
});
billingSchema.statics.getFinancialSummary = async function() {
  const summary = await this.aggregate([
    {
      $group: {
        _id: null,
        totalBilled: { $sum: "$totalAmount" },
        totalPaid: { $sum: "$paidAmount" },
        totalOutstanding: { $sum: "$balance" },
        count: { $sum: 1 }
      }
    }
  ]);
  
  return summary[0] || { totalBilled: 0, totalPaid: 0, totalOutstanding: 0, count: 0 };
};





const Bill = mongoose.model("Bill", billingSchema);
const FollowUp = mongoose.model("FollowUp", FollowUpSchema);
const Beds = mongoose.model("Bed", bedSchema);
const Appointment = mongoose.model("Appointment", AppointmentSchema);
const User = mongoose.model("User", UserSchema);
const Patient = mongoose.model("Patient", PatientSchema);
const Ward = mongoose.model("Ward", wardSchema);
const Prescription = mongoose.model("Prescription", PrescriptionSchema);

export { User, Patient, Appointment, Prescription, Bill, FollowUp, Beds, Ward };
