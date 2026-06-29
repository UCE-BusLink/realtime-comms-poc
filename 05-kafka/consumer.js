const { Kafka } = require('kafkajs');

const kafka = new Kafka({ brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'monitor-group' });

async function startMonitor() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'app-errors', fromBeginning: true });

  console.log('🔍 checking for errors...');

  await consumer.run({
    eachMessage: async ({ message }) => {
      const log = JSON.parse(message.value.toString());
      console.log(`⚠️  [${log.timestamp}]`);
      console.log(`   Service: ${log.servicio}`);
      console.log(`   Error:    ${log.error}`);
      console.log('---');
    }
  });
}

startMonitor();