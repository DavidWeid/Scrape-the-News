///// Dependencies /////
var express = require("express");
var exphbs = require("express-handlebars");
var routes = require("./routes/routes.js");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require all models
var db = require("./models");

// Set up local port
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

///// Middleware Configuration /////

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
// Set handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Give server access to routes
app.use(routes);
// Connect to the Mongo DB ("newScraper")
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newScraper";
// If deployed, use the deployed database, otherwise use the local newScraper database
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// When the server starts, create and save a new User document to the db
// db.User.create({ name: "Troye Sivan" })
//   .then(function(dbUser) {
//     console.log(dbUser);
//   })
//   .catch(function(err) {
//     console.log(err.message);
//   });

// Start the server
app.listen(PORT, function() {
  console.log(
    "App running on Port %s." + "\n Visit http://localhost:%s",
    PORT,
    PORT
  );
});
