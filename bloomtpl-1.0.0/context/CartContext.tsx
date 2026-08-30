"use client";

import type { CartItem } from "@/types/cart";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "./ToastContext";

interface CartContextProps {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, size?: string | null, color?: string | null) => void;
  clearCart: () => void;
  updateQuantity: (
    id: number,
    quantity: number,
    size?: string | null,
    color?: string | null
  ) => void;
  updateVariant: (
    id: number,
    current: { size?: string | null; color?: string | null },
    next: { size?: string | null; color?: string | null }
  ) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

function isSameVariant(a: CartItem, b: Pick<CartItem, "id" | "size" | "color">) {
  return (
    a.id === b.id &&
    (a.size ?? null) === (b.size ?? null) &&
    (a.color ?? null) === (b.color ?? null)
  );
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => isSameVariant(cartItem, item));

      if (existingItem) {
        return prevCart.map((cartItem) =>
          isSameVariant(cartItem, item)
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prevCart, { ...item, quantity: 1 }];
    });

    showToast(`« ${item.name} » a été ajouté à votre panier.`, "/cart", "Voir le panier");
  };

  const removeFromCart = (id: number, size?: string | null, color?: string | null) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !isSameVariant(item, { id, size, color }))
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const updateQuantity = (
    id: number,
    quantity: number,
    size?: string | null,
    color?: string | null
  ) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        isSameVariant(item, { id, size, color })
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const updateVariant = (
    id: number,
    current: { size?: string | null; color?: string | null },
    next: { size?: string | null; color?: string | null }
  ) => {
    setCart((prevCart) => {
      const target = prevCart.find((item) => isSameVariant(item, { id, ...current }));
      if (!target) return prevCart;

      const nextSize = next.size !== undefined ? next.size : current.size;
      const nextColor = next.color !== undefined ? next.color : current.color;

      const collision = prevCart.find(
        (item) =>
          item !== target && isSameVariant(item, { id, size: nextSize, color: nextColor })
      );

      if (collision) {
        return prevCart
          .map((item) =>
            item === collision
              ? { ...item, quantity: item.quantity + target.quantity }
              : item
          )
          .filter((item) => item !== target);
      }

      return prevCart.map((item) =>
        item === target ? { ...item, size: nextSize, color: nextColor } : item
      );
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        updateVariant,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
