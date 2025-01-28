"use client";

import { useScopedI18n } from "@/locales/client";
import { OutlinedButton } from "@v1/ui/outlined-button";
import Link from "next/link";
import { useState } from "react";
import { MdCheck } from "react-icons/md";
import { PricingSlider } from "./pricing-slider";

export function Pricing() {
  const t = useScopedI18n("pricing");
  const [value, setValue] = useState([98]);

  return (
    <div className="pt-14 md:pt-28">
      <h1 className="text-3xl">{t("title")}</h1>
      <div className="border border-border mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
          <div className="p-12 relative">
            <div className="absolute -top-4 left-6 bg-background px-4 py-1">
              <h3 className="text-sm font-medium uppercase">
                {t("basic.title")}
              </h3>
            </div>

            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-secondary">
                <MdCheck className="w-4 h-4 text-primary" />
                <span>{t("basic.features.video_quality")}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-secondary">
                <MdCheck className="w-4 h-4 text-primary" />
                <span>{t("basic.features.basic_voice")}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-secondary">
                <MdCheck className="w-4 h-4 text-primary" />
                <span>{t("basic.features.basic_template")}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-secondary">
                <MdCheck className="w-4 h-4 text-primary" />
                <span>{t("basic.features.with_watermark")}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-secondary">
                <MdCheck className="w-4 h-4 text-primary" />
                <span>{t("basic.features.subtitle")}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-secondary">
                <MdCheck className="w-4 h-4 text-primary" />
                <span>{t("basic.features.basic_bgm")}</span>
              </li>
            </ul>
          </div>

          <div className="p-12 relative">
            <div className="absolute -top-4 left-6 bg-background px-4 py-1">
              <h3 className="text-sm font-medium uppercase">
                {t("pro.title")}
              </h3>
            </div>

            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-secondary mb-4">
                <span>{t("pro.features.point_usage")}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-secondary">
                <MdCheck className="w-4 h-4 text-primary" />
                <span>{t("pro.features.video_quality")}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-secondary">
                <MdCheck className="w-4 h-4 text-primary" />
                <span>{t("pro.features.all_voice")}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-secondary">
                <MdCheck className="w-4 h-4 text-primary" />
                <span>{t("pro.features.all_template")}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-secondary">
                <MdCheck className="w-4 h-4 text-primary" />
                <span>{t("pro.features.no_watermark")}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-secondary">
                <MdCheck className="w-4 h-4 text-primary" />
                <span>{t("pro.features.multi_subtitle")}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-secondary">
                <MdCheck className="w-4 h-4 text-primary" />
                <span>{t("pro.features.pro_bgm")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border border-t border-border">
          <div className="p-12 pt-10 relative min-h-[300px]">
            <div className="flex flex-col gap-2">
              <span className="text-sm">{t("basic.points")}</span>
              <span className="text-sm text-secondary">
                {t("basic.description")}
              </span>
            </div>

            <div className="absolute bottom-11">
              <h3 className="text-xl font-medium mb-6 mt-2">¥98 / 100积分</h3>

              <Link href="/login?plan=basic">
                <OutlinedButton variant="secondary">{t("cta")}</OutlinedButton>
              </Link>
            </div>
          </div>

          <div className="p-12 pt-28">
            <PricingSlider value={value} setValue={setValue} />

            <div className="mt-4">
              <Link href={`/login?plan=pro&tier=${value[0]}`}>
                <OutlinedButton>{t("cta")}</OutlinedButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-secondary mt-4">{t("points_never_expire")}</p>
    </div>
  );
}
