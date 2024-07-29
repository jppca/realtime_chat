const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', function connection(ws) {
  console.log('Connected Client');

  ws.on('message', function incoming(message) {
    // Make sure that the message received is a text message.
    console.log('Mensaje recibido: %s', message);
    // Send the message to all connected clients as a text message.
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log('Disconnected Client');
  });
});

console.log('WebSocket server listening on ws://localhost:8081');
