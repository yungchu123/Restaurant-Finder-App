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
router.get('/:id/reservations', usersController.getUserReservations)

router.delete('/:id/reservations/:reservationId', usersController.deleteReservation)

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

router
  .route('/:id/manager/details')
  .get(usersController.getRestaurantByOwner)

router
  .route('/:id/manager')
  .get(usersController.getManagerRestaurants)
  .patch(usersController.claimRestaurant)

module.exports = router;