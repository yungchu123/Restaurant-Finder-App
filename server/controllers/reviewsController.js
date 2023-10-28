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
const createNewReview = asyncHandler(async (req, res) => {

})

// @desc Update a review
// @route PATCH /reviews
// @access Private
const updateReview = asyncHandler(async (req, res) => {

})

// @desc Delete a review
// @route DELETE /reviews
// @access Private
const deleteReview = asyncHandler(async (req, res) => {

})

module.exports = {
    getAllReviews,
    createNewReview,
    updateReview,
    deleteReview
}