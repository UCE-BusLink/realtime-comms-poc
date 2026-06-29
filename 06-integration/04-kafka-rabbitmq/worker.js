const amqp = require('amqplib');
const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8082 });

async function startWorker() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'student_notifications';

  await channel.assertQueue(queue, { durable: true });
  console.log('📱 Notifications Worker waiting in RabbitMQ...');
  console.log('🚀 WebSocket server running on ws://localhost:8082');

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const task = JSON.parse(msg.content.toString());
      console.log(`📲 Sending Push Notification to HTML client: "${task.message}"`);

      // Broadcast to connected students
      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify(task));
        }
      });

      channel.ack(msg);
    }
  });
}

startWorker();