const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 30005;
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://ngshangyau:I4qiElFHx5alSbIu@cluster0.eaqnxlm.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas', error);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({ message: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
