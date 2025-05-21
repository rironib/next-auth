"use client";

import * as React from "react";
import {HeroUIProvider} from "@heroui/system";
import {useRouter} from "next/navigation";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import AuthProvider from "@/components/AuthProvider";

export function Providers({children, themeProps}) {
    const router = useRouter();

    return (
        <HeroUIProvider navigate={router.push}>
            <NextThemesProvider attribute="class">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </NextThemesProvider>
        </HeroUIProvider>
    );
}