import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { Providers } from "./providers";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import type { Viewport } from "next";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: "React Native Smart Wallet Integration",
  description: "For Coinbase Onchain Summer Hackathon",
};

export const viewport: Viewport = {
  initialScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen h-screen overflow-hidden bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="relative h-full overflow-y-auto">{children}</main>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
