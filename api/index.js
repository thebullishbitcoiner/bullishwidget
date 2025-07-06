const express = require("express");
const app = express();
const MainRouter = require("../Routers/Main");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({ error: err.message });
});

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Handle API routes
app.use("/", MainRouter);

// Export the Express app for Vercel
module.exports = app;
