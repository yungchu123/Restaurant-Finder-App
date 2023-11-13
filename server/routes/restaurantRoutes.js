const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantsController");

router
  .route("/")
  .get(restaurantController.getAllRestaurants)

router
  .route('/registered/:username')
  .get(restaurantController.getRegisteredRestaurants);

router
  .route("/:id")
  .get(restaurantController.getRestaurant)

router
  .route("/:id/reviews")
  .get(restaurantController.getRestaurantReviews)

router
  .route("/register")
  .post(restaurantController.createNewRestaurant);

router
  .route("/:restaurantId/tables")
  .get(restaurantController.getTables);

router
  .route("/:restaurantId/tables/reserve")
  .post(restaurantController.reserveTable);

router
  .route("/:restaurantId/tables/unreserve")
  .post(restaurantController.unreserveTable);

router
  .route("/:restaurantId/reservations/accept")
  .post(restaurantController.acceptReservation);

module.exports = router;