(function ($, Drupal) {
  Drupal.behaviors.realtimeChat = {
    attach: function (context, settings) {
      if (!window.WebSocket) {
        alert("Your browser does not support WebSockets.");
        return;
      }

      var socket = new WebSocket('ws://localhost:8081');

      socket.onopen = function () {
        console.log('Connected to the WebSocket server.');
      };

      socket.onerror = function (error) {
        console.error('WebSocket Error: ' + error);
      };

      socket.onmessage = function (event) {
        var message = event.data;
        $('#chat-messages').append('<div>' + message + '</div>');
      };

      $('#send-message').click(function () {
        var message = $('#message').val();
        if (message) {
          socket.send(message);
          $('#message').val('');
        }
      });
    }
  };
})(jQuery, Drupal);
