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
    { text: "中文", value: "zh" },
  ];
  const formatLanguage = (lng: string) => {
    return langs.find((lang) => lang.value === lng)?.text;
  };

  return (
    <Select value={locale} onValueChange={changeLocale}>
      <SelectTrigger className="h-8 w-[140px] rounded-md border-primary/20 bg-secondary px-3 hover:border-primary/40 hover:bg-accent">
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium truncate">
            {formatLanguage(locale)}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent className="min-w-[140px]">
        {langs.map(({ text, value }) => (
          <SelectItem
            key={value}
            value={value}
            className="text-sm font-medium text-primary/60 hover:bg-accent hover:text-accent-foreground cursor-pointer"
          >
            {text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
