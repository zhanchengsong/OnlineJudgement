var express = require('express');
let router = express.Router();
let bodyParser = require("body-parser")
var jsonParser = bodyParser.json();
var problemService = require("../service/problemService")


router.get("/problems", function(req,res){
    problemService.getProblems()
        .then(problems => res.json(problems));
});

router.get("/problems/:id", function(req,res){
    var id = req.params.id;
    problemService.getProblem(+id)
        .then(problem => res.json(problem))
})

router.get("/", function(req,res) {
    res.send("Root Apis for the online judgement server");
})

router.post("/problem", jsonParser, function(req,res) {
    problemService.addProblem(req.body)
        .then(function(problem) {
            res.json(problem);
        }, function(error) {
            res.status(400).send("Cannot add problem : " + error);
        })
})

module.exports = router;