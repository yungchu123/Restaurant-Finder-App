const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantsController");

router
  .route("/")
  .get(restaurantController.getAllRestaurants)

router
  .route("/:id")
  .get(restaurantController.getRestaurant)

router
  .route("/:id/reviews")
  .get(restaurantController.getRestaurantReviews)

module.exports = router;