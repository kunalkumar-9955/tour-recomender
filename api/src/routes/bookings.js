const express = require("express");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Place = require("../models/Place");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, placeId, place, startDate, endDate, travelersCount, paymentStatus } = req.body;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Valid userId is required." });
    }

    let resolvedPlaceId = placeId;
    if (!resolvedPlaceId && place && place.placeName && place.country) {
      const upsertedPlace = await Place.findOneAndUpdate(
        {
          $or: [
            ...(place.externalId ? [{ externalId: place.externalId }] : []),
            { placeName: place.placeName, city: place.city || "", country: place.country },
          ],
        },
        { $set: place },
        { upsert: true, new: true, runValidators: true }
      );
      resolvedPlaceId = upsertedPlace._id;
    }

    if (!mongoose.isValidObjectId(resolvedPlaceId)) {
      return res.status(400).json({ message: "Valid placeId or place payload is required." });
    }
    if (!startDate || !endDate || !travelersCount) {
      return res.status(400).json({ message: "startDate, endDate and travelersCount are required." });
    }

    const booking = await Booking.create({
      userId,
      placeId: resolvedPlaceId,
      startDate,
      endDate,
      travelersCount,
      paymentStatus: paymentStatus || "pending",
    });
    return res.status(201).json({ data: booking });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create booking.", error: error.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid userId." });
    }
    const bookings = await Booking.find({ userId }).populate("placeId").sort({ createdAt: -1 });
    return res.json({ data: bookings });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch bookings.", error: error.message });
  }
});

module.exports = router;
