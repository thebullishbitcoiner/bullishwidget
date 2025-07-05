const express = require("express");
const app = express();
const MainRouter = require("../Routers/Main");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Handle API routes
app.use("/", MainRouter);

// Export the Express app for Vercel
module.exports = app;
