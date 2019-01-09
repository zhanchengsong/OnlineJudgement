module.exports = function(io) {

    var collaboration = [];
    var socketIdtoSessionId = [];
    //Map to track which problem this socket is connected in
    var sessionPath = "/temp_sessions/";


    //Function to foward change messages to all the other sessions
    function forwardEvents(socketId, eventName,dataString) {
        let sessionId = socketIdtoSessionId[socketId];
        if (sessionId in collaboration) {
            let participants = collaboration[sessionId]['participants'];
            for (let i = 0; i < participants.length; i ++) {

                if (participants[i]!=socketId ) {
                    console.log("Sending message to " + participants[i]);
                    io.to(participants[i]).emit(eventName, dataString);
                }

            }
        }

    }
    //


    io.on('connection', (socket) => {
        console.log("Handshake query: " + socket.handshake.query);
        let sessionId = socket.handshake.query["sessionId"];
        socketIdtoSessionId[socket.id] = sessionId;
        console.log("SocketId " + socket.id + " connected from sessionId " + sessionId);
        if (sessionId in collaboration) {
            collaboration[sessionId]['participants'].push(socket.id);
            let changeEvents = collaboration[sessionId]['cachedChangeEvents'];
            for (let i=0; i < changeEvents.length; i++) {
                socket.emit(changeEvents[i][0], changeEvents[i][1]);
            }


        }
        else {
            collaboration[sessionId] = {
                'cachedChangeEvents': [],
                'participants': []
            };
        }
        io.to(socket.id).emit('message', 'Connected on server');

        socket.on('change', delta => {
            //console.log("change from" + socket.id + " " + delta);
            let sessionId = socketIdtoSessionId[socket.id];
            //Server cache for new join in to fastforward
            if (sessionId in collaboration) {
                collaboration[sessionId]['cachedChangeEvents'].push(["change", delta, Date.now()]);
            }
            forwardEvents(socket.id, "change", delta);
        });
        socket.on('disconnect', function(){
            console.log("Disconnecting from " + socket.id);
            let sessionId = socketIdtoSessionId[socket.id];
            if (sessionId in collaboration) {
                let participants = collaboration[sessionId].participants;
                let index = participants.indexOf(participants);
                if (index >= 0) {
                    participants.splice(index, 1);
                }
            }


        });


    })



}