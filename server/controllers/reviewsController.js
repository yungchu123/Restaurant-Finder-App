const Review = require('../models/reviewModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const CustomError = require('../utils/customError')
const axios = require('axios');


// @desc Get review
// @route GET /reviews
// @access Private
const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find().lean()
    if (!reviews?.length) {
        res.status(400).json({ error: 'No reviews found'})
        throw new CustomError(400, 'No reviews found')
    }
    res.json(reviews)
})

// @desc Get review
// @route GET /reviews/:id
// @access Private
const getReview = asyncHandler(async (req, res) => {
    const review = await Review.findOne({ _id: {$eq: req.params.id} }).lean()
    if (!review) {
        res.status(400).json({ error: 'No review found'})
        throw new CustomError(400, 'No review found')
    }
    res.json(review)
})

// @desc Create new review
// @route POST /reviews
// @access Private
const createNewReview = asyncHandler(async (req, res) => {
    const{restaurantId,authorId,rating,text,language} = req.body

    // Missing fields
    console.log("Creating new review")
    if(!restaurantId || !authorId || !rating || !text){
        res.status(400).json({ error: 'All fields are required' })
        throw new CustomError(400, 'All fields are required')
    }

    // Check for repeated reviews by the same user for the same restaurant
    const duplicateReview = await Review.findOne({
        $and:[{restaurantId}, {authorId}]
    }).lean().exec()

    if (duplicateReview) {
        
        res.status(409).json({ error: 'Review has been made for this restaurant before' })
        throw new CustomError(409, 'Review has been made for this restaurant before')
        
    }
    let restaurantName = null
    let authorName = null

    // Get restaurantName and authorName
    try {
        const restaurantResponse = await axios.get(`http://localhost:5000/api/restaurants/${restaurantId}`);
        restaurantName = restaurantResponse.data.restaurantName
    } catch (error) {
        // restaurantId does not exist
        res.status(400).json({ error: 'No restaurant found' });
        throw new CustomError(400, 'No restaurant found')
    }
    

    try {
        const userResponse = await axios.get(`http://localhost:5000/api/users/${authorId}`);
        authorName = userResponse.data.firstName + ' ' + userResponse.data.lastName
    } catch (error) {
        // authorId does not exist
        res.status(400).json({ error: 'No user found' });
        throw new CustomError(400, 'No user found')
    }
   
    
    // Create and store new user
    const reviewObject = {restaurantId,restaurantName,authorId,authorName,rating,text,language}
    const review = await Review.create(reviewObject)

    if (review) {
        console.log(review)
        res.status(201).json(review)
    } else {
        throw new CustomError(400, 'Invalid review data received')
    }
})

module.exports = {
    getAllReviews,
    getReview,
    createNewReview,
}