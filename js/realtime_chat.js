(function ($, Drupal) {
  Drupal.behaviors.realtimeChat = {
    attach: function (context, settings) {
      if (!window.WebSocket) {
        alert("Your browser does not support WebSockets.");
        return;
      }

      var socket = new WebSocket("ws://localhost:8081");

      socket.onopen = function () {
        console.log("Connected to the WebSocket server.");
      };

      socket.onerror = function (error) {
        console.error("WebSocket Error: " + error);
      };

      socket.onmessage = function (event) {
        var messageData = JSON.parse(event.data);
        var messageUser = messageData.messageUser
          ? messageData.messageUser
          : "Anonymous";
        var sesionUser = $("#user-name").text();
          if (sesionUser != messageUser) {
            $("#chat-messages").append(
              '<div class="message-in-chat message-group"><div class="text-created"> <p class="text">' +
                messageData.messageText +
                "</p>" +
                '<p class="created">' +
                messageData.messageCreated +
                "</p></div>" +
                '<p class="user">' +
                messageData.messageUser +
                "</p></div>"
            );
          } else {
            $("#chat-messages").append(
              '<div class="message-in-chat"><div class="text-created"> <p class="text">' +
                messageData.messageText +
                "</p>" +
                '<p class="created">' +
                messageData.messageCreated +
                "</p></div>" +
                '<p class="user">' +
                messageData.messageUser +
                "</p></div>"
            );
          }
      };

      $("#send-message").click(function () {
        var messageText = $("#message").val();
        var messageCreated = $("#date-now").text();
        var messageUser = $("#user-name").text();

        if (messageText) {
          var messageData = {
            messageText: messageText,
            messageCreated: messageCreated,
            messageUser: messageUser,
          };

          // Send message via WebSocket
          socket.send(JSON.stringify(messageData));

          // Save message in database
          $.post(
            "/chat/save-message",
            {
              messageUser: messageUser,
              messageText: messageText,
              messageCreated: messageCreated,
            },
            function (data) {
              if (data.status === "ok") {
                $("#message").val("");
              } else {
                console.error("Failed to save message");
              }
            }
          );
        }
      });

      // Get messages from the database on page load
      $.get("/chat/get-messages", function (data) {
        data.forEach(function (messageData) {
          var messageUser = $("#user-name").text();
          if (messageUser != messageData.messageUser) {
            $("#chat-messages").append(
              '<div class="message-in-chat message-group"><div class="text-created"> <p class="text">' +
                messageData.messageText +
                "</p>" +
                '<p class="created">' +
                messageData.messageCreated +
                "</p></div>" +
                '<p class="user">' +
                messageData.messageUser +
                "</p></div>"
            );
          } else {
            $("#chat-messages").append(
              '<div class="message-in-chat"><div class="text-created"> <p class="text">' +
                messageData.messageText +
                "</p>" +
                '<p class="created">' +
                messageData.messageCreated +
                "</p></div>" +
                '<p class="user">' +
                messageData.messageUser +
                "</p></div>"
            );
          }
        });
      });
    },
  };
})(jQuery, Drupal);
