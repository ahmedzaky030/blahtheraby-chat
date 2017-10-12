var express = require('express');

var router = express.Router();
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');
var servStatic = require('serve-static');
var bodyParser = require('body-parser');
var cors = require('cors');
var randomText = require('randomstring');
var roomsHandler = require('./chatRabbit/roomsHandler.js');
var port = process.env.PORT || 3000;


var talkersCount = 0;
var listenersCount = 0;
var rooms = [];

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use('/', router);
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use(servStatic(path.join(__dirname, 'views')));
app.use(servStatic(path.join(__dirname, 'public')));
app.use(servStatic(path.join(__dirname, 'node_modules')));

router.get('/listen', function (req, res) {
    res.send('Hello' + listenersCount + ' Listeners');
});
// router.post('/listen/send/:roomName', function (req, res) {
//     var message = req.body.message;
//     var roomName = req.params.roomName;
//     var cl = new client();
//     cl.send(roomName, message);
//     var receivedMessage = cl.receive(roomName);

//     res.json(receivedMessage);


// })

io.on('connection', function (client) {
    console.log('Client connected...');


    client.on('join', function (data) {
        var roomData = roomsHandler.getRoomName(client.id, data.type);
        roomData.countData = roomsHandler.getCount();

        if (roomData.roomName != 'xxx') {
            client.join(roomData.roomName).emit('roomJoined', roomData);
        }
    });

    client.on("chat", function (data) {
        data.countData = roomsHandler.getCount();
        io.to(data.roomName).emit('chat', data);
    });

    client.on("disconnect", function (data) {
        roomsHandler.decreaseCount(client.id);
        client.disconnect();
    });


})


router.get('/', function (req, res) {
    res.render('home');

});






http.listen(port, function () {
    console.log("Server started ......");
})