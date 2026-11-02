const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema(
  {
    externalId: { type: String, index: true },
    placeName: { type: String, required: true, trim: true },
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "" },
    category: { type: String, trim: true, default: "" },
    rating: { type: Number, min: 0, max: 5, default: 4.2 },
    budget: { type: Number, min: 0, default: 0 },
    imageUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    bestSeason: { type: String, default: "All Season" },
  },
  { timestamps: true, collection: "places" }
);

module.exports = mongoose.model("Place", PlaceSchema);
