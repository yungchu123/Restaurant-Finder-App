const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantsController");

router
  .route("/")
  .get(restaurantController.getAllRestaurants)
  //.post(usersController.createNewUser)
  //.patch(usersController.updateUser)
  //.delete(usersController.deleteUser);

module.exports = router;