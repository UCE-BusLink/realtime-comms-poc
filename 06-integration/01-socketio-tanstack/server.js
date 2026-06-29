const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' }
});

let products = [
  { id: 1, name: 'Laptop', stock: 5 },
  { id: 2, name: 'Mouse', stock: 20 },
  { id: 3, name: 'Keyboard', stock: 10 },
];

// Endpoint for the initial TanStack Query fetch
const http = require('http');

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  // Simulates a purchase every 3 seconds
  const interval = setInterval(() => {
    const idx = Math.floor(Math.random() * products.length);
    if (products[idx].stock > 0) {
      products[idx].stock--;
      console.log(`📦 ${products[idx].name} → stock: ${products[idx].stock}`);
      // trigger the event to the client
      io.emit('stock:updated', products[idx]);
    }
  }, 3000);

  socket.on('disconnect', () => {
    clearInterval(interval);
    console.log('❌ Client disconnected');
  });
});

httpServer.listen(3001);
console.log('🚀 Server running at http://localhost:3001');