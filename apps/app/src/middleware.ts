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
    "ar",
    "az",
    "bg",
    "ca",
    "cs",
    "da",
    "de",
    "el",
    "es",
    "et",
    "fi",
    "fr",
    "he",
    "hr",
    "hu",
    "id",
    "it",
    "iw",
    "ja",
    "km",
    "ko",
    "lv",
    "nl",
    "no",
    "pl",
    "pt-BR",
    "pt",
    "ro",
    "ru",
    "sk-SK",
    "sk",
    "sr",
    "sv",
    "ta",
    "th",
    "tr",
    "uk",
    "vi",
    "zh-CN",
    "zh-TW",
  ],
  defaultLocale: "zh-CN",
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
    "/((?!_next/static|api|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3)$).*)",

    // all routes except static assets
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
