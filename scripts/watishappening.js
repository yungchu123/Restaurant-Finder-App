const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();
const Review = require('../server/models/reviewModel')

mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

const RawApiResponseSchema = new mongoose.Schema({}, { strict: false });
const ApiResponse = mongoose.model('Restaurant', RawApiResponseSchema);

const SINGAPORE_LOCATION_LIST = [
    '1.345653,103.736804',   // Jurong East
    '1.289307,103.824438',   // Tiong Bahru
    '1.426941,103.827871',   // Yishun
    '1.351776,103.924688',   // Paya Lebar
    '1.333879,103.843559'    // Toa Payoh
  ];

// async function fetchDetailsForRestaurant(restaurantId) {
//     try {
//         const reviewResponse = await axios.get('https://maps.googleapis.com/maps/api/place/details/json?', {
//             params: {
//                 place_id: restaurantId,
//                 key: process.env.GOOGLE_API_KEY
//             }
//         });

//         const { reviews } = reviewResponse.data.result;
        
//         for (const review of reviews){
//             // save each review to database without using reviewModel
//             const reviewInstance = new Review(review);
//             // console.log(reviewInstance);
//             await reviewInstance.save();
//         }
        
//         for (const review of reviews) {
//             // const restaurantReview = new Review({
//             //     restaurantId: restaurantId,
//             //     reviewerName: review.author_name,
//             //     rating: review.rating,
//             //     text: review.text,
//             //     language: review.language
//             // });

//         }
        
//     } catch (error) {
//         console.error(`Error fetching details for restaurant ${restaurantId}:`, error.message);
//     }
// }


let restaurantIdList = [];

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

        for (const restaurant of response.data.results) {
            const apiResponse = new ApiResponse({
                ...restaurant
            });
            await apiResponse.save();

            restaurantIdList.push(restaurant.place_id);
            // await fetchDetailsForRestaurant(restaurant.place_id);

        }

        if (response.data.next_page_token) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            return fetchRestaurants(location, response.data.next_page_token);
        }

        console.log(`Fetching completed for location: ${location}`);

    } catch (error) {
        console.error(`Error fetching or saving restaurants for location ${location}:`, error.message);
    }
}

async function fetchRestaurantsForLocations() {
    for (const location of SINGAPORE_LOCATION_LIST) {
      await fetchRestaurants(location);
    }
}

async function fetchPlaceDetails(placeId) {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
                place_id: placeId,
                key: process.env.GOOGLE_API_KEY,
                fields: 'reviews'
            }
        });

        const reviews = response.data.result.reviews || [];

        for (let review of reviews) {
            const reviewData = {
                restaurantId: placeId,
                author_name: review.author_name,
                rating: review.rating,
                text: review.text,
                language: review.language
            };

            await Review.create(reviewData);
        }

        console.log(`Fetched and saved reviews for placeId: ${placeId}`);

    } catch (error) {
        console.error(`Error fetching details for placeId: ${placeId}`, error);
    }
}

async function main() {
    await fetchRestaurantsForLocations();
    for(let id of restaurantIdList){
        await fetchPlaceDetails(id);
    }
    mongoose.connection.close();
    console.log('All restaurants and reviews have been fetched!');
    // console.log(restaurantIdList);
}

main();