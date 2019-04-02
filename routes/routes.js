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

// This POST route allows the User to save an article to the db
router.post("/api/save/article", function(req, res) {
  console.log("- - - - - POST ROUTE TO SAVE AN ARTICLE");
  console.log(req.body);
  var newArticle = req.body;
  db.Article.create(newArticle)
    .then(function(dbArticle) {
      console.log(dbArticle);
      res.send("Article Added");
    })
    .catch(function(err) {
      console.log("Article Not Added");
      res.send("Article Not Added");
    });
});

// This GET route finds all saved articles in the db and renders a "saved" page with the articles
router.get("/saved-articles", function(req, res) {
  db.Article.find({}).then(function(savedArticlesdb) {
    var hbsObject = {
      articles: savedArticlesdb
    };
    console.log(hbsObject);
    res.render("saved", hbsObject);
  });
});

// POST route to remove an article from our Article collection
router.post("/api/saved-articles/:id", function(req, res) {
  console.log("- - - - - - - - - - ");
  console.log("Let's delete an article with id: ");
  console.log(req.params.id);
  console.log("- - - - - - - - - - ");

  db.Article.remove({ _id: req.params.id })
    .then(function(data) {
      res.send("Article Deleted");
    })
    .catch(function(err) {
      res.json(err);
    });
});

// GET route that goes to a handlebars page that renders the article and its comments
router.get("/saved-articles/article-comments/:id", function(req, res) {
  var request = req.params.id;
  console.log("The request is: ");
  console.log(request);
  db.Article.findOne({ _id: request })
    .populate("comments")
    .then(function(commentOnThis) {
      console.log("We found this article");
      console.log(commentOnThis);
      var hbsObject = {
        article: [commentOnThis],
        comments: commentOnThis.comments
      };
      console.log("The hbsObject is: ");
      console.log(hbsObject);
      res.render("articleComments", hbsObject);
    });
});

// POST route for adding a comment to an Article
router.post("/api/articles/:id", function(req, res) {
  console.log("- - - - - - - - - - ");
  console.log("Let's add a comment with id: ");
  console.log(req.params.id);
  console.log("- - - - - - - - - - ");

  db.Comment.create(req.body).then(function(dbComment) {
    return db.Article.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { comments: dbComment._id } },
      { new: true }
    )
      .then(function(dbArticle) {
        console.log(dbArticle);
        res.send("Comment Created");
      })
      .catch(function(err) {
        res.json(err);
      });
  });
});

// POST route for deleting a comment from an article
router.post("/api/articles/comment/:id", function(req, res) {
  console.log(" ------------ ");
  console.log(req.body);
  console.log(req.params.id);
  console.log(" ------------ ");

  db.Comment.remove({ _id: req.params.id })
    .then(function(result) {
      res.send("Comment Deleted");
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Get all Articles from the db (articles that have been saved by the Users)
router.get("/api/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticles) {
      res.json(dbArticles);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Get all Comments from the db
router.get("/api/comments", function(req, res) {
  db.Comment.find({})
    .then(function(dbComments) {
      res.json(dbComments);
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
