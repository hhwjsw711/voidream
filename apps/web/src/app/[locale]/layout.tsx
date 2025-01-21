import "../globals.css";
import { I18nProviderClient } from "@/locales/client";
import { Provider as AnalyticsProvider } from "@v1/analytics/client";
import { cn } from "@v1/ui/utils";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ConvexClientProvider } from "./convex-client-provider";

const DepartureMono = localFont({
  src: "../../fonts/DepartureMono-Regular.woff2",
  variable: "--font-departure-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://voidream.com"),
  title: "Voidream",
  description:
    "Transform your ideas into captivating content without needing a subscription. Pay only for the videos you create.",
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html
      lang={params.locale}
      className="dark bg-noise bg-background"
      suppressHydrationWarning
    >
      <body
        className={cn(
          `${DepartureMono.variable} ${GeistSans.variable} ${GeistMono.variable}`,
          "antialiased",
        )}
      >
        <ConvexClientProvider>
          <I18nProviderClient locale={params.locale}>
            {children}
          </I18nProviderClient>
        </ConvexClientProvider>

        <AnalyticsProvider />
      </body>
    </html>
  );
}
