const User = require('../models/userModel')
const Review = require('../models/reviewModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const CustomError = require('../utils/customError')
const axios = require('axios');

// @desc Get all users in database
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        res.status(400).json({ error: 'No Users found'})
        throw new CustomError(400, 'No Users found')
    }
    res.json(users)
})

// @desc Get a user
// @route GET /users/:id
// @access Private
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: { $eq: req.params.id} }).select('-password').lean()
    if (!user) {
        res.status(400).json({ error: 'No User found'})
        throw new CustomError(400, 'No User found')
    }
    console.log(user)
    res.json(user)
})

// @desc Get all reviews from the user
// @route GET /users/:id/reviews
// @access Private
const getUserReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ authorId: {$eq: req.params.id} }).lean()

    if (!reviews?.length) {
        res.status(400).json({ error: 'No reviews found'})
        throw new CustomError(400, 'No reviews found')
    }
    res.json(reviews)
})

// @desc Login user
// @route POST /users/login
// @access Private
const loginUser = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { username, password } = req.body

    if(!username || !password){
        res.status(400).json({ error: 'All fields are required' })
        throw new Error('All fields are required')
    }

    const user = await User.findOne({username: { $eq: username } })
    if (!user) {
        res.status(400).json({ error: 'No Users found' })
        throw new CustomError(400, 'No Users found')
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        res.status(401).json({ error: 'Password is incorrect' })
        throw new CustomError(401, 'Password is incorrect')
    }

    res.json(user)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const{firstName, lastName, username, password, email, role} = req.body
    
    // Missing fields
    console.log("Creating new user")
    if(!firstName || !lastName || !username || !password || !email || !role){
        res.status(400).json({ error: 'All fields are required' })
        throw new CustomError(400, 'All fields are required')
    }

    // Check for duplicates
    const duplicateUser = await User.findOne({
        $or:[{username}, {email}]
    }).lean().exec()

    if (duplicateUser) {
        if (duplicateUser.username === username) {
            res.status(409).json({ error: 'Username is taken' })
            throw new CustomError(409, 'Duplicate username')
        } else {
            res.status(409).json({ error: 'Email is taken' })
            throw new CustomError(409, 'Duplicate email')
        }
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password,10)
    const userObject = {firstName, lastName, username, "password":hashedPwd, email, role, favourites: []}

    // Create and store new user
    const user = await User.create(userObject)

    if (user) {
        console.log(`New user ${username} created`)
        console.log(user)
        res.status(201).json(user)
    } else {
        throw new CustomError(400, 'Invalid user data received')
    }
})

// @desc Update a user
// @route PATCH /users/:id
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const {firstName, lastName, password, email} = req.body
    console.log("Updating user")
    if(!firstName || !lastName || !email){
        res.status(400).json({ error: 'All fields are required' })
        throw new CustomError(400, 'All fields are required')
    }
    const updatedFields = {
        firstName,
        lastName,
        email
    }
    if (password){
        const hashedPassword = await bcrypt.hash(password,10)
        updatedFields.password = hashedPassword
    }
    const updatedUser = await User.findOneAndUpdate(
        {_id: req.params.id},
        {$set: updatedFields},
        {new: true, runValidators: true}
    )

    if (!updatedUser){
        res.status(400).json({ error: 'User not found' })
        throw new CustomError(400, 'User not found')
    }

    console.log(updatedUser)
    res.json(updatedUser)
})

// @desc Update a user review
// @route PATCH /users/:id/reviews/:reviewId
// @access Private
const updateReview = asyncHandler(async (req,res) => {
    const{restaurantId,authorId,rating,text} = req.body

    // Missing fields
    console.log("Updating review")
    if(!restaurantId || !authorId || rating === undefined || !text){
        res.status(400).json({ error: 'All fields are required' })
        throw new CustomError(400, 'All fields are required')
    }

    // Prepare updated fields
    const updatedFields = {
        rating,
        text
    }

    // Update review and return updated document
    const updatedReview = await Review.findOneAndUpdate(
        {_id: req.params.reviewId},
        {$set: updatedFields},
        {runValidators: true}
    )

    if (!updatedReview){
        res.status(400).json({ error: 'Review not found' })
        throw new CustomError(400, 'Review not found')
    }

    // Re-calculate restaurant ratings
    let restaurantNumReviews = null
    let restaurantRating = null
    const oldRating = updatedReview.rating

    try {
        const restaurantResponse = await axios.get(`http://localhost:5000/api/restaurants/${restaurantId}`);
        restaurantNumReviews = restaurantResponse.data.numReviews
        restaurantRating = restaurantResponse.data.rating
        
        restaurantRating = (restaurantRating * restaurantNumReviews - oldRating + rating)/(restaurantNumReviews)
        restaurantRating = Math.round(restaurantRating * 10) / 10 // Rounding Ratings to 1dp
        
        try{
            const userResponse = await axios.patch(`http://localhost:5000/api/restaurants/${restaurantId}`, {
                rating: restaurantRating
            });
        } catch (error) {
            console.log(error)
        }

    } catch (error) {
        // restaurantId does not exist
        res.status(400).json({ error: 'No restaurant found' });
        throw new CustomError(400, 'No restaurant found')
    }

    console.log(updatedReview)
    res.json(updatedReview)
})

// @desc Delete a user review
// @route PATCH /users/:id/reviews/:reviewId
// @access Private
const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findOneAndDelete({_id: req.params.reviewId})

    if (!review) {
        res.status(400).json({ error: 'Review not found'})
        throw new CustomError(400, 'Review not found')
    } 

    // Re-calculate restaurant ratings
    const restaurantId = review.restaurantId
    const rating = review.rating
    let restaurantNumReviews = null
    let restaurantRating = null

    try {
        const restaurantResponse = await axios.get(`http://localhost:5000/api/restaurants/${restaurantId}`);
        restaurantNumReviews = restaurantResponse.data.numReviews
        restaurantRating = restaurantResponse.data.rating
        
        restaurantRating = (restaurantRating * restaurantNumReviews - rating)/(-- restaurantNumReviews)
        restaurantRating = Math.round(restaurantRating * 10) / 10 // Rounding Ratings to 1dp
        
        try{
            const userResponse = await axios.patch(`http://localhost:5000/api/restaurants/${restaurantId}`, {
                rating: restaurantRating,
                numReviews: restaurantNumReviews
            });
        } catch (error) {
            console.log(error)
        }

    } catch (error) {
        res.status(400).json({ error: 'No restaurant found' });
        throw new CustomError(400, 'No restaurant found')
    }

    const message = `Review on ${review.restaurantName} by ${review.authorName} has been deleted`
    console.log(message)
    res.json(message)
})

// @desc Delete a user
// @route DELETE /users/:id
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findOneAndDelete({_id: req.params.id})

    if (!user) {
        res.status(400).json({ error: 'User not found'})
        throw new CustomError(400, 'User not found')
    } 

    const message = `Username ${user.username} with ID ${user.id} has been deleted`
    console.log(message)
    res.json(message)
})

// @desc Add a restaurant to favourites
// @route PUT /users/:id/favourites
// @access Private
const addFavorite = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const restaurantId = req.body.restaurantId;
    if (!restaurantId) {
        res.status(400).json({ error: 'Restaurant ID is required' });
        throw new CustomError(400, 'Restaurant ID is required');
    }
    const user = await User.findByIdAndUpdate(userId, {
        $addToSet: { favorites: restaurantId }
    }, { new: true });
    if (!user) {
        res.status(400).json({ error: 'User not found' });
        throw new CustomError(400, 'User not found');
    }

    res.json(user);
});

// @desc Remove a restaurant from favourites
// @route DELETE /users/:id/favorites
// @access Private
const removeFavorite = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const restaurantId = req.body.restaurantId;
    if (!restaurantId) {
        res.status(400).json({ error: 'Restaurant ID is required' });
        throw new CustomError(400, 'Restaurant ID is required');
    }

    const user = await User.findByIdAndUpdate(userId, {
        $pull: { favorites: restaurantId }
    }, { new: true });

    if (!user) {
        res.status(400).json({ error: 'User not found' });
        throw new CustomError(400, 'User not found');
    }

    res.json(user);
});

// @desc Get all favourite restaurants for user
// @route GET /users/:id/favorites
// @access Public
const getFavorites = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId).populate('favorites').lean();
    if (!user) {
        res.status(400).json({ error: 'User not found' });
        throw new CustomError(400, 'User not found');
    }
    res.json(user.favorites);
});

module.exports = {
    getAllUsers,
    getUser,
    getUserReviews,
    loginUser,
    createNewUser,
    updateUser,
    updateReview,
    deleteReview,
    deleteUser,
    addFavorite,
    removeFavorite,
    getFavorites
}