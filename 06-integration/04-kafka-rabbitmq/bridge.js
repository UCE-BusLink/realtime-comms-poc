const { Kafka } = require('kafkajs');
const amqp = require('amqplib');

const kafka = new Kafka({ brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'telemetry-group' });

async function startBridge() {
  const amqpConn = await amqp.connect('amqp://localhost');
  const rabbitChannel = await amqpConn.createChannel();
  const rabbitQueue = 'student_notifications';
  await rabbitChannel.assertQueue(rabbitQueue, { durable: true });

  await consumer.connect();
  await consumer.subscribe({ topic: 'bus-telemetry', fromBeginning: false });

  console.log('🌉 Bridge Service: Listening to Kafka and filtering for RabbitMQ...');

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());

      // Filter: Only route to RabbitMQ if the bus is arriving at a stop
      if (event.status === 'arriving_at_stop') {
        console.log(`⚠️ Key event detected in Kafka! Bus ${event.bus} at stop ${event.stop}.`);
        
        const notificationTask = {
          message: `Bus ${event.bus} is arriving at ${event.stop}. Get ready!`,
          timestamp: new Date().toISOString()
        };

        rabbitChannel.sendToQueue(rabbitQueue, Buffer.from(JSON.stringify(notificationTask)), { persistent: true });
        console.log(`➡️  Task sent to RabbitMQ to notify users.`);
      }
    }
  });
}

startBridge();