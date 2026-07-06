"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// 1. Definimos qué datos va a guardar nuestro carrito
type CartItem = {
  id: string; // Código o Handle del producto
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
};

type CartContextType = {
  cartItems: CartItem[];
  isCartOpen: boolean;
  cartCount: number;
  addToCart: (item: CartItem) => void;
  toggleCart: () => void;
};

// 2. Creamos el contexto vacío
const CartContext = createContext<CartContextType | undefined>(undefined);

// 3. Creamos el "Proveedor" que envolverá nuestra app
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // Controla el menú lateral

  // Función para añadir al carrito
  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existe = prev.find((i) => i.id === item.id);
      if (existe) {
        // Si ya está en la bolsa, le sumamos 1 a la cantidad
        return prev.map((i) =>
          i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      // Si es nuevo, lo agregamos con cantidad 1
      return [...prev, { ...item, cantidad: 1 }];
    });
    
    // Opcional: Abre el menú lateral automáticamente al añadir un producto
    setIsCartOpen(true); 
  };

  // Función para abrir/cerrar la bolsa
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  // Calcula cuántos productos hay en total en la bolsita
  const cartCount = cartItems.reduce((total, item) => total + item.cantidad, 0);

  return (
    <CartContext.Provider value={{ cartItems, isCartOpen, cartCount, addToCart, toggleCart }}>
      {children}
    </CartContext.Provider>
  );
}

// 4. Hook personalizado para usar el cerebro fácilmente en otros archivos
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}