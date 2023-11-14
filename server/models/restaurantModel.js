const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        required: true
    },
    tableCapacity: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        required: true
    }
});

const restaurantSchema = new mongoose.Schema({
    restaurantId: {
        type: String,
        trim: true,
    },
    restaurantName: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
    },
    rating: {
        type: Number,
        default: 5.0
    },
    numReviews: {
        type: Number,
    },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
    },
    cuisine: {
        type: String,
        enum: ['Chinese', 'Thai', 'Indian', 'Mexican', 'Western', 'Japanese', 'Korean', 'Italian', 'Vietnamese', 'Muslim', 'French', 'Spanish', 'American']
    },
    photoReference: {
        type: String,
        default: null
    },
    createdBy: {
        type: String,
        default: null,
        trim: true
    },
    tables: {
        type: [tableSchema],
        default: function() {
            return Array.from({ length: 15 }, (_, index) => ({
                tableNumber: index + 1,
                tableCapacity: index < 5 ? 2 : (index < 10 ? 4 : (index < 13 ? 6 : 8)),
                isAvailable: true
            }));
        }
    }
});

// allows for geospatial queries e.g. find restaurants within 5km of a location
restaurantSchema.index({ location: '2dsphere' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;