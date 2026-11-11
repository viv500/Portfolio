"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // /aviation has its own day/golden-hour palettes, so the main site's light theme stays off there.
  const pathname = usePathname()
  return (
    <NextThemesProvider {...props} forcedTheme={pathname?.startsWith("/aviation") ? "dark" : undefined}>
      {children}
    </NextThemesProvider>
  )
}
