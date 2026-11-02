const mongoose = require("mongoose");

const PreferenceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    budget: { type: Number, min: 0, required: true },
    groupType: {
      type: String,
      enum: ["Solo", "Couple", "Family", "Friends"],
      required: true,
    },
    travelStyle: {
      type: String,
      enum: ["Adventure", "Relax", "Religious", "Nature"],
      required: true,
    },
  },
  { timestamps: true, collection: "preferences" }
);

module.exports = mongoose.model("Preference", PreferenceSchema);
