"use client";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { hydrateCart } from "../store/features/cartSlice";

function CartHydrator({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(hydrateCart());
  }, []);

  return <>{children}</>;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CartHydrator>{children}</CartHydrator>
    </Provider>
  );
}
