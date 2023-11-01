
const express = require("express");
const mongoose = require("mongoose");
var cors = require('cors');
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const app = express();

//const dataPopulationProcess = require('./api.js');  

// configure CORS to allow requests from frontend react app
app.use(cors());
app.use(express.json())

// connect to mongodb atlas and populate database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Atlas");
    //await dataPopulationProcess();

  } catch (error) {
    console.error("Failed to connect to MongoDB Atlas", error);
    process.exit(1); 
  }
};

connectDB();

// routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/restaurants", require("./routes/restaurantRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// run server using "npm run dev" in terminal