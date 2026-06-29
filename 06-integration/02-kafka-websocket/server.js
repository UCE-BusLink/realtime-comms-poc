const { Kafka } = require('kafkajs');
const { WebSocketServer } = require('ws');

const kafka = new Kafka({ brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'websocket-group' });
const wss = new WebSocketServer({ port: 8081 });

async function iniciar() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'app-errors', fromBeginning: false });

  console.log('🚀 WebSocket server running on ws://localhost:8081');

  await consumer.run({
    eachMessage: async ({ message }) => {
      const log = JSON.parse(message.value.toString());
      console.log(`📨 Message from Kafka → sending to web clients`);

      // Send the log to all connected WebSocket clients
      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify(log));
        }
      });
    }
  });
}

wss.on('connection', () => console.log('✅ WebSocket client connected'));

iniciar();