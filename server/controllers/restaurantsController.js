const mongoose = require("mongoose");
const asyncHandler = require('express-async-handler')
const CustomError = require('../utils/customError')
const Review = require('../models/reviewModel')

const ApiResponse = mongoose.model('ApiResponse', mongoose.Schema({}, { strict: false }));

// @desc Get all restaurants in database
// @route GET /restaurants
// @access Public
const getAllRestaurants = asyncHandler(async (req, res) => {
    const restaurants = await ApiResponse.find().lean()
    if (!restaurants?.length) {
        res.status(400).json({ error: 'No Restaurants found'})
        throw new CustomError(400, 'No Restaurants found')
    }
    res.json(restaurants)
})

// @desc Get all restaurants in database
// @route GET /restaurants/:id
// @access Public
const getRestaurant = asyncHandler(async (req, res) => {
    const restaurant = await ApiResponse.findOne({ _id: { $eq: req.params.id} }).lean()
    if (!restaurant) {
        res.status(400).json({ error: 'No Restaurant found'})
        throw new CustomError(400, 'No Restaurant found')
    }
    res.json(restaurant)
})

// @desc Get all reviews for the restaurant
// @route GET /restaurants/:id/reviews
// @access Private
const getRestaurantReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ _id: {$eq: req.params.restaurantId} }).lean()
    if (!reviews?.length) {
        res.status(400).json({ error: 'No reviews found'})
        throw new CustomError(400, 'No reviews found')
    }
    res.json(reviews)
})

module.exports = {
    getAllRestaurants,
    getRestaurant,
    getRestaurantReviews
}