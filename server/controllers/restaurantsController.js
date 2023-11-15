const asyncHandler = require('express-async-handler')
const CustomError = require('../utils/customError')
const Restaurant = require('../models/restaurantModel')
const Review = require('../models/reviewModel')
const getCoordinates = require('../utils/getCoordinates')
const axios = require('axios')
const Reservation = require('../models/reservationModel')
const User = require('../models/userModel')

// @desc Get all restaurants in database
// @route GET /restaurants
// @access Public
const getAllRestaurants = asyncHandler(async (req, res) => {
    const limit = req.query.limit || 20; // Default limit value of 20
    const restaurants = await Restaurant.find().limit(limit).lean();

    if (!restaurants?.length) {
        res.status(400).json({ error: 'No Restaurants found' });
        throw new CustomError(400, 'No Restaurants found');
    }

    const updatedRestaurants = await Promise.all(restaurants.map(async (restaurant) => {
        if (restaurant.photoReference) {
            const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${restaurant.photoReference}&key=${process.env.GOOGLE_API_KEY}`;
            try {
                const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                const base64 = Buffer.from(imageResponse.data, 'binary').toString('base64');
                restaurant.imageData = `data:${imageResponse.headers['content-type']};base64,${base64}`;
                console.log(restaurant)
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        }
        return restaurant;
    }));

    res.json(updatedRestaurants);
});

// @desc Get nearby restaurants within radius of an address/postal code and sort by distance or ratings
// @route GET /restaurants/nearby
// @access Public
const getNearbyRestaurants = asyncHandler(async (req, res) => {
  const address = req.query.address;
  const sort = req.query.sort;
  const limit = req.query.limit || 40;
  const maxDist = req.query.distance || 1000;
  const [longitude, latitude] = await getCoordinates(address);
  
  let sortCriteria = {};
  if(sort === 'rating'){
    sortCriteria = {rating: -1};
  } else if(sort === 'distance'){} // mongoDB automatically sorts by distance when using nearSphere
  const nearbyRestaurants = await Restaurant.find({
    location: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDist
      }
    }
  }).sort(sortCriteria).limit(limit);

  if (!nearbyRestaurants?.length) {
    return res.status(200).json({ message: 'No restaurants found' });
  }

  console.log(nearbyRestaurants);

  const updatedRestaurants = await Promise.all(nearbyRestaurants.map(async (restaurant) => {
    let updatedRestaurant = {...restaurant._doc}; 

    if (updatedRestaurant.photoReference) {
        const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${updatedRestaurant.photoReference}&key=${process.env.GOOGLE_API_KEY}`;
        try {
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const base64 = Buffer.from(imageResponse.data, 'binary').toString('base64');
            updatedRestaurant.imageData = `data:${imageResponse.headers['content-type']};base64,${base64}`;
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    }
    return updatedRestaurant;
}));

res.json(updatedRestaurants);

});

// @desc Get all restaurants registered by a specific user
// @route GET /restaurants/registered/:username
// @access Private
const getRegisteredRestaurants = asyncHandler(async (req, res) => {
    const username = req.params.username; 

    const restaurants = await Restaurant.find({ createdBy: username }).lean();

    if (!restaurants?.length) {
        return res.status(200).json({ message: 'No restaurants found for this user' });
    }
    res.json(restaurants);
});

// @desc Get one restaurant in database
// @route GET /restaurants/:restaurantId
// @access Public
const getRestaurant = asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findOne({ restaurantId: { $eq: req.params.restaurantId} }).lean()
    if (!restaurant) {
        res.status(400).json({ error: 'No Restaurant found'})
        throw new CustomError(400, 'No Restaurant found')
    }
    if (restaurant.photoReference) {
      const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${restaurant.photoReference}&key=${process.env.GOOGLE_API_KEY}`;
      try {
          const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          const base64 = Buffer.from(imageResponse.data, 'binary').toString('base64');
          restaurant.imageData = `data:${imageResponse.headers['content-type']};base64,${base64}`;
      } catch (error) {
          console.error('Error fetching image:', error);
      }
    }
    res.json(restaurant)
})

// @desc Get all reviews for the restaurant
// @route GET /restaurants/:restaurantId/reviews
// @access Private
const getRestaurantReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ restaurantId: {$eq: req.params.restaurantId} }).lean()
    if (!reviews?.length) {
        res.status(400).json({ error: 'No reviews found'})
        throw new CustomError(400, 'No reviews found')
    }
    res.json(reviews)
})

// @desc Create a new restaurant
// @route POST /restaurants/register
// @access Private
const createNewRestaurant = async (req, res) => {
    try {
        const {
            restaurantName,
            description,
            postalCode,
            cuisine,
            photoReference,
            managerId,
            tables
        } = req.body;
        
        const defaultRating = 0;
        const defaultNumReviews = 0;

        // Changing postal code into longitude/ latitude
        const [longitude, latitude] = await getCoordinates(postalCode);
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        }

        // Default Table
        const defaultTables = Array.from({ length: 15 }, (_, index) => ({
            tableNumber: index + 1,
            tableCapacity: index < 5 ? 2 : (index < 10 ? 4 : (index < 13 ? 6 : 8)),
            isAvailable: true
        }));

        const newRestaurant = new Restaurant({
            restaurantName,
            description,
            rating: defaultRating,
            numReviews: defaultNumReviews,
            location: location,
            cuisine,
            photoReference,
            createdBy: managerId,
            tables: tables || defaultTables
        });

        newRestaurant.restaurantId = newRestaurant._id
    
        const savedRestaurant = await newRestaurant.save();

        await User.findByIdAndUpdate(managerId, {
            $set: { restaurantOwned: savedRestaurant.restaurantId }
        });
    
        res.status(201).json({ message: "Restaurant registered successfully", restaurant: savedRestaurant });
        } catch (error) {

        console.error("Error registering the restaurant:", error);
        res.status(500).json({ error: "An error occurred while registering the restaurant. Please try again." });
        }
};

// @desc Update restaurant details
// @route PATCH /restaurants/:restaurantId
// @access Private
const updateRestaurant = asyncHandler(async (req,res) => {
    const{
        restaurantName,
        description,
        rating,
        numReviews,
        location,
        cuisine,
        photoReference,
        createdBy,
        reservations,
        tables
    } = req.body;

    // Create an object with only the defined fields from req.body
    const updatedFields = {
        ...(restaurantName && { restaurantName }),
        ...(description && { description }),
        ...(rating && { rating }),
        ...(numReviews && { numReviews }),
        ...(location && { location }),
        ...(cuisine && { cuisine }),
        ...(photoReference && { photoReference }),
        ...(createdBy && { createdBy }),
        ...(reservations && { reservations }),
        ...(tables && { tables }),
    };


    // Update restaurant and return updated document
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
        {restaurantId: req.params.restaurantId},
        {$set: updatedFields},
        {new: true, runValidators: true}
    )

    if (!updatedRestaurant){
        res.status(400).json({ error: 'Restaurant not found' })
        throw new CustomError(400, 'Restaurant not found')
    }

    console.log(updatedRestaurant)
    res.json(updatedRestaurant)
})


// @desc Get tables of restaurant
// @route GET /restaurants/:restaurantId/tables
// @access Public
const getTables = async (req, res) => {
    const { restaurantId } = req.params;
    try {
        const restaurant = await Restaurant.findOne({ restaurantId: restaurantId });

        if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
        }

        const tables = restaurant.tables;
        res.json(tables);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc Get reservations of restaurant
// @route GET /restaurants/:restaurantId/reservations
// @access Public
const getRestaurantReservations = asyncHandler(async (req, res) => {
    
    const reservations = await Reservation.find({ restaurantId: {$eq: req.params.restaurantId} }).lean()
    
    if (!reservations?.length) {
        res.status(404).json({ error: 'No reservations found'})
        throw new CustomError(404, 'No reservations found')
    }
    res.json(reservations)
});


// @desc Reserve a table in the restaurant
// @route POST /restaurants/:restaurantId/reservations
// @access Private
const reserveTable = asyncHandler(async (req, res) => {
    const { restaurantId } = req.params.restaurantId;
    const { customerId, partySize, reservationDate, reservationTime } = req.body;

    try {
        const restaurant = await Restaurant.findOne({ restaurantId: {$eq: restaurantId} }).lean();
  
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Allocate table number
        const availableTables = restaurant.tables.filter((t) => t.isAvailable);
        let allocatedTableNumber = null;

        if (availableTables.length === 0){
            res.status(400).json({ error: 'No more tables available for reservation' });
            throw new CustomError(400, 'No more tables available for reservation')
        }

        // Sort availableTables according to ascending order
        const sortedTables = [...availableTables].sort((a, b) => a.tableCapacity - b.tableCapacity);
        
        for (const table of sortedTables) {
            // Check if the table is available and has enough capacity for the party
            if (partySize <= table.tableCapacity) {
        
                // Mark the table as not available
                table.isAvailable = false;

                allocatedTableNumber = table.tableNumber;
                break;
            }
        }
        if (allocatedTableNumber === null){
            res.status(400).json({ error: `No more tables of this party size (=${partySize}) available for reservation ` });
            throw new CustomError(400, `No more tables of this party size (=${partySize}) available for reservation`)
        }
        
        // Create and store new user
        const status = "pending"
        const reservationObject = {'restaurantId':req.params.restaurantId,customerId,'tableNumber':allocatedTableNumber,partySize,reservationDate,reservationTime,status}

        const reservation = await Reservation.create(reservationObject)
        
        if (reservation) {
            console.log(reservation)
            res.status(201).json(reservation)
        } else {
            res.status(400).json({ error: 'Invalid reservation data received'})
            throw new CustomError(400, 'Invalid reservation data received')
        }
        
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// @desc Accept a reservation in the restaurant
// @route PATCH /restaurants/:restaurantId/reservations/:reservationId
// @access Private
const acceptReservation = async (req, res) => {
    const reservationId = req.params.reservationId;
    const restaurantId = req.params.restaurantId;
    const isAccepted  = req.body.isAccepted;

    try {
        const reservation = await Reservation.findOne({ _id: {$eq: reservationId} });
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        
        
        if (reservation.status === 'accepted') {
            return res.status(400).json({ message: "Reservation already accepted. Please submit another reservation." });
        } else if (reservation.status === 'declined') {
            return res.status(400).json({ message: "Reservation already declined. Please submit another reservation" });
        }

        let status = null
        if (isAccepted){
            status = "accepted"
        } else {
            status = "declined"
        }

        let reservationResponse = null
        // Update the reservation status
        try{
            reservationResponse = await axios.patch(`http://localhost:5000/api/reservations/${reservationId}`, {
                status: status,
            });

            // Change table to unavailable if reservation is approved
            if (status === "accepted"){
                const restaurant = await Restaurant.findOne({ restaurantId: {$eq: restaurantId} });
                if (!restaurant) {
                    console.error("Restaurant not found");
                    res.status(404).json({ message: "Restaurant not found" });
                }
                let tables = restaurant.tables
                const foundTableIndex = tables.findIndex(table => table.tableNumber === reservation.tableNumber);
                if (foundTableIndex !== -1) {
                    // Update the isAvailable property within the original tables array
                    tables[foundTableIndex].isAvailable = false;
                }

                try{
                    const restaurantResponse = await axios.patch(`http://localhost:5000/api/restaurants/${restaurantId}`, {
                        tables: tables,
                    });
                } catch (error) {
                    console.error("Error updating the restaurant:", error);
                    res.status(500).json({ error: "An error occurred while updating the tables in Restaurant. Please try again." });
                }
            }
            
        } catch (error) {
            console.error("Error updating the reservation:", error);
            res.status(500).json({ error: "An error occurred while updating the reservation. Please try again." });
        }

        
        console.log(reservationResponse)
        res.status(201).json({ message: 'Reservation status updated successfully' });

    } catch (error) {
        console.error('Error accepting/declining reservation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllRestaurants,
    getNearbyRestaurants,
    getRegisteredRestaurants,
    getRestaurant,
    getRestaurantReviews,
    createNewRestaurant,
    updateRestaurant,
    getTables,
    getRestaurantReservations,
    reserveTable,
    acceptReservation
}