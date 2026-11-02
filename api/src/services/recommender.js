const axios = require("axios");
const mongoose = require("mongoose");
const Place = require("../models/Place");
const User = require("../models/User");
const Booking = require("../models/Booking");
const Preference = require("../models/Preference");

function normalize(value = "") {
  return String(value || "").trim().toLowerCase();
}

function personalizedScore(place, signals) {
  const rating = Number(place.rating || 0);
  const budget = Number(place.budget || 12000);
  const category = normalize(place.category);
  const placeName = normalize(place.placeName);
  const country = normalize(place.country);

  let score = rating * 10;

  if (signals.preferenceStyle && category.includes(normalize(signals.preferenceStyle))) {
    score += 14;
  }

  if (signals.savedCategories.has(category)) score += 12;
  if (signals.savedNames.has(placeName)) score += 8;
  if (signals.visitedCountries.has(country)) score += 5;
  if (signals.preferenceBudget > 0 && budget <= signals.preferenceBudget * 1.2) score += 7;

  return Number((score / 10).toFixed(2));
}

async function fallbackPopularOrStatic() {
  try {
    const popular = await Place.find().sort({ rating: -1 }).limit(8);
    return {
      recommendations: popular.map((d) => ({
        name: d.placeName,
        score: d.rating,
        destinationId: d._id,
      })),
      strategy: "fallback-popular",
    };
  } catch {
    return {
      recommendations: [
        { name: "Goa", score: 4.8, destinationId: "fallback-goa" },
        { name: "Manali", score: 4.7, destinationId: "fallback-manali" },
        { name: "Kerala", score: 4.6, destinationId: "fallback-kerala" },
      ],
      strategy: "fallback-static",
    };
  }
}

async function buildPersonalizedFallback(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    return fallbackPopularOrStatic();
  }

  const [user, preference, bookings, places] = await Promise.all([
    User.findById(userId).populate("savedDestinations"),
    Preference.findOne({ userId }),
    Booking.find({ userId }).populate("placeId").limit(25),
    Place.find().limit(80),
  ]);

  if (!user || places.length === 0) {
    return fallbackPopularOrStatic();
  }

  const savedDestinations = Array.isArray(user.savedDestinations) ? user.savedDestinations : [];
  const visitedPlaces = bookings
    .map((b) => b.placeId)
    .filter((p) => p && typeof p === "object");

  const signals = {
    preferenceStyle: preference?.travelStyle || user.travelInterest || "",
    preferenceBudget: Number(preference?.budget || user.preferences?.budget || 0),
    savedCategories: new Set(savedDestinations.map((p) => normalize(p.category))),
    savedNames: new Set(savedDestinations.map((p) => normalize(p.placeName))),
    visitedCountries: new Set(visitedPlaces.map((p) => normalize(p.country))),
  };

  const recommendationList = places
    .map((place) => ({
      name: place.placeName,
      score: personalizedScore(place, signals),
      destinationId: place._id,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  return {
    recommendations: recommendationList,
    strategy: "fallback-personalized",
  };
}

async function getRecommendationsForUser(userId) {
  try {
    const { data } = await axios.post(`${process.env.ML_URL || "http://localhost:8000"}/recommend`, { user_id: userId });
    return data;
  } catch (e) {
    try {
      return await buildPersonalizedFallback(userId);
    } catch {
      return await fallbackPopularOrStatic();
    }
  }
}

module.exports = { getRecommendationsForUser };
