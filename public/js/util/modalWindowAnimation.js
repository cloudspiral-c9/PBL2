'use strict';

$(function() {
  $('#room-create').click(
    function() {
      $('body').append('<div id="overlay"></div>');
      $('#overlay').fadeIn('slow');
      $('#modal-window').fadeIn('slow');
    }
  );
});
