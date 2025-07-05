const express = require("express");
const app = express();
const MainRouter = require("../Routers/Main");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Only handle API routes
app.use("/api", MainRouter);

// Export the Express app for Vercel
module.exports = app;
