import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (menu, quantity = 1, note = '') => {
    setItems(prev => {
      const existing = prev.find(i => i.menuId === menu._id && i.note === note);
      if (existing) {
        return prev.map(i =>
          i.menuId === menu._id && i.note === note
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, {
        menuId: menu._id,
        name: menu.name,
        price: menu.price,
        image: menu.image,
        quantity,
        note,
      }];
    });
  };

  const removeItem = (menuId, note) => {
    setItems(prev => prev.filter(i => !(i.menuId === menuId && i.note === note)));
  };

  const updateQuantity = (menuId, note, quantity) => {
    if (quantity <= 0) {
      removeItem(menuId, note);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.menuId === menuId && i.note === note ? { ...i, quantity } : i
      )
    );
  };

  const updateNote = (menuId, oldNote, newNote) => {
    setItems(prev =>
      prev.map(i =>
        i.menuId === menuId && i.note === oldNote ? { ...i, note: newNote } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, updateNote, clearCart, totalItems, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
