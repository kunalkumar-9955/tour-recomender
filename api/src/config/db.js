const mongoose = require("mongoose");
mongoose.set("bufferCommands", false);

async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
  await mongoose.connect(uri, {
    dbName: "tour_recommender",
    serverSelectionTimeoutMS: 5000,
  });
  console.log("MongoDB connected");
}

module.exports = { connectDB };
