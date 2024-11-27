import "@v1/ui/globals.css";
import { Footer } from "@/components/footer";
import { FooterCTA } from "@/components/footer-cta";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Provider as AnalyticsProvider } from "@v1/analytics/client";
import { cn } from "@v1/ui/utils";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ConvexClientProvider } from "./convex-client-provider";

const DepartureMono = localFont({
  src: "../fonts/DepartureMono-Regular.woff2",
  variable: "--font-departure-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://voidream.com"),
  title: "Voidream | Where Culture Thrives, Brilliance Follows",
  description:
    "Voidream empowers creators by providing a platform where tool makers and artists collaborate, ensuring authentic artistic expression and fair compensation for creative work.",
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
          `${DepartureMono.variable} ${GeistSans.variable} ${GeistMono.variable}`,
          "bg-[#fbfbfb] dark:bg-[#0C0C0C] overflow-x-hidden antialiased",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <Header />
            <main className="container mx-auto px-4 overflow-hidden md:overflow-visible">
              {children}
            </main>
            <FooterCTA />
            <Footer />
          </ConvexClientProvider>

          <AnalyticsProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
