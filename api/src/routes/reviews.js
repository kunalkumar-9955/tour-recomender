const express = require("express");
const mongoose = require("mongoose");
const Review = require("../models/Review");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, placeId, reviewText, stars } = req.body;
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(placeId)) {
      return res.status(400).json({ message: "Valid userId and placeId are required." });
    }
    const review = await Review.create({ userId, placeId, reviewText, stars });
    return res.status(201).json({ data: review });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create review.", error: error.message });
  }
});

router.get("/:placeId", async (req, res) => {
  try {
    const { placeId } = req.params;
    if (!mongoose.isValidObjectId(placeId)) {
      return res.status(400).json({ message: "Invalid placeId." });
    }
    const reviews = await Review.find({ placeId }).populate("userId", "name");
    return res.json({ data: reviews });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch reviews.", error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid review id." });
    }
    const review = await Review.findByIdAndUpdate(
      id,
      { $set: { reviewText: req.body.reviewText, stars: req.body.stars } },
      { new: true, runValidators: true }
    );
    if (!review) return res.status(404).json({ message: "Review not found." });
    return res.json({ data: review });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update review.", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid review id." });
    }
    const review = await Review.findByIdAndDelete(id);
    if (!review) return res.status(404).json({ message: "Review not found." });
    return res.json({ message: "Review deleted." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete review.", error: error.message });
  }
});

module.exports = router;
