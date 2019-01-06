module.exports = function(io) {

    var collaboration = [];
    var socketIdtoSessionId = [];
    var sessionPath = "/temp_sessions/";

    io.on('connection', (socket) => {
        console.log(socket);
        var message = socket.handshake.query["message"];
        console.log(message);
        io.to(socket.id).emit('message', 'Hello from server');
    })
}