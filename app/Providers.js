'use client';

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Session } from "next-auth";

/*interface NextAuthProviderProps {
  children: ReactNode;
  session?: Session | null;
}*/

export function NextAuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}