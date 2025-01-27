"use client";

import { useI18n } from "@/locales/client";
import { OutlinedButton } from "@v1/ui/outlined-button";
import Link from "next/link";

export function Hero() {
  const t = useI18n();

  return (
    <div className="py-12 md:py-28 flex flex-col items-center justify-center text-center">
      <div className="max-w-2xl space-y-8 w-full">
        <h1 className="text-4xl font-bold">{t("hero.title")}</h1>
        <p className="text-secondary text-lg">{t("hero.description")}</p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/login">
            <OutlinedButton>
              {t("getStarted.button.startAutomating")}
            </OutlinedButton>
          </Link>

          <Link href="/pricing" className="hidden md:block">
            <OutlinedButton variant="secondary">
              {t("getStarted.button.readDocumentation")}
            </OutlinedButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
