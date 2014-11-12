'use strict';

var socket;

(function(){

  var io, _socket, sockets;

  function _start(server){
 
    io = require('socket.io')(server);

    io.sockets.on('connection', function(socket){

      _socket = socket;
  
    });

  }

  socket = {
    start: _start,
    sokcet : _socket,
    io: io
  };

})();

module.exports = socket;