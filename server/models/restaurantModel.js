const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    cuisine: {
        type: String,
        enum: ['Chinese', 'Malay', 'Indian', 'Western', 'Japanese', 'Korean', 'Vietnamese'],
        required: true
    },
    dietaryOptions: [{
        type: String,
        enum: ['Halal', 'Vegetarian', 'Dairy-free', 'Gluten-free']
    }],
    priceRange: {
        type: String,
        enum: ['Cheap', 'Affordable', 'Expensive', 'Luxury'],
        required: true
    },
    averageRating: {
        type: Number,
        default: 0
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }

});

// Allows for geospatial queries e.g. find restaurants within 5km of a location
restaurantSchema.index({ location: '2dsphere' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;