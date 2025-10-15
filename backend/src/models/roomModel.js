import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
  },
  roomType: {
    type: String,
    enum: ["Single", "Double", "Triple"],
    required: true,
  },
  availability: {
    type: Boolean,
    required: true,
    default: true,
  },
  price: {
    type: Number,
    required: true,
  },
  resident: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export default mongoose.model("Room", roomSchema);
