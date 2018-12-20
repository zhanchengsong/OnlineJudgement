var express = require('express');
let router = express.Router();
let bodyParser = require("body-parser")
var jsonParser = bodyParser.json();
var problemService = require("../service/problemService")


router.get("/", function(req,res){
    res.sendFile("index.html", {root: path.join(__dirname, '../../public/')});
});

module.exports = router;