import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

export function useStock() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['stock'],
    queryFn: async () => {
      // Initial data hardcoded because the server does not use REST
      return [
        { id: 1, name: 'Laptop', stock: 5 },
        { id: 2, name: 'Mouse', stock: 20 },
        { id: 3, name: 'Keyboard', stock: 10 },
      ];
    }
  });

  useEffect(() => {
    // The socket listens for the server event...
    socket.on('stock:updated', (updatedProduct) => {
      console.log('📦 Stock updated via socket:', updatedProduct);
      // ...and injects the new data directly into the TanStack Query cache
      queryClient.setQueryData(['stock'], (prev) =>
        prev?.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      );
    });

    return () => socket.off('stock:updated');
  }, [queryClient]);

  return query;
}

