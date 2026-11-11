import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { PostHogAnalytics } from "./posthog";
import "./globals.css";
import { ThemeProvider } from "./provider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const sign = Inter_Tight({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-sign" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.vivekjudemanoj.com"),
  title: "Vivek Manoj - Backend and Infra Engineer",
  description:
    "Backend and infrastructure engineer. Incoming at Shopify, previously Arctic Wolf and Rocket. Computer Science + AI Specialization at the University of Waterloo.",
  openGraph: {
    title: "Vivek Manoj - Backend and Infra Engineer",
    description: "Backend and infrastructure engineer. Incoming at Shopify, previously Arctic Wolf and Rocket.",
    url: "https://www.vivekjudemanoj.com",
    siteName: "Vivek Manoj",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vivek Manoj - Backend and Infra Engineer",
  },
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
        {/* Apply the saved theme before first paint, so there's no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var p=localStorage.getItem("palette");document.documentElement.dataset.palette=p==="day"?"day":"golden"}catch(e){document.documentElement.dataset.palette="golden"}`,
          }}
        />
      </head>
      <body className={`${inter.className} ${mono.variable} ${sign.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <ThemeToggle />
        </ThemeProvider>
        <Analytics />
        <PostHogAnalytics />
      </body>
    </html>
  );
}
