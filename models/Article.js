var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using Schema, create a new ArticleSchema object
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  teaser: {
    type: String,
    require: true,
    unique: true
  },
  // "comments" is an array (allows us to push multiple comments in) that stores a objects with a Comment id
  // "ref" links the ObjectId to the Comment model
  // Lets us populate the Article with any associated Comments
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

// Create our model using the ArticleSchema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export Article model
module.exports = Article;
