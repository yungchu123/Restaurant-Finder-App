const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    restaurantId: String,
    restaurantName: String,
    author_name: String,
    rating: Number,
    text: String,
    language: String
});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review; 