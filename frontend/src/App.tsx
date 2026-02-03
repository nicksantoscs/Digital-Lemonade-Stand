import { useEffect, useState } from 'react';
import { api } from './api';
import type { Beverage } from './types';
import './App.css';

function App() {
  // State for data
  const [beverages, setBeverages] = useState<Beverage[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  
  // State for form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // State for UI status
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Fetch beverages on load; backend handles pricing so UI stays in sync
  useEffect(() => {
    api.getBeverages()
      .then(data => setBeverages(data))
      .catch(err => console.error("Failed to load beverages", err));
  }, []);

  // Update cart quantity
  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const currentQty = prev[id] || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      // If cart quantity is 0, remove key to keep object clean
      if (newQty === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newQty };
    });
  };

  // Calculate the total price from the current cart + latest beverage prices
  const calculateTotal = () => {
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const bev = beverages.find(b => b.id === id);
      return total + (bev ? Number(bev.price) * qty : 0);
    }, 0);
  };

  // On submit, map cart to order items, backend computes final total and creates order
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    const orderItems = Object.entries(cart).map(([beverageId, quantity]) => ({
      beverageId,
      quantity
    }));

    try {
      await api.createOrder({
        customerName: name,
        customerEmail: email,
        items: orderItems
      });
      setStatus('success');
      setCart({});
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const clearCart = () => {
    setCart({});
  };

  if (status === 'success') {
    return (
      <div className="app-container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Order Placed!</h1>
        <p>Thank you, {name}. Your order is on the way!</p>
        <button onClick={() => {
          setStatus('idle');
          setName('');
          setEmail('');
        }}>Order More</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>Digital Lemonade Stand</h1>
      
     {/* Beverage list */}
      <div className="beverage-list">
        <h2>Beverages</h2>
        {beverages.map(bev => (
          <div key={bev.id} className="beverage-item" style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '10px' }}>
            {bev.imageUrl && (
              <img
                src={bev.imageUrl}
                alt={bev.name}
                style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }}
              />
            )}
            <div style={{ fontWeight: 'bold' }}>{bev.name}</div>
            {bev.description && (
              <div style={{ color: '#555', marginTop: '4px' }}>{bev.description}</div>
            )}
            <div>${Number(bev.price).toFixed(2)}</div>
            
            <div className="controls">
              <button onClick={() => updateQuantity(bev.id, -1)} disabled={!cart[bev.id]}>-</button>
              <span style={{ margin: '0 10px' }}>{cart[bev.id] || 0}</span>
              <button onClick={() => updateQuantity(bev.id, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout form */}
      {Object.keys(cart).length > 0 && (
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem', borderTop: '2px solid #eee', paddingTop: '1rem' }}>
          <h2>Checkout</h2>
          
          <div style={{ marginBottom: '10px' }}>
            <label>Name: </label>
            <input 
              required 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your Name"
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Email: </label>
            <input 
              required 
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          <h3>Total: ${calculateTotal().toFixed(2)}</h3>
          
          <button type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Placing Order...' : 'Place Order'}
          </button>
          <button type="button" onClick={clearCart} style={{ marginLeft: '10px' }} disabled={status === 'submitting'}>
            Clear Cart
          </button>

          {status === 'error' && <p style={{ color: 'red' }}>Failed to place order. Try again.</p>}
        </form>
      )}
    </div>
  );
}

export default App;
