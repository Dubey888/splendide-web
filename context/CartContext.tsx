"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Estructura oficial de un producto dentro del carrito
export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

// Definición de todo lo que el "Cerebro" comparte con la app
interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void; // ¡Aquí aseguramos la función que faltaba!
  toggleCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 1. Recuperar los productos guardados cuando el cliente abre la página
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

  // 2. Guardar automáticamente en el navegador cada vez que el carrito cambie
  useEffect(() => {
    localStorage.setItem("splendide_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Función para añadir productos
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
    setIsCartOpen(true); // Abre el menú lateral automáticamente al añadir
  };

  // Función para eliminar productos (La que causaba el error)
  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Función para abrir/cerrar el menú lateral
  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  // Cálculo automático del total de la compra
  const cartTotal = cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        addToCart,
        removeFromCart,
        toggleCart,
        cartTotal,
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