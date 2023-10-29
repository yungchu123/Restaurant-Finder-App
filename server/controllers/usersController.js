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

// @desc Get a user
// @route GET /user/:id
// @access Private
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: { $eq: req.params.id} }).select('-password').lean()
    if (!user) {
        throw CustomError(400, 'No Users found')
    }
    console.log(user)
    res.json(user)
})

// @desc Login user
// @route POST /users/login
// @access Private
const loginUser = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { username, password } = req.body

    if(!username || !password){
        res.status(400).json({ error: 'All fields are required' })
        throw new Error('All fields are required')
    }

    const user = await User.findOne({username: { $eq: username } })
    if (!user) {
        res.status(400).json({ error: 'No Users found' })
        throw new CustomError(400, 'No Users found')
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        res.status(401).json({ error: 'Password is incorrect' })
        throw new CustomError(401, 'Password is incorrect')
    }

    res.json(user)
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
            res.status(409).json({ error: 'Username is taken' })
            throw new CustomError(409, 'Duplicate username')
        } else {
            res.status(409).json({ error: 'Email is taken' })
            throw new CustomError(409, 'Duplicate email')
        }
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password,10)
    const userObject = {firstName, lastName, username, "password":hashedPwd, email, role}

    // Create and store new user
    const user = await User.create(userObject)

    if (user) {
        console.log(`New user ${username} created`)
        res.status(201).json(user)
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
    getUser,
    loginUser,
    createNewUser,
    updateUser,
    deleteUser
}