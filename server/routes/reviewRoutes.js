const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/reviewsController");

router
  .route("/")
  .get(reviewsController.getAllReviews)
  .post(reviewsController.createNewReview)

router
  .route("/:id")
  .get(reviewsController.getReview)

module.exports = router;