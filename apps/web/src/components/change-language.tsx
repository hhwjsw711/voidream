"use client";

import { useChangeLocale, useCurrentLocale, useI18n } from "@/locales/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@v1/ui/dropdown-menu";

export function ChangeLanguage() {
  const t = useI18n();
  const changeLocale = useChangeLocale();
  const currentLocale = useCurrentLocale();

  const locales = [
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
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        className="flex items-center gap-2 text-secondary outline-none uppercase text-xs font-medium"
      >
        [{currentLocale}]
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={10}
        className="max-h-[300px] overflow-y-auto"
      >
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            // @ts-ignore
            onClick={() => changeLocale(locale)}
            className="uppercase text-xs"
          >
            {/* @ts-ignore */}
            {t(`language.${locale}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
