"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Estructura de un producto dentro del carrito
export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

// Aquí le agregamos 'cartCount' para que el Navbar esté feliz
interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  toggleCart: () => void;
  cartTotal: number;
  cartCount: number; // <-- ¡Agregado!
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Recuperar del navegador al cargar
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

  // Guardar en el navegador cada vez que cambie
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

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  // Cálculos automáticos
  const cartTotal = cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0);
  
  // ¡Cálculo de la cantidad de productos para el Navbar!
  const cartCount = cartItems.reduce((total, item) => total + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        addToCart,
        removeFromCart,
        toggleCart,
        cartTotal,
        cartCount, // <-- ¡Lo pasamos al resto de la app!
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