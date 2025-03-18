"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

export default function AuthCheck({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    redirect("/signin");
    return null;
  }

  return <>{children}</>;
}