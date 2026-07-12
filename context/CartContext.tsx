"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, cantidad: number) => void; 
  clearCart: () => void; // 1. Añadimos la función a la interfaz
  toggleCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("splendide_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error al recuperar el carrito", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("splendide_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (newItem: CartItem) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((item) => item.id === newItem.id);
      if (itemExists) {
        return prevItems.map((item) =>
          item.id === newItem.id
            ? { ...item, cantidad: item.cantidad + newItem.cantidad }
            : item
        );
      }
      return [...prevItems, newItem];
    });
    setIsCartOpen(true); 
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, cantidad: number) => {
    if (cantidad < 1) return; 
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, cantidad } : item))
    );
  };

  // 2. Creamos la función que vacía el carrito
  const clearCart = () => {
    setCartItems([]);
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0);
  const cartCount = cartItems.reduce((total, item) => total + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity, 
        clearCart, // 3. Pasamos la función al Provider
        toggleCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}