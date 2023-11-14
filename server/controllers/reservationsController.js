const asyncHandler = require('express-async-handler')
const CustomError = require('../utils/customError')
const Reservation = require('../models/reservationModel')

// @desc Get reservation
// @route GET /reservations
// @access Private
const getAllReservations = asyncHandler(async (req, res) => {
    const reservations = await Reservation.find().lean()
    if (!reservations?.length) {
        res.status(400).json({ error: 'No reservations found'})
        throw new CustomError(400, 'No reservations found')
    }
    res.json(reservations)
})

// @desc Get reservation
// @route GET /reservations/:id
// @access Private
const getReservation = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findOne({ _id: {$eq: req.params.id} }).lean()
    if (!reservation) {
        res.status(400).json({ error: 'No reservation found'})
        throw new CustomError(400, 'No reservation found')
    }
    res.json(reservation)
})

// @desc Update reservation details
// @route PATCH /reservations/:id
// @access Private
const updateReservation = asyncHandler(async (req,res) => {
    const{
        tableNumber,
        partySize,
        reservationDate,
        reservationTime,
        status
    } = req.body

    // Create an object with only the defined fields from req.body
    const updatedFields = {
        ...(tableNumber && { tableNumber }),
        ...(partySize && { partySize }),
        ...(reservationDate && { reservationDate }),
        ...(reservationTime && { reservationTime }),
        ...(status && { status }),
    };

    // Update reservation and return updated document
    const updatedReservation = await Reservation.findOneAndUpdate(
        {_id: req.params.id},
        {$set: updatedFields},
        {new: true, runValidators: true}
    )

    if (!updatedReservation){
        res.status(400).json({ error: 'Reservation not found' })
        throw new CustomError(400, 'Reservation not found')
    }

    console.log(updatedReservation)
    res.json(updatedReservation)
})


module.exports = {
    getAllReservations,
    getReservation,
    updateReservation,
}