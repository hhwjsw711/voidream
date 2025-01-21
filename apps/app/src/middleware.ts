import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { createI18nMiddleware } from "next-international/middleware";

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

export default convexAuthNextjsMiddleware((request) => {
  if (isSignInPage(request) && isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(request, "/");
  }
  if (!isSignInPage(request) && !isAuthenticatedNextjs()) {
    const url = request.nextUrl.pathname;
    if (!url.includes("/login")) {
      return nextjsMiddlewareRedirect(request, "/login");
    }
  }

  return I18nMiddleware(request);
});

export const config = {
  matcher: [
    "/((?!_next/static|api|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",

    // all routes except static assets
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
