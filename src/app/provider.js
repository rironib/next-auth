"use client";

import AuthProvider from "@/components/AuthProvider";
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { ToastProvider } from "@heroui/react";

export function Provider({ children }) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider attribute="class">
        <ToastProvider />
        <AuthProvider>{children}</AuthProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
