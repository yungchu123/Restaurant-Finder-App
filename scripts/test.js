// npm install axios dotenv mongoose

const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const RawApiResponseSchema = new mongoose.Schema({}, { strict: false });
const ApiResponse = mongoose.model('ApiResponse', RawApiResponseSchema);

const GOOGLE_API_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?'
//const SINGAPORE_LOCATION = '1.3521,103.8198'

const SINGAPORE_LOCATION_LIST = [
    '1.345653,103.736804',   // Jurong East
    '1.289307,103.824438',   // Tiong Bahru
    '1.426941,103.827871',   // Yishun
    '1.351776,103.924688',   // Paya Lebar
    '1.333879,103.843559'    // Toa Payoh
  ];

async function fetchRestaurants(location, nextPageToken) {
    try {
        const response = await axios.get(GOOGLE_API_ENDPOINT, {
            params: {
                location: location,
                radius: 50000, 
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