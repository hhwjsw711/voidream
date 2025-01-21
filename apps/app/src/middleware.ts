import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { createI18nMiddleware } from "next-international/middleware";
import { type NextRequest, NextResponse } from "next/server";

const I18nMiddleware = createI18nMiddleware({
  locales: [
    "en",
    "es",
    "sv",
    "de",
    "fr",
    "fi",
    "pt",
    "ja",
    "zh",
    "ko",
    "no",
    "it",
    "ar",
    "nl",
    "pl",
    "tr",
    "vi",
  ],
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
});

const isSignInPage = createRouteMatcher(["/login"]);

export async function middleware(request: NextRequest) {
  const i18nResponse = await I18nMiddleware(request);

  if (isSignInPage(request)) {
    if (!isAuthenticatedNextjs()) {
      return i18nResponse;
    }
    if (isAuthenticatedNextjs()) {
      return nextjsMiddlewareRedirect(request, "/");
    }
  }

  if (!isAuthenticatedNextjs()) {
    const url = request.nextUrl.pathname;
    if (!url.includes("/login")) {
      return nextjsMiddlewareRedirect(request, "/login");
    }
  }

  return i18nResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|api|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",

    // all routes except static assets
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
