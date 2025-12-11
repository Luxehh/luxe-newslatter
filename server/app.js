const express = require("express");
const cors = require("cors"); // Import CORS
const path = require("path"); // For serving static files
const connectDB = require("./config/db");
const patientRoutes = require("./routes/patientRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const newsletterTemplateRoutes = require("./routes/newsletterTemplateRoutes");
require("dotenv").config();

const app = express();

// CORS Configuration for Production
const corsOptions = {
  // origin: "https://hfmessages.luxehh.com",
  origin: (origin, callback) => {
    callback(null, true); // Allow all origins
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow these HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
  credentials: true, // Allow cookies or authorization headers
};

// Use CORS middleware
app.use(cors(corsOptions));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/patients", patientRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/newsletter-templates", newsletterTemplateRoutes);

// Connect to MongoDB
connectDB();

// Start Cron Jobs
require("./cron/updateHiddenFlag"); // Patient messaging cron (11:30 PM CST)
require("./cron/disableCompletedSubscriptions"); // Auto-disable after 12 newsletters (8:15 PM IST)
require("./cron/sendNewsletterCron"); // Send monthly newsletters (8:30 PM IST)
require("./cron/sendResubscriptionReminder"); // Send re-subscription reminder on 13th month (8:45 PM IST)
// require("./cron/restart"); // Uncomment if needed

// Logging middleware for incoming requests (optional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

module.exports = app;
