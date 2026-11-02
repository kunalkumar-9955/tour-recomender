const express = require("express");
const User = require("../models/User");
const Place = require("../models/Place");
const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Preference = require("../models/Preference");

const router = express.Router();

router.get("/stats", async (_req, res) => {
  const [users, places, reviews, bookings, preferences] = await Promise.all([
    User.countDocuments(),
    Place.countDocuments(),
    Review.countDocuments(),
    Booking.countDocuments(),
    Preference.countDocuments(),
  ]);
  res.json({ users, places, reviews, bookings, preferences });
});

module.exports = router;
