import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
});

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
  },

  city: {
    type: String,
    required: true,
    enum: [
      "Mumbai",
      "Delhi",
      "Bengaluru",
      "Hyderabad",
      "Chennai",
      "Kolkata",
      "Pune",
      "Ahmedabad",
      "Jaipur",
      "Surat",
      "Lucknow",
      "Kanpur",
      "Nagpur",
      "Indore",
      "Thane",
      "Bhopal",
      "Visakhapatnam",
      "Patna",
      "Vadodara",
      "Ghaziabad",
      "Ludhiana",
      "Agra",
      "Nashik",
      "Faridabad",
      "Meerut",
      "Rajkot",
      "Varanasi",
      "Srinagar",
      "Aurangabad",
      "Dhanbad",
      "Amritsar",
      "Navi Mumbai",
      "Allahabad",
      "Howrah",
      "Ranchi",
      "Gurgaon",
      "Noida",
      "Guwahati",
      "Mysuru",
      "Coimbatore",
      "Kochi",
      "Madurai",
      "Thiruvananthapuram",
    ],
  },

  address: {
    type: String,
    required: true,
  },

  roomType: {
    type: String,
    enum: ["Single", "Double", "Triple"],
    required: true,
  },

  capacity: {
    type: Number,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  residents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
    },
  ],
  bookings: [bookingSchema],
  images: [String],
});

roomSchema.virtual("availableBeds").get(function () {
  return this.capacity - this.residents.length;
});

roomSchema.virtual("occupiedBeds").get(function () {
  return this.residents.length;
});

roomSchema.set("toJSON", { virtuals: true });
roomSchema.set("toObject", { virtuals: true });

export default mongoose.model("Room", roomSchema);
