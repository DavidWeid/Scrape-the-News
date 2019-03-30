var express = require("express");
var router = express.Router();
var db = require("../models");

router.get("/test", function(req, res) {
    console.log(req.body);
    res.send("Route Online");
});

module.exports = router;