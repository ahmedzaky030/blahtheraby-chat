var talkersCount = 0;
var listenersCount = 0;
var rooms = [];
var ss = "";
var talkersArr = [];
var listenersArr = [];

var getListenersOrTalkersCount = function () {
    var data = {
        "listeners": listenersCount,
        "talkers": talkersCount
    };
    return data;
}

var decreaseCount = function (clientId) {

    if (listenersArr.indexOf(clientId) != -1) {
        var index = listenersArr.indexOf(clientId);
        listenersArr.splice(index, 1);
        listenersCount--;
    }

    if (talkersArr.indexOf(clientId) != -1) {
        var index = talkersArr.indexOf(clientId);
        talkersArr.splice(index, 1);
        talkersCount--;
    }
}



var getRoomName = function (clientId, type) {
    var fullRoom = false;
    if (type === 'listener') {
        listenersCount++;
        listenersArr.push(clientId);
    }
    if (type === 'talker') {
        talkersCount++;
        talkersArr.push(clientId);
    }
    var roomData = {};
    var room = rooms.filter(function (element) {
        return element.fullRoom == false && element.type !== type;
    });

    if (room.length > 0) {
        roomData = room[0];
        var index = rooms.indexOf(roomData);
        rooms[index].fullRoom = true;
    } else {
        roomName = clientId.slice(0, 6);
        fullRoom = false;
        var data = {
            "roomName": roomName,
            "fullRoom": fullRoom,
            "type": type,
        };
        rooms.push(data);
        roomData = data;
    }

    return roomData;
};

module.exports = {
    getRoomName: getRoomName,
    getCount: getListenersOrTalkersCount,
    decreaseCount: decreaseCount
};