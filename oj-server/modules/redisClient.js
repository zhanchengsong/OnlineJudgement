var redis = require('redis');
var client = redis.createClient();

function set(key, value, callback) {
    console.log("Client Set: Key "+ key + " value " + value);
    client.set(key, value, function(err, res) {
        if (err) {
            console.log(err);
            return;
        }
        callback(res);
    });
}

function get(key, callback) {
    client.get(key, function(err, res) {
        if (err) {
            console.log(err);
            return;
        }
        callback(res);
    });
}

function expire(key, timeInSeconds) {
    client.expire(key, timeInSeconds);
}

function quit() {
    client.quit();
}

module.exports = {
    get: get,
    set: set,
    expire: expire,
    quit: quit,
    redisPrint: redis.print
}