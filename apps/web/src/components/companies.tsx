"use client";

import { useI18n } from "@/locales/client";

export function Companies() {
  const t = useI18n();

  return (
    <div>
      <h3>{t("companies.title")}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4">
        <a
          href="https://www.lishui.gov.cn/col/col1229267353/"
          target="_blank"
          rel="noreferrer"
        >
          <div className="h-[84px] border border-primary flex items-center justify-center">
            <div className="text-center">
              <div className="text-base font-medium">
                丽水市文化和广电旅游体育局
              </div>
            </div>
          </div>
        </a>

        <a href="/pricing" target="_blank" rel="noreferrer">
          <div className="h-[84px] border border-primary flex items-center justify-center">
            <span className="text-xs">{t("companies.addYourCompany")}</span>
          </div>
        </a>

        <a href="/pricing" target="_blank" rel="noreferrer">
          <div className="h-[84px] border border-primary flex items-center justify-center">
            <span className="text-xs">{t("companies.addYourCompany")}</span>
          </div>
        </a>

        <a href="/pricing" target="_blank" rel="noreferrer">
          <div className="h-[84px] border border-primary flex items-center justify-center">
            <span className="text-xs">{t("companies.addYourCompany")}</span>
          </div>
        </a>
      </div>
    </div>
  );
}
