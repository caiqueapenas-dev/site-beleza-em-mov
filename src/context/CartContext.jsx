// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('falha ao carregar o carrinho do localstorage', error);
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size) => {
    setCartItems((prev) => {
      const itemExists = prev.find(
        (item) => item._id === product._id && item.size === size,
      );
      if (itemExists) {
        return prev.map((item) =>
          item._id === product._id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const increaseQuantity = (itemId, itemSize) =>
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === itemId && item.size === itemSize
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );

  const decreaseQuantity = (itemId, itemSize) =>
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === itemId && item.size === itemSize
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );

  const removeFromCart = (itemId, itemSize) =>
    setCartItems(
      (prev) =>
        prev.filter((item) => !(item._id === itemId && item.size === itemSize)),
    );

  const totalItemsInCart = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const value = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalItemsInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('usecart deve ser usado dentro de um cartprovider');
  }
  return context;
}