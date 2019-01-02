let express = require('express')
var app = express()
var restRouter = require("./routes/rest")
var indexRouter = require("./routes/index")
var mongoose = require('mongoose')
var path = require("path");

mongoose.connect("mongodb://nodeserver:diet4coke@ds135844.mlab.com:35844/online_judge");

app.use(express.static(path.join(__dirname, '../public')));
app.use("/api/v1", restRouter);
app.use("/",indexRouter);
app.use(function(req,res){
    res.sendFile("index.html", {root: path.join(__dirname, '../public')});
});

app.listen(3000, function(){
  console.log('Example server listening on port 3000')
})

