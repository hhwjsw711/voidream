"use client";

import { useScopedI18n } from "@/locales/client";
import { Button } from "@v1/ui/button";
import { cn } from "@v1/ui/utils";
import { Monitor, PenLine, Smartphone } from "lucide-react";
import { useState } from "react";
import { StepIndicator } from "../../_components/step-indicator";

export default function SegmentBySegment() {
  const [selectedOrientation, setSelectedOrientation] = useState<
    "vertical" | "horizontal"
  >("vertical");
  const t = useScopedI18n("generate.segment");

  const steps = [
    { number: 1, text: t("steps.step1") },
    { number: 2, text: t("steps.step2") },
    { number: 3, text: t("steps.step3") },
  ];
  const currentStep = 2;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="pt-8 sm:pt-12 pb-6 space-y-6 sm:space-y-8 px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 dark:text-gray-100">
          {t("title")}
        </h1>
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>

      <div className="flex-1 px-4 py-6">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {t("form.selectFormat")}
              </h3>

              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <OrientationButton
                    Icon={Smartphone}
                    text={t("form.vertical")}
                    subtext={t("form.verticalRatio")}
                    isSelected={selectedOrientation === "vertical"}
                    onClick={() => setSelectedOrientation("vertical")}
                  />
                  <OrientationButton
                    Icon={Monitor}
                    text={t("form.horizontal")}
                    subtext={t("form.horizontalRatio")}
                    isSelected={selectedOrientation === "horizontal"}
                    onClick={() => setSelectedOrientation("horizontal")}
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-10 bg-blue-600 dark:bg-blue-500 
                      hover:bg-blue-700 dark:hover:bg-blue-600 
                      text-white font-semibold shadow-sm"
                  >
                    <PenLine className="h-4 w-4 mr-2" />
                    {t("form.startWriting")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface OrientationButtonProps {
  Icon: React.ElementType;
  text: string;
  subtext: string;
  isSelected: boolean;
  onClick: () => void;
}

function OrientationButton({
  Icon,
  text,
  subtext,
  isSelected,
  onClick,
}: OrientationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative p-8 rounded-lg flex flex-col items-center justify-center gap-4",
        "border-2 transition-all duration-200",
        "hover:border-blue-500/50 dark:hover:border-blue-500/50",
        "hover:bg-blue-50/50 dark:hover:bg-blue-500/5",
        isSelected
          ? "border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-500/10"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
      )}
    >
      <Icon
        className={cn(
          "h-10 w-10 transition-colors duration-200",
          isSelected
            ? "text-blue-600 dark:text-blue-500"
            : "text-gray-400 dark:text-gray-600",
          "group-hover:text-blue-600 dark:group-hover:text-blue-500",
        )}
      />
      <div className="flex flex-col items-center gap-1.5">
        <span
          className={cn(
            "text-base font-medium transition-colors duration-200",
            isSelected
              ? "text-blue-600 dark:text-blue-500"
              : "text-gray-700 dark:text-gray-300",
            "group-hover:text-blue-600 dark:group-hover:text-blue-500",
          )}
        >
          {text}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {subtext}
        </span>
      </div>
    </button>
  );
}
