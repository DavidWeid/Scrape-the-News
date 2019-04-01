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

// GET route to scrape for some articles AND send scraped articles to the User
// We're not storing articles in the db here, just showing potential articles to the User
router.get("/api/scrape", function(req, res) {
  // Grab the body of the html of npr news with axios
  axios.get("https://www.npr.org/sections/world/").then(function(response) {
    // Load body into cheerio and save it to $ for use as a selector
    var $ = cheerio.load(response.data);

    // Establish our result array to store each article object
    var result = [];

    // Grab every h2 tag within an article tag
    $("article h2").each(function(i, element) {

      // Grab title text, link, and teaser text - push into result array
      var title = $(this)
        .children("a")
        .text();
      var link = $(this)
        .children("a")
        .attr("href");
      var teaser = $(this)
        .parent()
        .children("p")
        .children("a")
        .text();

      result.push({
          title: title,
          link: link,
          teaser: teaser
      });
      
      console.log("\n Results of the Scrape: \n" + result);

    });

    // Return scraped articles as an array of objects
    res.json(result);
  });
});

router.post("/api/save/article", function(req, res) {
    console.log("- - - - - POST ROUTE TO SAVE AN ARTICLE");
    console.log(req.body);
    var newArticle = req.body;
    db.Article.create(newArticle).then(function(dbArticle) {
        console.log(dbArticle);
    }).catch(function(err) {
        console.log("Article Not Added");
    });
    res.send("Connected");
})

router.get("/saved-articles", function(req, res) {
    db.Article.find({}).then(function(savedArticlesdb) {
        var hbsObject = {
            articles: savedArticlesdb
        };
        console.log(hbsObject);
        res.render("saved", hbsObject);
    })
})

// Get all Articles from the db (articles that have been saved by the User)
router.get("/api/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticles) {
      res.json(dbArticles);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Get all Users from the db
router.get("/api/users", function(req, res) {
  db.User.find({})
    .then(function(dbUsers) {
      res.json(dbUsers);
    })
    .catch(function(err) {
      res.json(err);
    });
});

module.exports = router;
