var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using Schema, create a new CommentSchema object
var CommentSchema = new Schema({
  title: String,
  body: String
});

// Create our model using the CommentSchema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export Comment model
module.exports = Comment;
