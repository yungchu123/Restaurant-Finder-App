const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantsController2");

router
  .route("/nearby")
  .get(restaurantController.getNearbyRestaurants);
  
module.exports = router;