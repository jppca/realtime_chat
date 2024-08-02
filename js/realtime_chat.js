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
          // Send message via WebSocket
          socket.send(message);

          // Save message in database
          $.post('/chat/save-message', { message: message }, function (data) {
            if (data.status === 'ok') {
              $('#message').val('');
            } else {
              console.error('Failed to save message');
            }
          });
        }
      });

      // get messages from the database on page load
      $.get('/chat/get-messages', function (data) {
        data.forEach(function (msg) {
          $('#chat-messages').append('<div><strong>' + msg.username + ':</strong> ' + msg.message + ' <em>' + msg.created + '</em></div>');
        });
      });
    }
  };
})(jQuery, Drupal);
