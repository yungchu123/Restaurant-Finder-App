const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No Users found'})
    }
    res.json(users)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const{firstName, lastName, username, password, email, role} = req.body
    
    if(!firstName || !lastName || !username || !password || !email || !role){
        return res.status(400).json({message: 'All fields are required'})
    }

    // Check for duplicates
    const duplicate_username = await User.findOne({username}).lean().exec()
    const duplicate_email = await User.findOne({email}).lean().exec()

    if (duplicate_username) {
        return res.status(409).json({message: 'Duplicate username'})
    } else if (duplicate_email){
        return res.status(409).json({message: 'Duplicate email'})
    }

    // Hash Password
    const hashedPwd = await bcrypt.hash(password,10)
    const userObject = {firstName, lastName, username, "password":hashedPwd, email, role}

    // Create and store new user
    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({message: `New user ${username} created`})
    } else {
        res.status(400).json({message: 'Invalid user data received'})
    }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const {id, firstName, lastName, username, password, email, role} = req.body

    if(!id|| !firstName || !lastName || !username || !password || !email || !role){
        return res.status(400).json({message: 'All fields are required'})
    }

    const user = await User.findById(id).exec()
    if (!user){
        return res.status(400).json({message: 'User not found'})
    }

    // Check for duplicate
    const duplicate_username = await User.findOne({username}).lean().exec()
    const duplicate_email = await User.findOne({email}).lean().exec()

    if (duplicate_username && duplicate_username?._id.toString() !== id){
        return res.status(409).json({message: 'Duplicate username'})
    } else if (duplicate_email && duplicate_email?._id.toString() !== id){
        return res.status(409).json({message: 'Duplicate email'})
    }

    // Update the existing record with the new details
    user.firstName = firstName
    user.lastName = lastName
    user.username = username
    user.email = email
    user.role = role

    if (password){
        // Hash password
        user.password = await bcrypt.hash(password,10)
    }

    const updatedUser = await user.save()

    res.json({message: `${updatedUser.username} updated`})
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const {id} = req.body

    if (!id){
        return res.status(400).json({message: 'User ID required'})
    }

    const user = await User.findById(id).exec()

    if (!user){
        return res.status(400).json({message: 'User not found'})
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