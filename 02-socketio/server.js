const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' }
});

const votes = { React: 0, Vue: 0, Angular: 0 };

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  // send the current votes to the newly connected client
  socket.emit('votes', votes);

  socket.on('vote', (option) => {
    if (votes[option] !== undefined) {
      votes[option]++;
      console.log(`🗳️  Vote for ${option} — total: ${votes[option]}`);
      io.emit('votes', votes); // broadcast to all clients
    }
  });

  socket.on('disconnect', () => console.log('❌ Client disconnected'));
});

httpServer.listen(3000);
console.log('🚀 Socket.IO server running in http://localhost:3000');