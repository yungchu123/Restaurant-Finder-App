const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    restaurantId: String,
    reviewerId: String,
    reviewerName: String,
    rating: Number,
    text: String,
    language: String,
});

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;