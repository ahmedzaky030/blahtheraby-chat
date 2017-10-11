var talkersCount = 0;
var listenersCount = 0;
var rooms = [];
var ss = "";
var talkersArr = [];
var listenersArr = [];

var getListenersOrTalkersCount = function() {
    var data = {"listeners":listenersCount , "talkers":talkersCount};
    return data;
}

var decreaseCount= function( clientId){

    if(listenersArr.indexOf(clientId) != -1 ){
        var index = listenersArr.indexOf(clientId);
        listenersArr.splice(index, 1);
        listenersCount--;    
    }

    if(talkersArr.indexOf(clientId) != -1 ){
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
        talkersArr.push(clientId);
        var roomName = '';
        if (listenersCount === talkersCount) {
            roomName = rooms[talkersCount - 1];
            fullRoom = true;
        } else if (listenersCount > talkersCount) {
            var roomIndex = listenersCount - talkersCount;
            roomName = rooms[talkersCount - 1];
            fullRoom = true;
        } else {
            roomName = clientId.slice(0, 6);
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

module.exports = { getRoomName: getRoomName , getCount:getListenersOrTalkersCount , decreaseCount:decreaseCount };