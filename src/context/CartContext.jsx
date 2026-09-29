import { createContext, useCallback, useContext, useEffect, useReducer } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'shopsphere-cart';

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i.id === action.product.id);
      if (existing) {
        return state.map(i =>
          i.id === action.product.id
            ? { ...i, quantity: i.quantity + (action.quantity || 1) }
            : i
        );
      }
      return [...state, { ...action.product, quantity: action.quantity || 1 }];
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id);
    case 'UPDATE_QTY':
      if (action.quantity < 1) return state.filter(i => i.id !== action.id);
      return state.map(i =>
        i.id === action.id ? { ...i, quantity: action.quantity } : i
      );
    case 'CLEAR':
      return [];
    case 'LOAD':
      return action.payload;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart    = useCallback((product, qty = 1) => dispatch({ type: 'ADD', product, quantity: qty }), []);
  const removeFromCart = useCallback(id => dispatch({ type: 'REMOVE', id }), []);
  const updateQty    = useCallback((id, quantity) => dispatch({ type: 'UPDATE_QTY', id, quantity }), []);
  const clearCart    = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const isInCart     = useCallback(id => items.some(i => i.id === id), [items]);
  const getItemQty   = useCallback(id => items.find(i => i.id === id)?.quantity ?? 0, [items]);

  const totalItems  = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal    = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const discount    = items.reduce((acc, i) => {
    const pct = i.discountPercentage || 0;
    return acc + (i.price * pct / 100) * i.quantity;
  }, 0);
  const delivery    = subtotal > 50 ? 0 : subtotal > 0 ? 4.99 : 0;
  const total       = subtotal - discount + delivery;

  return (
    <CartContext.Provider value={{
      items, totalItems, subtotal, discount, delivery, total,
      addToCart, removeFromCart, updateQty, clearCart, isInCart, getItemQty
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
