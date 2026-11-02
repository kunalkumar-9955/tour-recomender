const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true, index: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    travelersCount: { type: Number, min: 1, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true, collection: "bookings" }
);

module.exports = mongoose.model("Booking", BookingSchema);
