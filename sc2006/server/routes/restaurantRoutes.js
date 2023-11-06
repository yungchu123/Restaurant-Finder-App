const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantsController");

router
  .route("/")
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

router.post("/:restaurantId/tables/reserve", restaurantController.reserveTable);
router.post("/:restaurantId/tables/unreserve", restaurantController.unreserveTable);

router
  .route("/:restaurantId/tables")
  .get(restaurantController.getTables);

module.exports = router;