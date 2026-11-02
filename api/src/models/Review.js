const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true },
    stars: { type: Number, min: 1, max: 5, required: true },
    reviewText: { type: String, default: "" },
    helpfulLikes: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "reviews" }
);

module.exports = mongoose.model("Review", ReviewSchema);
