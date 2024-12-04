import { createI18nMiddleware } from "next-international/middleware";
import type { NextRequest } from "next/server";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "fr", "es", "zh"],
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
});

export function middleware(request: NextRequest) {
  return I18nMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|api|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)",

    // all routes except static assets
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
