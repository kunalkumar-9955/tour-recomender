const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema(
  {
    name: String,
    country: String,
    budget: Number,
    type: String,
    season: String,
    images: [String],
    rating: { type: Number, default: 4.2 },
    description: String,
    tags: [String],
    bookingUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Destination", DestinationSchema);
