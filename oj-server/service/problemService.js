let ProblemModel = require("../models/problemModel")
// const problems= [
//     {
//         id: 1,
//         name: "Two Sum",
//         desc: `Given an array of integers, return indices of the two numbers such that they add up to a specific target.
// You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
//         difficulty: "easy"
//     },
//     {
//         id: 2,
//         name: "3Sum",
//         desc: `Given an array S of n integers, are there elements a, b, c in S such that a + b + c = 0? Find all unique triplets in the array which gives the sum of zero.`,
//         difficulty: "medium"
//     },
//     {
//         id: 3,
//         name: "4Sum",
//         desc: `Given an array S of n integers, are there elements a, b, c, and d in S such that a + b + c + d = target? Find all unique quadruplets in the array which gives the sum of target.`,
//         difficulty: "medium"
//     },
//     {
//         id: 4,
//         name: "Sudoku Solver",
//         desc: `Write a program to solve a Sudoku puzzle by filling the empty cells.
// Empty cells are indicated by the character '.'.
// You may assume that there will be only one unique solution.`,
//         difficulty: "hard"
//     },
//     {
//         id: 5,
//         name: "Sliding Window Maximum",
//         desc: `Given an array nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.`,
//         difficulty: "super"
//     }
// ];
//

var getProblems = function(){
    return new Promise( (resolve,reject) => {
        ProblemModel.find({}, function(err, problems){
            if (err) {
                reject(err);
            } else {
                resolve(problems);
            }

        });
    });
}

var getProblem = function(id) {
    return new Promise((resolve, reject) => {
        ProblemModel.findOne({id: id}, function (err, problem) {
            if (err) {
                reject(err);
            } else {
                resolve(problem);
            }
        })
    })
}

var addProblem = function(newProblem) {
    return new Promise((resolve,reject) => {
        ProblemModel.findOne( {name: newProblem.name} , function(err, problem){
            if (problem) {
                reject("Problem with same name already exists!");
            } else {
                ProblemModel.count({}, function(err, num){
                    newProblem.id = num + 1; // Assuming it is always the count + 1
                    var mgProblem = new ProblemModel (newProblem);
                    mgProblem.save(); // Save to the database
                    resolve(newProblem);
                });
            }
        });
    });
}

module.exports = {
    getProblems: getProblems,
    getProblem: getProblem,
    addProblem : addProblem
}