const Review = require('../models/reviewModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const CustomError = require('../utils/customError')

// @desc Get all reviews in database
// @route GET /reviews
// @access Private
const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find().lean()
    if (!reviews?.length) {
        throw CustomError(400, 'No Users found')
    }
    res.json(reviews)
})

// @desc Create new review
// @route POST /reviews
// @access Private


// @desc Update a review
// @route PATCH /reviews
// @access Private


// @desc Delete a review
// @route DELETE /reviews
// @access Private


module.exports = {
    getAllReviews
}