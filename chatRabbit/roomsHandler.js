var talkersCount = 0;
var listenersCount = 0;
var rooms = [];
var ss = "";

var getListenersOrTalkersCount = function() {
    var data = {"listeners":listenersCount , "talkers":talkersCount};
    return data;
}

var getRoomName = function (clientId, type) {
    var fullRoom = false;
    if (type === 'listener') {
        listenersCount++;
        var roomName = "";
        if (listenersCount === talkersCount) {
            roomName = rooms[talkersCount - 1];
            fullRoom = true;
        } else if (talkersCount > listenersCount) {

            roomName = rooms[listenersCount - 1];
            fullRoom = true;
        } else {
            roomName = clientId.slice(0, 6);
            fullRoom = false;
            rooms.push(roomName);            
        }  
        var roomData = {
            "roomName": roomName,
            "fullRoom": fullRoom
        };      

        return roomData;
    } else if (type === 'talker') {
        talkersCount++;
        var roomName = '';
        if (listenersCount === talkersCount) {
            roomName = rooms[talkersCount - 1];
            fullRoom = true;
        } else if (listenersCount > talkersCount) {
            var roomIndex = listenersCount - talkersCount;
            roomName = rooms[talkersCount - 1];
            fullRoom = true;
        } else {
            roomName = randomText.generate(7);
            rooms.push(roomName);
            fullRoom = false;
        }
        var roomData = {
            "roomName": roomName,
            "fullRoom": fullRoom
        };
        return roomData;
    }
    var roomData = {
        "roomName": "xxx",
        "fullRoom": false
    };

    return roomData;
};

module.exports = { getRoomName: getRoomName , getCount:getListenersOrTalkersCount };