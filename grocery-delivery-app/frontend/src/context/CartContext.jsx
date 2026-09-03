import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext({
  items: [],
  addToCart: () => {},
  addItem: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {},
  itemsPrice: 0,
  deliveryFee: 0,
  totalPrice: 0,
  totalCount: 0,
});

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    if (!product || (!product._id && !product.productId)) return;
    const pId = product._id || product.productId;

    setItems((prev) => {
      const existing = prev.find((i) => i.productId === pId);
      if (existing) {
        return prev.map((i) =>
          i.productId === pId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          productId: pId,
          name: product.name,
          price: product.price,
          image: product.image,
          unit: product.unit,
          quantity,
        },
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const itemsPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = itemsPrice >= 299 ? 0 : itemsPrice > 0 ? 30 : 0;
  const totalPrice = itemsPrice + deliveryFee;
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        addItem: addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        itemsPrice,
        deliveryFee,
        totalPrice,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}