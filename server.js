///// Dependencies /////
var express = require("express");
var exphbs = require("express-handlebars");
var routes = require("./routes/routes.js");
var logger = require("morgan");
var mongoose = require("mongoose");

// Scrape with axios and cheerio
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// Set up local port
var PORT = 3000;

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
// Connect to the Mongo DB ("")
mongoose.connect("mongodb://localhost/db", { useNewUrlParser: true });
// Set handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Give server access to routes
app.use(routes);


// Start the server
app.listen(PORT, function() {
    console.log("App running on Port %s." + "\n Visit http://localhost:%s", PORT, PORT);
});