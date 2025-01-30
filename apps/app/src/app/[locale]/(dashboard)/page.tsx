"use client";

import { useScopedI18n } from "@/locales/client";
import { Carousel } from "@v1/ui/carousel";

export default function Page() {
  const t = useScopedI18n("dashboard");
  const slideData = [
    {
      title: t("carouselText1"),
      button: "/generate",
      src: "/noise.png",
    },
    {
      title: t("carouselText2"),
      button: "/generate",
      src: "/noise.png",
    },
  ];
  return (
    <div className="relative overflow-hidden w-full h-full py-20">
      <Carousel slides={slideData} />
    </div>
  );
}
