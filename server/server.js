const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json())

// connect to mongodb atlas

require("dotenv").config();
const dbURI = process.env.DATABASE_URI;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("Could not connect to MongoDB Atlas", error));

mongoose.connection.once("open", () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

// run server using "npm run dev" in terminal

const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);
