const mongoose = require("mongoose");

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
    },
    _id: {
        type: {
            type: Number,
            required: true
        }
    },
    createdBy: {
        type: String,
        required: true,
        trim: true,
    },
    reservations: {
        type: [reservationSchema], // Indicate that it is an array of reservationSchema
        default: [], // Initialize it as an empty array
      },
    tables: [
        { tableNumber: 1, tableType: 2, isAvailable: true },
        { tableNumber: 2, tableType: 2, isAvailable: true },
        { tableNumber: 3, tableType: 2, isAvailable: true },
        { tableNumber: 4, tableType: 4, isAvailable: true },
        { tableNumber: 5, tableType: 4, isAvailable: true },
        { tableNumber: 6, tableType: 4, isAvailable: true },
        { tableNumber: 7, tableType: 4, isAvailable: true },
        { tableNumber: 8, tableType: 4, isAvailable: true },
        { tableNumber: 9, tableType: 4, isAvailable: true },
        { tableNumber: 10, tableType: 4, isAvailable: true },
        { tableNumber: 11, tableType: 4, isAvailable: true },
        { tableNumber: 12, tableType: 4, isAvailable: true },
        { tableNumber: 13, tableType: 2, isAvailable: true },
        { tableNumber: 14, tableType: 2, isAvailable: true },
        { tableNumber: 15, tableType: 2, isAvailable: true },
      ],
    });

// Allows for geospatial queries e.g. find restaurants within 5km of a location
restaurantSchema.index({ location: '2dsphere' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;