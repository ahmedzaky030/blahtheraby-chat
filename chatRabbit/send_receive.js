var amqp = require("amqplib/callback_api");
var ss = require('amqplib/callback_api');

function client () {
    this.roomName = '';
    this.receive = function () {
        var messages =[] ;
        amqp.connect('amqp://localhost', function (err, conn) {
            conn.createChannel(function (err, ch) {
                var q = this.roomName;

                ch.assertQueue(q, {
                    durable: false
                });
                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
                ch.consume(q, function (msg) {
                    console.log(" [x] Received %s", msg.content.toString());
                    messages.push(msg.content.toString());
                }, { noAck: true });
            });
        });
        return messages;
    },

    this.send = function (roomName, message) {
        amqp.connect('amqp://localhost', function (err, conn) {
            conn.createChannel(function (err, ch) {
                var q = roomName;
                var msg = message;

                ch.assertQueue(q, {
                    durable: false
                });
                // Note: on Node 6 Buffer.from(msg) should be used
                ch.sendToQueue(q, new Buffer(msg));
                console.log(" [x] Sent %s", msg);
            });
            
        });

    }    
}

module.exports = client;