let express = require('express')
var app = express()
var restRouter = require("./routes/rest")
var mongoose = require('mongoose')

app.get('/', function (req,res) {
    res.send('Hello World');
})

mongoose.connect("mongodb://nodeserver:diet4coke@ds135844.mlab.com:35844/online_judge");

app.use("/api/v1", restRouter);

app.listen(3000, function(){
  console.log('Example server listening on port 3000')
})

