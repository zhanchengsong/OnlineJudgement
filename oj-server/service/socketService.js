let redisClient = require('../modules/redisClient');

const TIMEOUT_IN_SECONDS = 3600;
module.exports = function(io) {

    let redisClient = require('../modules/redisClient');

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
        //console.log("Handshake query: " + socket.handshake.query);
        let sessionId = socket.handshake.query["sessionId"];
        socketIdtoSessionId[socket.id] = sessionId;
        // console.log("SocketId " + socket.id + " connected from sessionId " + sessionId);
        if (sessionId in collaboration) {
            collaboration[sessionId]['participants'].push(socket.id);
        }
        else {
            console.log("Getting redis: ", sessionPath + sessionId);
            redisClient.get(sessionPath + sessionId, function(data) {
                if(data) {
                    //console.log("session terminated previously; pulling back from Redis.");
                    collaboration[sessionId] = {
                        'cachedChangeEvents': JSON.parse(data),
                        'participants': []
                    };
                } else {
                    console.log("creating new session");
                    collaboration[sessionId] = {
                        'cachedChangeEvents': [],
                        'participants': []
                    };
                }
                collaboration[sessionId]['participants'].push(socket.id);
            });
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

        socket.on('cursorMove', cursor => {

            cursor = JSON.parse(cursor);
            cursor['socketId'] = socket.id;

            forwardEvents(socket.id, 'cursorMove', JSON.stringify(cursor));
        })

        socket.on('disconnect', function(){
            //console.log("Disconnecting from " + socket.id);
            let sessionId = socketIdtoSessionId[socket.id];
            if (sessionId in collaboration) {
                let participants = collaboration[sessionId].participants;
                let index = participants.indexOf(socket.id);
                console.log("Index of disconnecting user: " + index);
                if (index >= 0) {
                    participants.splice(index, 1);
                    if (participants.length == 0) {
                        let key = sessionPath + sessionId;
                        let value = JSON.stringify( collaboration[sessionId]['cachedChangeEvents'] );
                        redisClient.set(key, value, redisClient.redisPrint);
                        redisClient.expire(key, TIMEOUT_IN_SECONDS);
                        delete collaboration[sessionId];
                    }
                }

            }
        });
        socket.on('restoreBuffer',function() {
            let sessionId = socketIdtoSessionId[socket.id];
            if (sessionId in collaboration) {
                let cachedEvents = collaboration[sessionId]['cachedChangeEvents'];
                for (let i =0 ; i < cachedEvents.length; i ++) {
                    socket.emit(cachedEvents[i][0], cachedEvents[i][1]);
                }
            }
        });



    })



}