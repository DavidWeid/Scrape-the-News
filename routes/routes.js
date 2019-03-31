var express = require("express");
var router = express.Router();
var db = require("../models");

// Scrape with axios and cheerio
var axios = require("axios");
var cheerio = require("cheerio");

// Render our index-handlebars page
router.get("/", function(req, res) {
  res.render("index");
});

// Get all Articles from the db
router.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticles) {
      res.json(dbArticles);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Get all Users from the db
router.get("/users", function(req, res) {
  db.User.find({})
    .then(function(dbUsers) {
      res.json(dbUsers);
    })
    .catch(function(err) {
      res.json(err);
    });
});

module.exports = router;
