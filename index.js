var express = require('express');

var router = express.Router();
var app = express();
var http = require('https').createServer(app);
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
        var roomData = roomsHandler(client.id , data.type);
        if(roomData.roomName != 'xxx') {
            client.join(roomData.roomName).emit('roomJoined' , roomData);
        }        
    });

    client.on("chat" , function(data){
        io.to(data.roomName).emit('chat' , data);
    });

    
})

// router.post('/talk/send/:roomName' , function(req, res){
//     var message = req.params.message;
//     var roomName = req.params.roomName;
//     var cl = new client();
//     cl.send(roomName, message);
//     var receivedMessage = cl.receive(roomName);

//     res.json(receivedMessage);


// })

// router.post('/listen', function (req, res) {
//     listenersCount++;
//     var roomName = "";
//     if (listenersCount === talkersCount) {
//         roomName = rooms[talkersCount - 1];
//     } else if (talkersCount > listenersCount) {

//         roomName = rooms[listenersCount - 1];
//     } else {
//         roomName = randomText.generate(7);
//         rooms.push(roomName);
//         // var cl = new client();
//         // cl.send(roomName , message);
//         // cl.receive(roomName);

//         console.log('new room name' + roomName);
//     }
//     res.json(roomName);
// });

// router.post('/talk', function (req, res) {
//     talkersCount++;
//     var roomName = '';
//     if (listenersCount === talkersCount) {
//         roomName = rooms[talkersCount - 1];
//     } else if (listenersCount > talkersCount) {
//         var roomIndex = listenersCount - talkersCount;
//         roomName = rooms[talkersCount - 1];
//     } else {
//         roomName = randomText.generate(7);
//         rooms.push(roomName);
//         console.log('new room name' + roomName);
//     }
//     res.json(roomName);
// });
// router.get('/talk', function (req, res) {

//     res.send('Hello talkers');
// });
router.get('/', function (req, res) {
    res.render('home');

});






http.listen(port, function () {
    console.log("Server started ......");
})