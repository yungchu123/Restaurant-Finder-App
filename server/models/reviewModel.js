const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    restaurantId: String,
    restaurantName: String,
    authorId: String,
    authorName: String,
    rating: Number,
    text: String,
    language: { type: String, default: "en" }
});
const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;