const { Kafka } = require('kafkajs');

const kafka = new Kafka({ brokers: ['localhost:9092'] });
const producer = kafka.producer();

async function logError(service, error) {
  await producer.connect();

  await producer.send({
    topic: 'app-errors',
    messages: [{
      key: service,
      value: JSON.stringify({
        servicio: service,
        error,
        level: 'ERROR',
        timestamp: new Date().toISOString()
      })
    }]
  });

  console.log(`🔴 Error published: [${service}] ${error}`);
  await producer.disconnect();
}

async function main() {
  await logError('auth-service', 'Token JWT expirado para usuario 42');
  await logError('payment-service', 'Timeout conexión con pasarela de pago');
  await logError('auth-service', 'Demasiados intentos de login fallidos');
}

main();