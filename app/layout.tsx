import type { Metadata } from "next";
import { Caveat, Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { PostHogAnalytics } from "./posthog";
import "./globals.css";
import { ThemeProvider } from "./provider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
// Handwriting, used only for the logbook signature.
const hand = Caveat({ subsets: ["latin"], weight: ["600"], variable: "--font-hand" });
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
            // A saved choice wins; otherwise pick by the visitor's local time (daytime 6:00–17:00,
            // golden hour otherwise). The automatic pick isn't saved, so it follows the clock.
            // Also flags the intro take-off (home page, every load, not with reduced motion). A tap, click or
            // key before the scripts load counts as a skip; scrolling doesn't (trackpad momentum lingers).
            __html: `(function(){var d=document.documentElement,p=null;try{p=localStorage.getItem("palette")}catch(e){}if(p!=="day"&&p!=="golden"){var h=new Date().getHours();p=h>=6&&h<17?"day":"golden"}d.dataset.palette=p;try{if(location.pathname==="/"&&!matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.takeoff="on";var k=function(){if(!d.dataset.takeoffReady)d.dataset.takeoffSkip="1"};["pointerdown","touchstart","keydown"].forEach(function(t){addEventListener(t,k,{once:true,passive:true})})}}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${inter.className} ${mono.variable} ${sign.variable} ${hand.variable}`}>
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
