var showScrapedArticles = function(articles) {
  // Clear out previous articles in our article-section
  $("#article-section").empty();

  // Replace with the first 10 scraped articles
  // Create an article section with a title and teaser section sub-sections
  for (var i = 0; i < 10; i++) {
    var newArticle = $("<article>");
    var articleTitle = $("<h3>")
      .addClass("title")
      .text(articles[i].title);
    var articleTeaser = $("<h5>")
      .addClass("teaser")
      .append(
        "<a href='" + articles[i].link + "'>" + articles[i].teaser + "</a>"
      );
    var saveArticleBtn = $("<button>")
      .addClass("saveArticleBtn")
      .text("Save");

    $(newArticle).append(articleTitle, articleTeaser, saveArticleBtn);
    $("#article-section").append(newArticle);
  }
};

// When User clicks "scrape-articles" button, do so via the "/api/scrape" route
// This scrapes all articles available and sends them back as an array
// Show the first 10 scraped articles by running showScrapedArticles
$(document).on("click", "#scrape-articles", function() {
  console.log("Sending Scrape Request");

  $.ajax("/api/scrape", {
    type: "GET"
  }).then(function(scrapedArticles) {
    console.log("Scrape Complete");
    console.log(scrapedArticles);
    showScrapedArticles(scrapedArticles);
  });
});

// When User clicks "Save" button, grab the Article's title, link, and teaser
// Send data to "/api/save/article" via POST to save the article in the db
$(document).on("click", ".saveArticleBtn", function() {
  var newArticle = {};

  newArticle.title = $(this)
    .parent("article")
    .children(".title")
    .text();
  newArticle.link = $(this)
    .parent("article")
    .children(".teaser")
    .children("a")
    .attr("href");
  newArticle.teaser = $(this)
    .parent("article")
    .children(".teaser")
    .text();

  console.log(newArticle);

  $.ajax("/api/save/article", {
    type: "POST",
    data: newArticle
  }).then(function(data) {
    console.log(data);
  });

  $(this).parent("article").empty();

});
