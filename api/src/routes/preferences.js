const express = require("express");
const mongoose = require("mongoose");
const Preference = require("../models/Preference");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, budget, groupType, travelStyle } = req.body;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Valid userId is required." });
    }
    if (budget == null || !groupType || !travelStyle) {
      return res.status(400).json({ message: "budget, groupType and travelStyle are required." });
    }

    const preference = await Preference.findOneAndUpdate(
      { userId },
      { $set: { budget: Number(budget), groupType, travelStyle } },
      { upsert: true, new: true, runValidators: true }
    );

    return res.json({ data: preference });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save preferences.", error: error.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid userId." });
    }
    const preference = await Preference.findOne({ userId });
    return res.json({ data: preference });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch preferences.", error: error.message });
  }
});

module.exports = router;
