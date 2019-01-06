let express = require('express')
var app = express()
var restRouter = require("./routes/rest")
var indexRouter = require("./routes/index")
var mongoose = require('mongoose')
var path = require("path");
var http = require('http');

var io = require('socket.io')(http);

mongoose.connect("mongodb://nodeserver:diet4coke@ds135844.mlab.com:35844/online_judge");

var editorSocketService = require('./service/socketService')(io);



app.use(express.static(path.join(__dirname, '../public')));
app.use("/api/v1", restRouter);
app.use("/",indexRouter);
app.use(function(req,res){
    res.sendFile("index.html", {root: path.join(__dirname, '../public')});
});

// app.listen(3000, function(){
//   console.log('OJ server listening on port 3000')
// })

var server = http.createServer(app);
io.attach(server);
server.listen(3000);

server.on('error',onError);
server.on('listening',onListening);

function onError(err) {
    throw (err);
}
function onListening() {
    var addr = server.address();
    var bind = typeof addr == 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}