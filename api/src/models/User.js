const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: String,
    mobile: String,
    country: String,
    travelInterest: String,
    profilePhoto: String,
    preferences: {
      budget: Number,
      tripType: String,
      climate: String,
      location: String,
    },
    travelHistory: [String],
    savedDestinations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }],
    oauthProvider: { type: String, default: null },
    oauthId: String,
  },
  { timestamps: true, collection: "users" }
);

module.exports = mongoose.model("User", UserSchema);
