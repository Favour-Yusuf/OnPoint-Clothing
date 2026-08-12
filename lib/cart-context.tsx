"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "onpoint:cart";

type CartState = { items: CartItem[] };

type CartAction =
  | { type: "HYDRATE"; items: CartItem[] }
  | { type: "ADD_ITEM"; item: Omit<CartItem, "quantity">; quantity: number }
  | { type: "REMOVE_ITEM"; key: string }
  | { type: "UPDATE_QUANTITY"; key: string; quantity: number }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items };
    case "ADD_ITEM": {
      const existing = state.items.find((item) => item.key === action.item.key);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.key === action.item.key ? { ...item, quantity: item.quantity + action.quantity } : item
          ),
        };
      }
      return { items: [...state.items, { ...action.item, quantity: action.quantity }] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((item) => item.key !== action.key) };
    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return { items: state.items.filter((item) => item.key !== action.key) };
      }
      return {
        items: state.items.map((item) => (item.key === action.key ? { ...item, quantity: action.quantity } : item)),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", items: JSON.parse(raw) as CartItem[] });
    } catch {
      // Ignore malformed/unavailable storage — cart just starts empty.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Storage may be unavailable (private browsing, quota); cart still works in-memory.
    }
  }, [state.items]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", item, quantity });
  }, []);

  const removeItem = useCallback((key: string) => {
    dispatch({ type: "REMOVE_ITEM", key });
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", key, quantity });
  }, []);

  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const itemCount = useMemo(() => state.items.reduce((sum, item) => sum + item.quantity, 0), [state.items]);
  const subtotal = useMemo(
    () => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.items]
  );

  const value = useMemo(
    () => ({ items: state.items, itemCount, subtotal, addItem, removeItem, updateQuantity, clear }),
    [state.items, itemCount, subtotal, addItem, removeItem, updateQuantity, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
