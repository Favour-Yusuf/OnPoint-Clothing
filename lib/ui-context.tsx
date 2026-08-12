"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type UIContextValue = {
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isMobileNavOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  closeAll: () => void;
};

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setCartOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  const closeAll = useCallback(() => {
    setCartOpen(false);
    setSearchOpen(false);
    setMobileNavOpen(false);
  }, []);

  const openCart = useCallback(() => {
    setSearchOpen(false);
    setMobileNavOpen(false);
    setCartOpen(true);
  }, []);

  const openSearch = useCallback(() => {
    setCartOpen(false);
    setMobileNavOpen(false);
    setSearchOpen(true);
  }, []);

  const openMobileNav = useCallback(() => {
    setCartOpen(false);
    setSearchOpen(false);
    setMobileNavOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      isCartOpen,
      isSearchOpen,
      isMobileNavOpen,
      openCart,
      closeCart: () => setCartOpen(false),
      openSearch,
      closeSearch: () => setSearchOpen(false),
      openMobileNav,
      closeMobileNav: () => setMobileNavOpen(false),
      closeAll,
    }),
    [isCartOpen, isSearchOpen, isMobileNavOpen, openCart, openSearch, openMobileNav, closeAll]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIContextValue {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within a UIProvider");
  return context;
}
