const fetch = require('node-fetch');
const mongoose = require('mongoose');
require('dotenv').config();

const reservationSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: mongoose.Types.ObjectId,
  },
  tableNumber: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'accepted', 'declined'],
    default: 'available',
  },
});

const tableSchema = new mongoose.Schema({
  tableNumber: {
      type: Number,
      required: true
  },
  tableType: {
      type: Number,
      required: true
  },
  isAvailable: {
      type: Boolean,
      required: true
  }
});

const restaurantSchema = new mongoose.Schema({
    restaurantId: String,
    restaurantName: String,
    description: String,
    rating: Number,
    numReviews: Number,
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    cuisine: String,
    photoReference: String,
    createdBy: {
      type: String,
      default: null,
      trim: true
    },
    reservations: {
      type: [reservationSchema], 
      default: []
    },
    tables: {
      type: [tableSchema],
      default: function() {
          return Array.from({ length: 15 }, (_, index) => ({
              tableNumber: index + 1,
              tableType: index < 3 || index >= 12 ? 2 : 4,
              isAvailable: true
          }));
      }
  }

});
restaurantSchema.index({ location: '2dsphere' });
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

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

const cuisines = ['Chinese', 'Thai', 'Indian', 'Mexican', 'Western', 'Japanese', 'Korean', 'Italian', 'Vietnamese', 'Muslim', 'French', 'Spanish', 'American'];

const endpoint = 'https://api.stb.gov.sg/content/food-beverages/v2/search';
const headers = {
  'Accept': 'application/json',
  'X-Content-Language': 'en',
  'X-API-Key': process.env.TIH_API_KEY
};

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

async function clearCollection() {
    try {
      const deleteReviewsResult = await Review.deleteMany({});
      console.log(`Deleted ${deleteReviewsResult.deletedCount} documents from the reviews collection.`);

      const deleteRestaurantsResult = await Restaurant.deleteMany({});
      console.log(`Deleted ${deleteRestaurantsResult.deletedCount} documents from the restaurants collection.`);
    } catch (error) {
      console.error('Error clearing collections:', error.message);
    }
}

async function processCuisines() {
    for (const cuisine of cuisines) {
      console.log(`Processing cuisine: ${cuisine}`);
      await fetchAndInsertCuisine(cuisine);
    }
}

async function fetchAndInsertCuisine(cuisine) {
    const params = new URLSearchParams({
      'searchType': 'keyword',
      'searchValues': cuisine,
      'limit': 50
    });
  
    try {
      const response = await fetch(`${endpoint}?${params}`, {
        method: 'GET',
        headers: headers
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && Array.isArray(data.data)) {
        const restaurants = data.data.filter(item => item.type === 'Restaurants');
        await insertData(restaurants, cuisine);

      } else {
        console.log(`No restaurant data found for cuisine: ${cuisine}`);
      }
    } catch (error) {
      console.error(`Failed to fetch data for cuisine: ${cuisine}:`, error);
    }
}

async function insertData(data, cuisine) {
  try {
    const insertedRestaurantNames = [];
   
    const restaurantsToInsert = data.map(restaurant => ({
      restaurantId: restaurant.uuid,
      restaurantName: restaurant.name,
      description: restaurant.description === "Description" ? restaurant.name : restaurant.description,
      rating: restaurant.rating,
      numReviews: Math.floor(Math.random()*200),
      location: {
        type: 'Point',
        coordinates: [restaurant.location.longitude, restaurant.location.latitude]
      },
      cuisine: cuisine,
      createdBy: null,
      reservations: [],
      tables: []
    }));

    for (const restaurant of restaurantsToInsert) {
      const placeId = await getPlaceId(restaurant.restaurantName);
      if (placeId) {
        const placeDetails = await getPlaceDetails(placeId);
        if (Array.isArray(placeDetails.photos) && placeDetails.photos.length > 0) {
          const ref = placeDetails.photos[0].photo_reference;
          if (ref) {
            restaurant.photoReference = ref;
          } else {
            continue; 
          }
        } else {
          continue; 
        }
      } else {
        continue; 
      }
      const savedRestaurant = await new Restaurant(restaurant).save();
      insertedRestaurantNames.push(savedRestaurant.restaurantName);
      console.log(`Restaurant ${savedRestaurant.restaurantName} inserted into the database.`);
    }

    for (const restaurant of data) {
      if(!insertedRestaurantNames.includes(restaurant.name)){
        continue;
      }
      await fetchAndInsertReviews(restaurant);
    }

  } catch (err) {
    console.error('Failed to insert data into MongoDB:', err);
  }
} 

// async function getPlacePhotoUrl(photoReference) {
    
//     const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&maxheight=1000&photoreference=${photoReference}&key=${process.env.GOOGLE_API_KEY}`;
//     return photoUrl;
// }

async function fetchAndInsertReviews(restaurant) {
    
    const reviews = restaurant.reviews || [];
    
    const reviewsToInsert = reviews.map(review => ({
      restaurantId: restaurant.uuid,
      restaurantName: restaurant.name,
      authorId: null,
      authorName: review.authorName,
      rating: review.rating,
      text: review.text,
      language: review.language
    }));
  
    try {
      if (reviewsToInsert.length > 0) {
        const insertedReviews = await Review.insertMany(reviewsToInsert);
        console.log(`Inserted ${insertedReviews.length} reviews for restaurant ${restaurant.name}`);
      }
    } catch (error) {
      console.error(`Error inserting reviews for restaurant ${restaurant.name}: `, error);
    }
}

async function getPlaceId(name) {
    const params = new URLSearchParams({
      input: name,
      inputtype: 'textquery',
      fields: "place_id",
      key: process.env.GOOGLE_API_KEY
    });
  
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].place_id;
    } else {
        console.log(`No place_id found for ${name}`);
        return null; 
    }
}

async function getPlaceDetails(placeId) {
    const params = new URLSearchParams({
      place_id: placeId,
      language: 'en',
      fields: ["name", "place_id", "photos", "price_level"],
      key: process.env.GOOGLE_API_KEY
    });
  
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const details = await response.json();
    return details.result; 
}

// async function getPlacePhotos(photo_reference){
//     const params = new URLSearchParams({
//         photoreference: photo_reference,
//         maxheight: 1000,
//         maxwidth: 1000,
//         key: process.env.GOOGLE_API_KEY
//     });

//     const response = await fetch(`https://maps.googleapis.com/maps/api/place/photo?${params}`);
//     if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//     const photo = await response.json();
//     return photo;
// }

async function removeDuplicates() {
    try {
        const restaurantDuplicates = await Restaurant.aggregate([
            {
                $group: {
                    _id: { restaurantName: "$restaurantName", coordinates: "$location.coordinates" },
                    uniqueIds: { $addToSet: "$_id" },
                    count: { $sum: 1 }
                }
            },
            {
                $match: {
                    count: { $gt: 1 }
                }
            }
        ]);

        for (const duplicate of restaurantDuplicates) {
            const idsToDelete = duplicate.uniqueIds.slice(1);
            await Restaurant.deleteMany({ _id: { $in: idsToDelete } });
        }

        const reviewDuplicates = await Review.aggregate([
            {
                $group: {
                    _id: { restaurantId: "$restaurantId", restaurantName: "$restaurantName", authorName: "$authorName", text: "$text", rating: "$rating", language: "$language"},
                    uniqueIds: { $addToSet: "$_id" },
                    count: { $sum: 1 }
                }
            },
            {
                $match: {
                    count: { $gt: 1 }
                }
            }
        ]);

        for (const duplicate of reviewDuplicates) {
            const idsToDelete = duplicate.uniqueIds.slice(1);
            await Review.deleteMany({ _id: { $in: idsToDelete } });
        }

        console.log("Removed all duplicated restaurants and reviews.")

    } catch (error) {
        console.error('Error removing duplicates:', error);
    }
}

async function main() {
    try {
      await connectToMongoDB();
      await clearCollection();
      await processCuisines();
      await removeDuplicates();
    } catch (error) {
      console.error('An error occurred during processing:', error);
    } finally {
      await mongoose.disconnect();
    }
}
  
main().catch(console.error);