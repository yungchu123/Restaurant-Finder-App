const express = require("express");
const mongoose = require("mongoose");
var cors = require('cors');
require("dotenv").config();

const PORT = process.env.PORT || 5001;
const app = express();

// Configure CORS to allow requests from frontend react app
app.use(cors());

app.use(express.json())

// Connect to mongodb atlas

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Could not connect to MongoDB Atlas", error);
    process.exit(1); 
  }
};

connectDB();

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/restaurants", require("./routes/restaurantRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Run server using "npm run dev" in terminal