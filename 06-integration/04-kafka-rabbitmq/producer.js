const { Kafka } = require('kafkajs');

const kafka = new Kafka({ brokers: ['localhost:9092'] });
const producer = kafka.producer();

async function main() {
  await producer.connect();
  console.log('📡 Emitting GPS telemetry to Kafka...');

  const events = [
    { bus: 'North-Route-01', status: 'in_transit', speed: 45 },
    { bus: 'South-Route-03', status: 'in_transit', speed: 50 },
    { bus: 'North-Route-01', status: 'arriving_at_stop', stop: 'Engineering Faculty' },
  ];

  let i = 0;
  setInterval(async () => {
    const event = events[i % events.length];
    
    await producer.send({
      topic: 'bus-telemetry',
      messages: [{ value: JSON.stringify(event) }]
    });

    console.log(`📍 Kafka ingests: [${event.bus}] - ${event.status}`);
    i++;
  }, 1500);
}

main();