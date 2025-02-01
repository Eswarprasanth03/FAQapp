require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const faqRoutes = require("./routes/faqRoutes");

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());

// Connect to the database
connectDB();

// Use the routes for FAQs
app.use("/api", faqRoutes);

// If in production, use environment variable for the port
const PORT = process.env.PORT || 5000;

// Make sure app is only started when not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the app for testing purposes
module.exports = app;

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const faqRoutes = require("./routes/faqRoutes");

// const app = express();
// app.use(express.json());
// app.use(cors());

// connectDB();

// app.use("/api", faqRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
