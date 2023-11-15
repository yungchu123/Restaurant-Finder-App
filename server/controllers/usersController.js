const User = require('../models/userModel')
const Review = require('../models/reviewModel')
const Reservation = require('../models/reservationModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const CustomError = require('../utils/customError')
const axios = require('axios');
const Restaurant = require('../models/restaurantModel')

// @desc Get all users in database
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        res.status(404).json({ error: 'No Users found'})
        throw new CustomError(404, 'No Users found')
    }
    res.json(users)
})

// @desc Get a user
// @route GET /users/:id
// @access Private
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: { $eq: req.params.id} }).select('-password').lean()
    if (!user) {
        res.status(404).json({ error: 'No User found'})
        throw new CustomError(404, 'No User found')
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
        res.status(404).json({ error: 'No reviews found'})
        throw new CustomError(404, 'No reviews found')
    }
    res.json(reviews)
})

// @desc Get all reservations from the user
// @route GET /users/:id/reservations
// @access Private
const getUserReservations = asyncHandler(async (req, res) => {
    const reservations = await Reservation.find({ customerId: {$eq: req.params.id} }).lean()

    if (!reservations?.length) {
        res.status(404).json({ error: 'No reservations found'})
        throw new CustomError(404, 'No reservations found')
    }
    res.json(reservations)
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
        res.status(404).json({ error: 'No Users found' })
        throw new CustomError(404, 'No Users found')
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
    const userObject = {firstName, lastName, username, "password":hashedPwd, email, role, favourites: [], restaurantOwned: null}

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
        res.status(404).json({ error: 'User not found' })
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
        res.status(404).json({ error: 'Review not found' })
        throw new CustomError(404, 'Review not found')
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
        res.status(404).json({ error: 'No restaurant found' });
        throw new CustomError(404, 'No restaurant found')
    }

    console.log(updatedReview)
    res.json(updatedReview)
})

// @desc Delete a user review
// @route DELETE /users/:id/reviews/:reviewId
// @access Private
const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findOneAndDelete({_id: req.params.reviewId})

    if (!review) {
        res.status(404).json({ error: 'Review not found'})
        throw new CustomError(404, 'Review not found')
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
            const restaurantResponse2 = await axios.patch(`http://localhost:5000/api/restaurants/${restaurantId}`, {
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

// @desc Unreserve a table in the restaurant
// @route DELETE /users/:id/reservations/:reservationId
// @access Private
const deleteReservation = asyncHandler(async (req, res) => {

    const reservation = await Reservation.findOneAndDelete({_id: req.params.reservationId})

    if (!reservation) {
        res.status(404).json({ error: 'Reservation not found'})
        throw new CustomError(404, 'Reservation not found')
    } 

    const restaurantId = reservation.restaurantId
    let restaurantResponse = null
    let restaurantName = null

    try{
        restaurantResponse = await axios.get(`http://localhost:5000/api/restaurants/${restaurantId}`);
        restaurantName = restaurantResponse.data.restaurantName
    } catch (error) {
        // restaurantId does not exist
        res.status(404).json({ error: 'Restaurant Not found' });
        throw new CustomError(404, 'Restaurant Not found')
    }

    if (reservation.status === "accepted"){
        const reservedTableNum = reservation.tableNumber
        
            
        const tables = restaurantResponse.data.tables
        const foundTableIndex = tables.findIndex(table => table.tableNumber === reservedTableNum);

        if (foundTableIndex !== -1) {
            // Update the isAvailable property within the original tables array
            tables[foundTableIndex].isAvailable = true;
        }
        
        try{
            const restaurantResponse2 = await axios.patch(`http://localhost:5000/api/restaurants/${restaurantId}`, {
                tables: tables,
            });
        } catch (error) {
            console.error("Error updating the restaurant:", error);
            res.status(500).json({ error: "An error occurred while updating the tables in Restaurant. Please try again." });
        }
    
    }

    const message = `Reservation on ${restaurantName} has been deleted`
    console.log(message)
    res.json(message)
});

// @desc Delete a user
// @route DELETE /users/:id
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findOneAndDelete({_id: req.params.id})

    if (!user) {
        res.status(404).json({ error: 'User not found'})
        throw new CustomError(404, 'User not found')
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

    const restaurant = await Restaurant.findOne({ restaurantId: restaurantId });
    if (!restaurant) {
        res.status(400).json({ error: 'Restaurant ID is invalid' });
        throw new CustomError(400, 'Restaurant ID is invalid');
    }
    console.log(restaurant)

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
    console.log(req.body)
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

// @desc Manager display a list of restaurants to own/claim
// @route GET /users/:id/manager
// @access Private
const getManagerRestaurants = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== 'restaurateur') {
        return res.status(403).json({ message: "Access denied. Only restaurateurs can perform this action." });
    }
    const unclaimedRestaurants = await Restaurant.find({ created_by: null });
    const restaurantIds = unclaimedRestaurants.map(restaurant => restaurant._id);
    res.json(restaurantIds);
});

// @desc Manager select restaurant to bcome owner 
// @route PATCH /users/:id/manager
// @access Private
const claimRestaurant = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const { restaurantId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== 'restaurateur') {
        return res.status(403).json({ message: "Access denied. Only restaurateurs can perform this action." });
    }
    if (user.restaurantOwned) {
        return res.status(400).json({ message: "You already own a restaurant." });
    }
    const restaurant = await Restaurant.findOne({ restaurantId: restaurantId });
    if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
    }
    if (restaurant.createdBy) {
        return res.status(400).json({ message: "Restaurant is already claimed." });
    }
    restaurant.createdBy = userId;
    await restaurant.save();

    user.restaurantOwned = restaurantId;
    await user.save();

    res.json({ message: "Restaurant claimed successfully" });
});

// @desc Manager get restaurant details
// @route GET /users/:id/manager/details
// @access Private
const getRestaurantByOwner = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (!user.restaurantOwned) {
        return res.status(404).json({ message: "This user does not own any restaurant" });
    }
    const restaurant = await Restaurant.findOne({ restaurantId: user.restaurantOwned });
    if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
});

module.exports = {
    getAllUsers,
    getUser,
    getUserReviews,
    getUserReservations,
    loginUser,
    createNewUser,
    updateUser,
    updateReview,
    deleteReview,
    deleteUser,
    deleteReservation,
    addFavorite,
    removeFavorite,
    getFavorites,
    getManagerRestaurants,
    claimRestaurant,
    getRestaurantByOwner
}