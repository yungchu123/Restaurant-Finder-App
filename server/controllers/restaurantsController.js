const asyncHandler = require('express-async-handler')
const CustomError = require('../utils/customError')
const Restaurant = require('../models/restaurantModel')
const Review = require('../models/reviewModel')
const axios = require('axios')

// @desc Get all restaurants in database
// @route GET /restaurants
// @access Public
const getAllRestaurants = asyncHandler(async (req, res) => {
    const restaurants = await Restaurant.find().lean();
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
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        }
        return restaurant;
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
// @route GET /restaurants/:id
// @access Public
const getRestaurant = asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findOne({ restaurantId: { $eq: req.params.id} }).lean()
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
    const reviews = await Review.find({ restaurantId: {$eq: req.params.id} }).lean()
    if (!reviews?.length) {
        res.status(400).json({ error: 'No reviews found'})
        throw new CustomError(400, 'No reviews found')
    }
    res.json(reviews)
})

// @desc Create a new restaurant
// @route POST /restaurants
// @access Private
const createNewRestaurant = async (req, res) => {
    try {
        const {
            restaurantId = req.body.restaurantId,
            restaurantName = req.body.inputRefValue,
            description = req.body.description,
            rating = req.body.rating,
            location = req.body.restaurantAddress, 
            cuisine = req.body.cuisine,
            photoReference = req.body.photoReference,
            createdBy = req.body.username
        } = req.body;
        console.log(req.body.inputRefValue)

        const defaultReservations = [];
           
        const defaultTables = Array.from({ length: 15 }, (_, index) => ({
          tableNumber: index + 1,
          tableType: index < 3 || index >= 12 ? 2 : 4, 
          isAvailable: true
        }));

        const newRestaurant = new Restaurant({
            restaurantId,
            restaurantName,
            description,
            rating,
            location,
            cuisine,
            photoReference,
            createdBy, 
            reservations: defaultReservations,
            tables: defaultTables
        });
    
        const savedRestaurant = await newRestaurant.save();
    
        res.status(201).json({ message: "Restaurant registered successfully", restaurant: savedRestaurant });
        } catch (error) {

        console.error("Error registering the restaurant:", error);
        res.status(500).json({ error: "An error occurred while registering the restaurant. Please try again." });
        }
};

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

// @desc Reserve a table in the restaurant
// @route POST /restaurants/:restaurantId/tables/reserve
// @access Private
const reserveTable = async (req, res) => {
    const { restaurantId } = req.params;
    const { tableNumber } = req.body;

    try {
        const restaurant = await Restaurant.findOne({ restaurantId: restaurantId });
  
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
   
      const table = restaurant.tables.find((t) => t.tableNumber === parseInt(tableNumber));
  
      if (!table) {
        return res.status(404).json({ message: "Table not found" });
      }
  
      if (!table.isAvailable) {
        return res.status(400).json({ message: "Table is already reserved" });
      }
      
      const newReservation = {
        tableNumber: table.tableNumber,
        status: 'pending',
      };
      const result = await Restaurant.updateOne(
        { 'tables.tableNumber': table.tableNumber, restaurantId: restaurantId },
        {
          $set: {'tables.$.isAvailable': false},
          $push: { reservations: newReservation }
        }
      );
  
      if (result.modifiedCount === 1) {
        res.status(201).json({ message: 'Reservation created successfully'});
      } else {
        res.status(500).json({ error: 'Failed to update table availability' });
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};

// @desc Unreserve a table in the restaurant
// @route POST /restaurants/:restaurantId/tables/unreserve
// @access Private
const unreserveTable = async (req, res) => {
    const { restaurantId } = req.params;
    const { tableNumber } = req.body;
  
    try {
        const restaurant = await Restaurant.findOne({ restaurantId: restaurantId });

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
  
      const table = restaurant.tables.find((t) => t.tableNumber === parseInt(tableNumber));
  
      if (!table) {
        return res.status(404).json({ message: "Table not found" });
      }
  
      if (table.isAvailable) {
        return res.status(400).json({ message: "Table is already available" });
      }
  
      const reservation = restaurant.reservations.find((r) => r.tableNumber === parseInt(tableNumber));
  
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
  
      reservation.status = 'available';
  
      table.isAvailable = true;
  
      const result = await Restaurant.updateOne(
        { restaurantId: restaurantId, 'tables.tableNumber': tableNumber },
        {
          $set: {
            'tables.$.isAvailable': true,
          },
          $pull: {
            reservations: { tableNumber: tableNumber },
          },
        }
      );
  
      if (result.modifiedCount === 1) {
        res.json({ message: "Reservation cancelled successfully" });
      } else {
        res.status(500).json({ error: 'Failed to update table availability' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };


// @desc Accept a reservation in the restaurant
// @route POST /restaurants/:restaurantId/reservations/accept
// @access Private
const acceptReservation = async (req, res) => {
    const { restaurantId } = req.params;
    const { isAccepted, tableNumber } = req.body;

    try {
        const restaurant = await Restaurant.findOne({ restaurantId: restaurantId });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        const reservation = restaurant.reservations.find(r => r.tableNumber === tableNumber);
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        if (reservation.status === 'accepted') {
            return res.status(400).json({ message: "Reservation already accepted. Please submit another reservation." });
        }
        if (reservation.status === 'declined') {
            return res.status(400).json({ message: "Reservation already declined. Please submit another reservation" });
        }
        const result = await Restaurant.updateOne(
            { restaurantId: restaurantId, 'reservations.tableNumber': tableNumber },
            { $set: { "reservations.$.status": isAccepted ? "accepted" : "declined" } }
        );
        if (!isAccepted) {
            await Restaurant.updateOne(
                { restaurantId: restaurantId, 'tables.tableNumber': tableNumber },
                { $set: { "tables.$.isAvailable": true } }
            );
        }

        res.status(200).json({ message: 'Reservation status updated successfully' });
    } catch (error) {
        console.error('Error accepting/declining reservation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllRestaurants,
    getRegisteredRestaurants,
    getRestaurant,
    getRestaurantReviews,
    createNewRestaurant,
    getTables,
    reserveTable,
    unreserveTable,
    acceptReservation
}