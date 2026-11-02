const express = require("express");
const { getRecommendationsForUser } = require("../services/recommender");

const router = express.Router();

router.get("/:userId", async (req, res) => {
  const data = await getRecommendationsForUser(req.params.userId);
  res.json(data);
});

module.exports = router;
