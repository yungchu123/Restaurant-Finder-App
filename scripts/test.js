/*
    This script is run to call the Google APIs.

    2 APIs will be called in this script:
        1. Get the list of restaurants
        2. Get the "top 5" reviews for each restaurant, based on the default parameter of "most relevant"

    This script should only be run when necessary to refresh the MongoDB
*/

// npm install axios dotenv mongoose

const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();
const Review = require('../models/reviewModel')

mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// Define a new model for restaurant
const RawApiResponseSchema = new mongoose.Schema({}, { strict: false });
const ApiResponse = mongoose.model('ApiResponse', RawApiResponseSchema);

const SINGAPORE_LOCATION_LIST = [
    '1.345653,103.736804',   // Jurong East
    '1.289307,103.824438',   // Tiong Bahru
    '1.426941,103.827871',   // Yishun
    '1.351776,103.924688',   // Paya Lebar
    '1.333879,103.843559'    // Toa Payoh
  ];

async function fetchDetailsForRestaurant(restaurantId) {
    try {
        const reviewResponse = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
                place_id: restaurantId,
                key: process.env.GOOGLE_API_KEY,
                language: 'en',
            }
        });

        // Process and save reviewResponse as needed
        console.log(`Details for restaurant ${restaurantId}:`, reviewResponse.data);
        
        // Extract specific fields for the RestaurantDetails model
        const { reviews } = reviewResponse.data.result;

        // Save each review separately
        for (const review of reviews) {
            const restaurantReview = new Review({
                restaurantId: restaurantId,
                reviewerId: null,
                reviewerName: review.author_name,
                rating: review.rating,
                text: review.text,
                language: review.language,
            });

            await restaurantReview.save();
        }
        // Additional processing or saving logic for restaurant details
    } catch (error) {
        console.error(`Error fetching details for restaurant ${restaurantId}:`, error.message);
    }
}

async function fetchRestaurants(location, nextPageToken) {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?', {
            params: {
                location: location,
                radius: 7000, 
                type: 'restaurant',
                key: process.env.GOOGLE_API_KEY,
                pagetoken: nextPageToken || null
            }
        });

        console.log(response.data)

        for (const restaurant of response.data.results) {
            const apiResponse = new ApiResponse({
                ...restaurant
            });
            await apiResponse.save();

            // Make a second API call for each restaurant using its ID to show the reservation
            await fetchDetailsForRestaurant(restaurant.place_id);
        }

        if (response.data.next_page_token) {
            setTimeout(() => {
                fetchRestaurants(location, response.data.next_page_token);
            }, 5000); 
        } else {
            console.log(`Fetching completed for location: ${location}`);
            mongoose.connection.close();
        }

    } catch (error) {
        console.error(`Error fetching or saving restaurants for location ${location}:`, error.message);
        mongoose.connection.close();
    }
}


async function fetchRestaurantsForLocations() {
    for (const location of SINGAPORE_LOCATION_LIST) {
      await fetchRestaurants(location);
    }
  }
  
fetchRestaurantsForLocations();