const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantsController");

router
  .route("/")
  .get(restaurantController.getAllRestaurants)

router
  .route("/search")
  .get(restaurantController.getAllRestaurants)

router
  .route("/register")
  .post(restaurantController.createNewRestaurant);

router
  .route('/registered/:username')
  .get(restaurantController.getRegisteredRestaurants);

router
  .route("/:restaurantId")
  .get(restaurantController.getRestaurant);

router
  .route("/:restaurantId/tables/reserve")
  .post(restaurantController.reserveTable);

router
  .route("/:restaurantId/tables/unreserve")
  .post(restaurantController.unreserveTable);

router
  .route("/:restaurantId/tables")
  .get(restaurantController.getTables);

router
  .route("/:restaurantId/tables")
  .get(restaurantController.getTables);

router
  .route("/:restaurantId/reservations/accept")
  .post(restaurantController.acceptReservation);

module.exports = router;