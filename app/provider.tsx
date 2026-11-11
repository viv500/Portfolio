"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // The airport site has its own day/golden-hour palettes; the light/dark theme is only for /plain.
  const pathname = usePathname()
  return (
    <NextThemesProvider {...props} forcedTheme={pathname?.startsWith("/plain") ? undefined : "dark"}>
      {children}
    </NextThemesProvider>
  )
}
