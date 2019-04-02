var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using Schema, create a new UserSchema object
var UserSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  // "articles" is an array (lets us store multiple Articles per User) with objects that store an Article id
  // "ref" links the ObjectId to the Article model
  // Lets us populate the User with any associated Articles
  articles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Article"
    }
  ]
});

var User = mongoose.model("User", UserSchema);

module.exports = User;
