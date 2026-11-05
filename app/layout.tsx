import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./provider"; // Ensure this path is correct

const inter = Inter({ subsets: ["latin"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Vivek Jude Manoj | Infrastructure & Developer Tooling",
  description:
    "Software engineer working on infrastructure and developer tooling. Incoming at Shopify, previously Arctic Wolf and Rocket. Computer Science + AI Specialization at the University of Waterloo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* favicon link here */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} ${mono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
