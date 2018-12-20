var express = require('express');
var router = express.Router();
var problemService = require("../service/problemService")

router.get("/problems", function(req,res){
    problemService.getProblems()
        .then(problem => res.json(problem));
});

module.exports = router;