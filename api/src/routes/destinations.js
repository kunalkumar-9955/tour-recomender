const express = require("express");
const Place = require("../models/Place");

const router = express.Router();
const GEOAPIFY_URL = "https://api.geoapify.com/v2/places";
const INDIA_BOUNDS = "68.1,6.5,97.4,37.6";
const FALLBACK_DESTINATIONS = [
  {
    _id: "f1",
    externalId: "f1",
    name: "Goa",
    city: "Goa",
    state: "Goa",
    country: "India",
    budget: 12000,
    type: "Beach",
    season: "Winter",
    rating: 4.8,
    images: ["https://picsum.photos/seed/goa-card/900/1200"],
    description: "Beaches, cafes, nightlife, and sunsets.",
  },
  {
    _id: "f2",
    externalId: "f2",
    name: "Manali",
    city: "Manali",
    state: "Himachal Pradesh",
    country: "India",
    budget: 10000,
    type: "Adventure",
    season: "Summer",
    rating: 4.7,
    images: ["https://picsum.photos/seed/manali-card/900/1200"],
    description: "Mountains, rivers, trekking, and scenic drives.",
  },
  {
    _id: "f3",
    externalId: "f3",
    name: "Kerala",
    city: "Kerala",
    state: "Kerala",
    country: "India",
    budget: 14000,
    type: "Nature",
    season: "Monsoon",
    rating: 4.8,
    images: ["https://picsum.photos/seed/kerala-card/900/1200"],
    description: "Backwaters, tea gardens, and calm stays.",
  },
];

function toTitleCase(value = "") {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function cleanUnknown(value = "", fallback = "") {
  const normalized = String(value || "").trim();
  if (!normalized || normalized.toLowerCase() === "unknown") return fallback;
  return normalized;
}

function mapGeoapifyPlaces(features = []) {
  return features.map((item) => {
    const props = item.properties || {};
    const categories = Array.isArray(props.categories) ? props.categories : [];
    const primaryCategory = categories[0] || "tourism.attraction";
    const type = primaryCategory.split(".").slice(-1)[0].replace(/_/g, " ");
    const categoryLabel = toTitleCase(type) || "Attraction";
    const city = cleanUnknown(props.city || props.county || "", "Local Area");
    const state = cleanUnknown(props.state || "", "India");
    const country = cleanUnknown(props.country || "", "India");
    const resolvedName = cleanUnknown(props.name || "", `${categoryLabel} Spot`);
    const imageSeed = encodeURIComponent(props.place_id || resolvedName || city);
    const imageUrl =
      props.datasource?.raw?.image ||
      `https://picsum.photos/seed/${imageSeed}/900/1200`;
    const description =
      cleanUnknown(props.formatted || "", "") ||
      `${resolvedName} in ${city}, ${country}.`;

    return {
      _id: props.place_id || `${resolvedName}-${props.lon || 0}-${props.lat || 0}`,
      externalId: props.place_id || "",
      name: resolvedName,
      city,
      state,
      country,
      budget: 12000,
      type: categoryLabel,
      season: "All Season",
      rating: 4.4,
      images: [imageUrl],
      description,
      tags: categories.slice(0, 5),
      category: primaryCategory,
      source: "geoapify",
    };
  });
}

async function fetchLiveDestinations(query = "") {
  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) return [];

  const params = new URLSearchParams({
    categories: "tourism.attraction,tourism.sights,entertainment.theme_park,beach,natural.mountain",
    limit: "24",
    lang: "en",
    apiKey,
  });

  if (query && query.trim()) {
    params.set("name", query.trim());
    params.set("filter", `rect:${INDIA_BOUNDS}`);
  } else {
    params.set("filter", `rect:${INDIA_BOUNDS}`);
  }

  const response = await fetch(`${GEOAPIFY_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Geoapify error ${response.status}`);
  }

  const payload = await response.json();
  return mapGeoapifyPlaces(payload.features || []);
}

router.get("/", async (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q : "";

  try {
    const liveData = await fetchLiveDestinations(q);
    if (liveData.length > 0) {
      return res.json({ data: liveData, source: "geoapify" });
    }
  } catch (error) {
    console.warn("Geoapify fetch failed, falling back to DB:", error.message);
  }

  const filter = q
    ? {
        $or: [
          { placeName: { $regex: q, $options: "i" } },
          { city: { $regex: q, $options: "i" } },
          { state: { $regex: q, $options: "i" } },
          { country: { $regex: q, $options: "i" } },
          { category: { $regex: q, $options: "i" } },
        ],
      }
    : {};

  try {
    const data = await Place.find(filter).sort({ rating: -1 }).limit(50);
    const mapped = data.map((p) => ({
      _id: p._id.toString(),
      externalId: p.externalId || "",
      name: p.placeName,
      city: p.city || "",
      state: p.state || "",
      country: p.country || "",
      budget: p.budget || 0,
      type: p.category || "General",
      season: p.bestSeason || "All Season",
      rating: p.rating || 4.2,
      images: [p.imageUrl].filter(Boolean),
      description: p.description || "",
      bookingUrl: "https://www.booking.com",
    }));
    return res.json({ data: mapped, source: "database" });
  } catch (error) {
    console.warn("Database fetch failed, returning curated fallback:", error.message);
    const fallbackQuery = typeof req.query.q === "string" ? req.query.q.toLowerCase().trim() : "";
    const fallback = !fallbackQuery
      ? FALLBACK_DESTINATIONS
      : FALLBACK_DESTINATIONS.filter(
          (d) =>
            d.name.toLowerCase().includes(fallbackQuery) ||
            d.country.toLowerCase().includes(fallbackQuery) ||
            d.type.toLowerCase().includes(fallbackQuery)
        );
    return res.json({ data: fallback, source: "fallback" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      externalId,
      placeName,
      city,
      state,
      country,
      category,
      rating,
      budget,
      imageUrl,
      description,
      bestSeason,
    } = req.body;
    if (!placeName || !country) {
      return res.status(400).json({ message: "placeName and country are required." });
    }
    const place = await Place.create({
      externalId,
      placeName,
      city,
      state,
      country,
      category,
      rating,
      budget,
      imageUrl,
      description,
      bestSeason,
    });
    return res.status(201).json(place);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create place.", error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!place) return res.status(404).json({ message: "Place not found." });
    return res.json({ data: place });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update place.", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found." });
    return res.json({ message: "Place deleted." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete place.", error: error.message });
  }
});

module.exports = router;
