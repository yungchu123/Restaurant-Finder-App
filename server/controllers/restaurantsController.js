const Restaurant = require("../models/restaurantModel")
const asyncHandler = require('express-async-handler')
const CustomError = require('../utils/customError')

// @desc Get all restaurants in database
// @route GET /restaurants
// @access Public
const getAllRestaurants = asyncHandler(async (req, res) => {
    const restaurants = await Restaurant.find().lean()
    if (!restaurants?.length) {
        throw new CustomError(400, 'No Restaurants found')
    }
    res.json(restaurants)
})

constCreateNewRestaurant = asyncHandler(async (req, res) => { 

    


})



module.exports = {
    getAllRestaurants
}