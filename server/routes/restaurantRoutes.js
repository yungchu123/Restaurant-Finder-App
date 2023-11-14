const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantsController");

router
  .route("/")
  .get(restaurantController.getAllRestaurants)

router
  .route("/nearby")
  .get(restaurantController.getNearbyRestaurants);

router
  .route('/registered/:username')
  .get(restaurantController.getRegisteredRestaurants);

router
  .route("/:restaurantId")
  .get(restaurantController.getRestaurant)
  .patch(restaurantController.updateRestaurant)

router
  .route("/:restaurantId/reviews")
  .get(restaurantController.getRestaurantReviews)

router
  .route("/register")
  .post(restaurantController.createNewRestaurant);

router
  .route("/:restaurantId/tables")
  .get(restaurantController.getTables);

router
  .route("/:restaurantId/reservations")
  .get(restaurantController.getRestaurantReservations)
  .post(restaurantController.reserveTable);

router
  .route("/:restaurantId/reservations/:reservationId")
  .patch(restaurantController.acceptReservation);

module.exports = router;