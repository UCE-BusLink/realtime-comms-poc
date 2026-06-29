import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStock } from './hooks/useStock';

const queryClient = new QueryClient();

function StockTable() {
  const { data: products, isLoading } = useStock();

  if (isLoading) return <p>Loading products...</p>;

  return (
    <div>
      <h2>Stock in real time — Socket.IO + TanStack Query</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Product</th>
            <th>Stock</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} style={{ color: p.stock === 0 ? 'red' : 'green' }}>
              <td>{p.name}</td>
              <td>{p.stock}</td>
              <td>{p.stock === 0 ? '❌ Out of stock' : '✅ Available'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ color: 'gray', fontSize: '12px' }}>
        Stock is updated every 3 seconds via socket
      </p>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StockTable />
    </QueryClientProvider>
  );
}