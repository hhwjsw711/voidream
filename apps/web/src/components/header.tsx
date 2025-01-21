"use client";

import { useI18n } from "@/locales/client";
import { Logo } from "@v1/ui/logo";
import { cn } from "@v1/ui/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChangeLanguage } from "./change-language";

export function Header() {
  const t = useI18n();
  const pathname = usePathname();

  const links = [
    { href: "/pricing", label: t("header.pricing") },
    {
      href: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      label: t("header.signIn"),
    },
  ];

  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg">
      <div className="flex items-center justify-between container mx-auto py-4">
        <Link href="/" className="block">
          <Logo />
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <ChangeLanguage />

          {links.map((link) => (
            <Link
              href={link.href!}
              className={cn(
                "text-secondary hover:text-primary transition-colors hidden md:block",
                pathname?.endsWith(link.href) && "text-primary",
              )}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
