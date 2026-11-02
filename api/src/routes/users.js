const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const Place = require("../models/Place");

const router = express.Router();

router.post("/upsert", async (req, res) => {
  try {
    const { firebaseUid, email, name } = req.body;
    if (!email || !name) {
      return res.status(400).json({ message: "name and email are required." });
    }

    const user = await User.findOneAndUpdate(
      { email: String(email).toLowerCase().trim() },
      {
        $set: {
          firebaseUid: firebaseUid || undefined,
          name: String(name).trim(),
          email: String(email).toLowerCase().trim(),
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    return res.json({ data: user });
  } catch (error) {
    return res.status(500).json({ message: "Failed to upsert user.", error: error.message });
  }
});

router.get("/find", async (req, res) => {
  try {
    const email = typeof req.query.email === "string" ? req.query.email.toLowerCase().trim() : "";
    const firebaseUid = typeof req.query.firebaseUid === "string" ? req.query.firebaseUid.trim() : "";
    if (!email && !firebaseUid) {
      return res.status(400).json({ message: "email or firebaseUid is required." });
    }

    const query = {};
    if (email) query.email = email;
    if (firebaseUid) query.firebaseUid = firebaseUid;

    const user = await User.findOne(query).populate("savedDestinations");
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json({ data: user });
  } catch (error) {
    return res.status(500).json({ message: "Failed to find user.", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user id." });
    }
    const user = await User.findById(id).populate("savedDestinations");
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json({ data: user });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user.", error: error.message });
  }
});

router.patch("/:id/profile", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, country, travelInterest, budget } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user id." });
    }

    const update = {
      ...(name ? { name: String(name).trim() } : {}),
      ...(mobile ? { mobile: String(mobile).trim() } : {}),
      ...(country ? { country: String(country).trim() } : {}),
      ...(travelInterest ? { travelInterest: String(travelInterest).trim() } : {}),
    };

    if (budget != null && !Number.isNaN(Number(budget))) {
      update.preferences = { budget: Number(budget), tripType: travelInterest, location: country };
    }

    const user = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json({ data: user });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile.", error: error.message });
  }
});

router.post("/:id/saved-destinations", async (req, res) => {
  try {
    const { id } = req.params;
    const placePayload = req.body.place || {};
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user id." });
    }
    if (!placePayload.placeName || !placePayload.country) {
      return res.status(400).json({ message: "place.placeName and place.country are required." });
    }

    const place = await Place.findOneAndUpdate(
      {
        $or: [
          ...(placePayload.externalId ? [{ externalId: placePayload.externalId }] : []),
          { placeName: placePayload.placeName, city: placePayload.city || "", country: placePayload.country },
        ],
      },
      { $set: placePayload },
      { upsert: true, new: true, runValidators: true }
    );

    const user = await User.findByIdAndUpdate(
      id,
      { $addToSet: { savedDestinations: place._id } },
      { new: true }
    ).populate("savedDestinations");
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json({ data: user.savedDestinations });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save destination.", error: error.message });
  }
});

router.get("/:id/saved-destinations", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user id." });
    }
    const user = await User.findById(id).populate("savedDestinations");
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json({ data: user.savedDestinations || [] });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch saved destinations.", error: error.message });
  }
});

router.delete("/:id/saved-destinations/:placeId", async (req, res) => {
  try {
    const { id, placeId } = req.params;
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(placeId)) {
      return res.status(400).json({ message: "Invalid id." });
    }
    const user = await User.findByIdAndUpdate(
      id,
      { $pull: { savedDestinations: placeId } },
      { new: true }
    ).populate("savedDestinations");
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json({ data: user.savedDestinations || [] });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove saved destination.", error: error.message });
  }
});

module.exports = router;
