// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Falha ao carregar o carrinho do localStorage', error);
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size, showNotification) => {
    setCartItems((prev) => {
      const itemExists = prev.find(
        (item) => item._id === product._id && item.size === size,
      );
      const stockLimit = product.estoque[size] || 0;

      if (itemExists) {
        if (itemExists.quantity >= stockLimit) {
          showNotification(
            `Desculpe, temos apenas ${stockLimit} unidades do tamanho ${size.toUpperCase()} em estoque.`,
            'error',
          );
          return prev;
        }
        showNotification(`${product.name} foi adicionado ao carrinho!`);
        return prev.map((item) =>
          item._id === product._id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      
      if (stockLimit < 1) {
        showNotification(`Desculpe, o tamanho ${size.toUpperCase()} está esgotado.`, 'error');
        return prev;
      }

      showNotification(`${product.name} foi adicionado ao carrinho!`);
      return [...prev, { ...product, size, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const increaseQuantity = (itemId, itemSize) =>
    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id === itemId && item.size === itemSize) {
          const stockLimit = item.estoque[itemSize] || 0;
          if (item.quantity >= stockLimit) {
            alert(
              `Limite de estoque atingido para o tamanho ${itemSize.toUpperCase()} (${stockLimit} unidades).`,
            );
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      }),
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
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}