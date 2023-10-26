const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();

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
app.use("/users", require("./routes/userRoutes"));
app.use("/restaurants", require("./routes/restaurantRoutes"));
app.use("/reviews", require("./routes/reviewRoutes"));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Run server using "npm run dev" in terminal