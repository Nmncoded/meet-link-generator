"use client";

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "./store/store";

export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}