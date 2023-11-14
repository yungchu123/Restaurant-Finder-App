const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    restaurantId: {
        type: String,
        required: true,
    },
    customerId: {
        type: String,
        required: true,
    },
    tableNumber: {
        type: Number,
    },
    partySize:{
        type: Number,
        required: true,
    },
    reservationDate: {
        type: Date,
        required: true,
    },
    reservationTime: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined']
    },
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;