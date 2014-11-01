'use strict';

var io = {
  connect: ''
};


(function() {

  io.connect = function() {

    var
      on_sio, emit_sio,
      callback_map = {};

    on_sio = function(msg_type, callback) {
      callback_map[msg_type] = callback;
    };

    emit_sio = function(msg_type, data) {

      msg_type = msg_type.replace(/csbindSend/, 'csbindReceive');

      if(data.mode === 'check') return;

      callback_map[msg_type](data);

    };

    return {
      emit: emit_sio,
      on: on_sio
    };

  };
})();
