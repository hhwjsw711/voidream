"use client";

import { useScopedI18n } from "@/locales/client";
import { Card, CardHeader } from "@v1/ui/card";

export function Features() {
  const t = useScopedI18n("features");

  const features = [
    {
      title: t("aiScript"),
      description: t("aiScriptDescription"),
    },
    {
      title: t("aiVoice"),
      description: t("aiVoiceDescription"),
    },
    {
      title: t("aiVideo"),
      description: t("aiVideoDescription"),
    },
    {
      title: t("aiSubtitle"),
      description: t("aiSubtitleDescription"),
    },
    {
      title: t("aiTemplate"),
      description: t("aiTemplateDescription"),
    },
    {
      title: t("aiStyle"),
      description: t("aiStyleDescription"),
    },
    {
      title: t("easyShare"),
      description: t("easyShareDescription"),
    },
    {
      title: t("fastRender"),
      description: t("fastRenderDescription"),
    },
  ];

  return (
    <div>
      <h3>{t("title")}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {features.map((feature) => (
          <div
            className="border border-primary p-1 -mt-[1px]"
            key={feature.title}
          >
            <Card className="rounded-none border-none p-4">
              <CardHeader>
                <div className="space-y-4">
                  <h3 className="text-xl font-medium">{feature.title}</h3>
                  <p className="text-secondary text-sm">
                    {feature.description}
                  </p>
                </div>
              </CardHeader>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
