// npm install axios dotenv mongoose

const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const RawApiResponseSchema = new mongoose.Schema({}, { strict: false });
const ApiResponse = mongoose.model('ApiResponse', RawApiResponseSchema);

const GOOGLE_API_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?'
const SINGAPORE_LOCATION = '1.3521,103.8198'

async function fetchRestaurants(nextPageToken) {
    try {
        const response = await axios.get(GOOGLE_API_ENDPOINT, {
            params: {
                location: SINGAPORE_LOCATION,
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
                fetchRestaurants(response.data.next_page_token);
            }, 5000); 
        } else {
            console.log('Fetching completed');
            mongoose.connection.close();
        }

    } catch (error) {
        console.error('Error fetching or saving restaurants:', error.message);
        mongoose.connection.close();
    }
}


fetchRestaurants();