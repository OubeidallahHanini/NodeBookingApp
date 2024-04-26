const express = require("express");
const connectToDb = require("./config/connecttodb"); // Corrected the import statement

require("dotenv").config();

const app = express();

app.use(express.json());


const PORT = process.env.PORT || 8008;

// You need to use template literals (backticks) for string interpolation
app.listen(PORT, () =>
  console.log(`Server is running ${process.env.NODE_ENV} mode on port ${PORT}`)
);

connectToDb(); // Corrected the function name

// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/salles", require("./routes/SalleRoute"));
app.use("/api/reservation" , require ("./routes/ReserverRoute"));


// config/connecttodb.js
const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Connection failed", error);
  }
};

