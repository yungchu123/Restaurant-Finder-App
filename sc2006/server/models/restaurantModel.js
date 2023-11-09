const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
    tableType: {
      type: String,
      enum: ["Table for 2", "Table for 4"],
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true, // Tables are initially available
    },
    // Add other properties specific to each table as needed
  });

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
        enum: ['$', '$$', '$$$', '$$$$'],
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
    _id: {
        type: {
            type: Number,
            required: true
        }
    }
    createdBy: {
        type: String,
        required: true,
        trim: true,
    },
    tables: {[
        ...Array(3).fill({ tableType: "Table for 2" }),
        ...Array(3).fill({ tableType: "Table for 4" }),
        ...Array(3).fill({ tableType: "Table for 4" }),
        ...Array(3).fill({ tableType: "Table for 4" }),
        ...Array(3).fill({ tableType: "Table for 2" }),
      ],
      required: true
    }
});

// Allows for geospatial queries e.g. find restaurants within 5km of a location
restaurantSchema.index({ location: '2dsphere' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;