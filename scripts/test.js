// npm install axios dotenv mongoose

const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const SINGAPORE_LOCATION = '1.3521,103.8198';
const RADIUS = 50000;

const restaurantSchema = new mongoose.Schema({}, { strict: false });
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

async function fetchData() {
    let nextPageToken;

    try {
        await mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        let params = {
            location: SINGAPORE_LOCATION,
            radius: RADIUS,
            type: 'restaurant',
            key: GOOGLE_API_KEY
        };

        do {
            let response = await axios.get(PLACES_API_URL, { params: params });

            if (response.data && response.data.results) {
                for (let result of response.data.results) {
                    const restaurant = new Restaurant(result);
                    await restaurant.save();
                }
            }

            nextPageToken = response.data.next_page_token;
            if (nextPageToken) {
                params.pagetoken = nextPageToken;
            }

        } while (nextPageToken);

        console.log("Data fetched and inserted into MongoDB.");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        mongoose.connection.close();
    }
}

fetchData();
