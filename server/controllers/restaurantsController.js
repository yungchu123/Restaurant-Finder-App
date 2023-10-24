const mongoose = require("mongoose");
const asyncHandler = require('express-async-handler')
const CustomError = require('../utils/customError')


const ApiResponse = mongoose.model('ApiResponse', mongoose.Schema({}, { strict: false }));

// @desc Get all restaurants in database
// @route GET /restaurants
// @access Public
const getAllRestaurants = asyncHandler(async (req, res) => {
    const restaurants = await ApiResponse.find().lean()
    if (!restaurants?.length) {
        throw new CustomError(400, 'No Restaurants found')
    }
    res.json(restaurants)
})


module.exports = {
    getAllRestaurants
}