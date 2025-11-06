"use client";

import React from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={null}>
      <AuthProvider>
        {children}
        <Toaster richColors position="top-center" />
      </AuthProvider>
    </React.Suspense>
  );
}
