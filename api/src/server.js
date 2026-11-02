const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const mongoose = require("mongoose");
const Place = require("./models/Place");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/destinations", require("./routes/destinations"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/recommendations", require("./routes/recommendations"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/users", require("./routes/users"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/preferences", require("./routes/preferences"));

async function seedIfEmpty() {
  if ((await Place.countDocuments()) > 0) return;
  await Place.insertMany([
    {
      externalId: "seed-goa",
      placeName: "Goa",
      city: "Goa",
      state: "Goa",
      country: "India",
      budget: 12000,
      category: "beach",
      bestSeason: "Winter",
      imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
      rating: 4.7,
      description: "Vibrant beaches, nightlife, and Portuguese heritage.",
    },
    {
      externalId: "seed-manali",
      placeName: "Manali",
      city: "Manali",
      state: "Himachal Pradesh",
      country: "India",
      budget: 9000,
      category: "adventure",
      bestSeason: "Summer",
      imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23",
      rating: 4.5,
      description: "Mountain escapes, trekking, and scenic valleys.",
    },
  ]);
}

async function ensureCollections() {
  if (mongoose.connection.readyState !== 1) return;
  const requiredCollections = ["users", "places", "bookings", "reviews", "preferences"];
  const existing = await mongoose.connection.db.listCollections().toArray();
  const existingNames = new Set(existing.map((c) => c.name));
  await Promise.all(
    requiredCollections
      .filter((name) => !existingNames.has(name))
      .map((name) => mongoose.connection.db.createCollection(name))
  );
}

const port = process.env.PORT || 5000;
connectDB()
  .then(async () => {
    await ensureCollections();
    await seedIfEmpty();
  })
  .catch((err) => {
    console.warn("Mongo unavailable, running API in degraded mode.", err.message);
  })
  .finally(() => {
    app.listen(port, () => console.log(`API running on ${port}`));
  });
