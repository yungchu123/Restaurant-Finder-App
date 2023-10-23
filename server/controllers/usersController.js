const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const CustomError = require('../utils/customError')

// @desc Get all users in database
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        throw CustomError(400, 'No Users found')
    }
    res.json(users)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const{firstName, lastName, username, password, email, role} = req.body
    
    // Missing fields
    console.log(req.body)
    if(!firstName || !lastName || !username || !password || !email || !role){
        throw new CustomError(400, 'All fields are required')
    }

    // Check for duplicates
    const duplicateUser = await User.findOne({
        $or:[{username}, {email}]
    }).lean().exec()

    if (duplicateUser) {
        if (duplicateUser.username === username) {
            throw new CustomError(409, 'Duplicate username')
        } else {
            throw new CustomError(409, 'Duplicate email')
        }
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password,10)
    const userObject = {firstName, lastName, username, "password":hashedPwd, email, role}

    // Create and store new user
    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({message: `New user ${username} created`})
    } else {
        throw new CustomError(400, 'Invalid user data received')
    }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const {id, firstName, lastName, username, password, email, role} = req.body

    if(!id|| !firstName || !lastName || !username || !password || !email || !role){
        throw new CustomError(400, 'All fields are required')
    }

    // Check for duplicates
    const duplicateUser = await User.findOne({
        $or:[{username}, {email}],
        _id:{$ne:id}
    }).lean().exec()

    if (duplicateUser) {
        if (duplicateUser.username === username) {
            throw new CustomError(409, 'Duplicate username')
        } else {
            throw new CustomError(409, 'Duplicate email')
        }
    }

    // Prepare updated fields
    const updatedFields = {
        firstName,
        lastName,
        username,
        email,
        role
    }

    if (password){
        // Hash password
        const hashedPassword = await bcrypt.hash(password,10)
        updatedFields.password = hashedPassword
    }

    // Update user and return updated document
    const updatedUser = await User.findOneAndUpdate(
        {_id:id},
        {$set: updatedFields},
        {new: true, runValidators: true}
    )

    if (!updatedUser){
        throw new CustomError(400, 'User not found')
    }

    res.json({message: `${updatedUser.username} updated`})
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const {id} = req.body

    if (!id){
        throw new CustomError(400, 'User ID required')
    }

    const user = await User.findById(id).exec()

    if (!user){
        throw new CustomError(400, 'User not found')
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result.id} has been deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}