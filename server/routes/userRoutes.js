const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  
router
  .route('/:id')
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser)

router.get('/:id/reviews', usersController.getUserReviews)

router
  .route('/:id/reviews/:reviewId')
  .patch(usersController.updateReview)
  .delete(usersController.deleteReview)

router.post('/login', usersController.loginUser)

router
  .route('/:id/favorites')
  .get(usersController.getFavorites)
  .put(usersController.addFavorite)
  .delete(usersController.removeFavorite)

module.exports = router;