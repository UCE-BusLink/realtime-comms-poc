const axios = require('axios');

const payload = {
  event: 'payment.success',
  amount: 29.99,
  customer: 'ana.garcia@gmail.com',
  orderId: 'ORD-2024-001'
};

console.log('🔔 dispatching webhook...');

axios.post('http://localhost:4000/webhook', payload)
  .then(res => console.log('✅ response received:', res.data))
  .catch(err => console.error('❌ Error:', err.message));
