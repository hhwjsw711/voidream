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
    { value: "en", text: "English" },
    { value: "ar", text: "العربية" },
    { value: "az", text: "Azərbaycan" },
    { value: "bg", text: "Български" },
    { value: "ca", text: "Català" },
    { value: "cs", text: "Čeština" },
    { value: "da", text: "Dansk" },
    { value: "de", text: "Deutsch" },
    { value: "el", text: "Ελληνικά" },
    { value: "es", text: "Español" },
    { value: "et", text: "Eesti" },
    { value: "fi", text: "Suomi" },
    { value: "fr", text: "Français" },
    { value: "he", text: "עברית" },
    { value: "hr", text: "Hrvatski" },
    { value: "hu", text: "Magyar" },
    { value: "id", text: "Bahasa Indonesia" },
    { value: "it", text: "Italiano" },
    { value: "iw", text: "עברית" },
    { value: "ja", text: "日本語" },
    { value: "km", text: "ខ្មែរ" },
    { value: "ko", text: "한국어" },
    { value: "lv", text: "Latviešu" },
    { value: "nl", text: "Nederlands" },
    { value: "no", text: "Norsk" },
    { value: "pl", text: "Polski" },
    { value: "pt-BR", text: "Português (Brasil)" },
    { value: "pt", text: "Português" },
    { value: "ro", text: "Română" },
    { value: "ru", text: "Русский" },
    { value: "sk-SK", text: "Slovenčina (SK)" },
    { value: "sk", text: "Slovenčina" },
    { value: "sr", text: "Српски" },
    { value: "sv", text: "Svenska" },
    { value: "ta", text: "தமிழ்" },
    { value: "th", text: "ไทย" },
    { value: "tr", text: "Türkçe" },
    { value: "uk", text: "Українська" },
    { value: "vi", text: "Tiếng Việt" },
    { value: "zh-CN", text: "简体中文" },
    { value: "zh-TW", text: "繁體中文" },
  ];
  const formatLanguage = (lng: string) => {
    return langs.find((lang) => lang.value === lng)?.text;
  };

  return (
    <Select value={locale} onValueChange={changeLocale}>
      <SelectTrigger className="h-6 rounded border-primary/20 bg-secondary !px-2 hover:border-primary/40">
        <div className="flex items-start gap-2">
          <Languages className="h-[14px] w-[14px]" />
          <span className="text-xs font-medium truncate w-[52px]">
            {formatLanguage(locale)}
          </span>
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
