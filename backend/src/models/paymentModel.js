import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  method: {
    type: String,
    enum: ["Cash", "Card", "Online"],
    default: "Online",
  },
});

export default mongoose.model("Payment", paymentSchema);
