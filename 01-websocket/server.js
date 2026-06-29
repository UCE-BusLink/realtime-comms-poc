const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });
console.log('🚀 WebSocket server running in ws://localhost:8080');

wss.on('connection', (ws) => {
  console.log('✅ Connection established');

  ws.on('message', (msg) => {
    const text = msg.toString();
    console.log(`📨 Message received: ${text}`);

    // broadcast to all clients
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(text);
      }
    });
  });

  ws.on('close', () => console.log('❌ Connection closed'));
});