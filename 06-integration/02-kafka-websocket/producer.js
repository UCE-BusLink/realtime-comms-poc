const { Kafka } = require('kafkajs');

const kafka = new Kafka({ brokers: ['localhost:9092'] });
const producer = kafka.producer();

async function main() {
  await producer.connect();

  const errors = [
    { servicio: 'auth-service', error: 'Token JWT expired' },
    { servicio: 'payment-service', error: 'Timeout with payment gateway' },
    { servicio: 'inventory-service', error: 'Insufficient stock' },
  ];

  // publish a new error every 2 seconds
  let i = 0;
  setInterval(async () => {
    const log = {
      ...errors[i % errors.length],
      level: 'ERROR',
      timestamp: new Date().toISOString()
    };

    await producer.send({
      topic: 'app-errors',
      messages: [{ key: log.servicio, value: JSON.stringify(log) }]
    });

    console.log(`🔴 Published in Kafka: [${log.service}] ${log.error}`);
    i++;
  }, 2000);
}

main();