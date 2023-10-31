require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');

/*
async function connectToMongoDB() {
    try {
        await mongoose.connect('mongodb+srv://ngshangyau:I4qiElFHx5alSbIu@cluster0.eaqnxlm.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1); 
    }
}
*/

const connectToMongoDB = async () => {
    try {
      await mongoose.connect(process.env.DATABASE_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB Atlas");
  
    } catch (error) {
      console.error("Failed to connect to MongoDB Atlas", error);
      process.exit(1); 
    }
  };

mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});

// create a restaurant model
const restaurantSchema = new mongoose.Schema({}, { strict: false });
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// create a review model
const reviewSchema = new mongoose.Schema({
    restaurantId: String,
    restaurantName: String,
    authorId: String,
    authorName: String,
    rating: Number,
    text: String,
    language: String
});

const Review = mongoose.model('Review', reviewSchema);

// Clearing the collection before API calling
async function clearCollection() {
    try {
      // Use deleteMany to remove all documents in the collection
      const deleteReviewsResult = await Review.deleteMany({});
      console.log(`Deleted ${deleteReviewsResult.deletedCount} documents from the collection.`);

      const deleteRestaurantsResult = await Restaurant.deleteMany({});
      console.log(`Deleted ${deleteRestaurantsResult.deletedCount} documents from the collection.`);
    } catch (error) {
      console.error('Error clearing collection:', error.message);
    }
}


const SINGAPORE_LOCATION_LIST = [
    '1.345653,103.736804',   // Jurong East
    '1.289307,103.824438',   // Tiong Bahru
    '1.426941,103.827871',   // Yishun
    '1.351776,103.924688',   // Paya Lebar
    '1.333879,103.843559'    // Toa Payoh
];

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
            const restaurantInstance = new Restaurant({
                ...restaurant
            });
            await restaurantInstance.save();
            const savedRestaurantId = restaurantInstance._id;

            await(fetchReviews(restaurant.place_id, savedRestaurantId));
        }

        if (response.data.next_page_token) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            return fetchRestaurants(location, response.data.next_page_token);
        }

        console.log(`Fetching restaurants completed for location: ${location}`);

    } catch (error) {
        console.error(`Error fetching or saving restaurants for location ${location}:`, error.message);
    }
}

async function fetchRestaurantsForAllLocations() {
    for (const location of SINGAPORE_LOCATION_LIST) {
        await fetchRestaurants(location);
    }
}

async function fetchReviews(placeId, savedRestaurantId) {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
                place_id: placeId,
                key: process.env.GOOGLE_API_KEY
            }
        });

        const reviews = response.data.result.reviews || [];
        const name = response.data.result.name;

        const reviewPromises = reviews.map(review => {
            const reviewData = {
                restaurantId: savedRestaurantId,
                restaurantName: name,
                authorId: null,
                authorName: review.author_name,
                rating: review.rating,
                text: review.text,
                language: review.language
            };

            return Review.create(reviewData);
        });

        await Promise.all(reviewPromises);

        console.log(`Fetching reviews completed for restaurantId: ${savedRestaurantId}`);

    } catch (error) {
        console.error(`Error fetching or saving reviews for restaurantId: ${savedRestaurantId}`, error);
    }
}

async function main() {
    try {
        console.log('DATABASE_URI:', process.env.DATABASE_URI);
        await connectToMongoDB();
        await clearCollection();
        await fetchRestaurantsForAllLocations();

        mongoose.connection.close();
        console.log('All restaurants and reviews have been fetched!');
    } catch (error) {
        console.error("Error in main function:", error);
    }
}

module.exports = main; 

if (require.main === module) {
    main();
}