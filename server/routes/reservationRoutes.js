const express = require("express");
const router = express.Router();
const reservationsController = require("../controllers/reservationsController");

router
  .route("/")
  .get(reservationsController.getAllReservations)

router
  .route("/:id")
  .get(reservationsController.getReservation)
  .patch(reservationsController.updateReservation)

module.exports = router;