"use client";

import { useChangeLocale, useCurrentLocale } from "@/locales/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@v1/ui/select";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const changeLocale = useChangeLocale();
  const locale = useCurrentLocale();

  const langs = [
    { text: "English", value: "en" },
    { text: "Français", value: "fr" },
    { text: "Español", value: "es" },
    { text: "Svenska", value: "sv" },
    { text: "Deutsch", value: "de" },
    { text: "Suomi", value: "fi" },
    { text: "Português", value: "pt" },
    { text: "日本語", value: "ja" },
    { text: "中文", value: "zh" },
    { text: "한국어", value: "ko" },
    { text: "Norsk", value: "no" },
    { text: "Italiano", value: "it" },
    { text: "العربية", value: "ar" },
    { text: "Nederlands", value: "nl" },
    { text: "Polski", value: "pl" },
    { text: "Türkçe", value: "tr" },
    { text: "Tiếng Việt", value: "vi" },
  ];
  const formatLanguage = (lng: string) => {
    return langs.find((lang) => lang.value === lng)?.text;
  };

  return (
    <Select value={locale} onValueChange={changeLocale}>
      <SelectTrigger className="h-6 rounded border-primary/20 bg-secondary !px-2 hover:border-primary/40">
        <div className="flex items-start gap-2">
          <Languages className="h-[14px] w-[14px]" />
          <span className="text-xs font-medium">{formatLanguage(locale)}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {langs.map(({ text, value }) => (
          <SelectItem
            key={value}
            value={value}
            className="text-sm font-medium text-primary/60"
          >
            {text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
