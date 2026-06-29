import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function App() {
  const [votes, setVotes] = useState({ React: 0, Vue: 0, Angular: 0 });

  useEffect(() => {
    socket.on('votes', (data) => setVotes(data));
    return () => socket.off('votes');
  }, []);

  return (
    <div>
      <h2>¿Better framework? — Socket.IO</h2>
      {Object.entries(votes).map(([option, total]) => (
        <div key={option}>
          <button onClick={() => socket.emit('vote', option)}>
            {option}: {total} votes
          </button>
        </div>
      ))}
    </div>
  );
}