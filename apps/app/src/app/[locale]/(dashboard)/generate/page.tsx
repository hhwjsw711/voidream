import { getScopedI18n } from "@/locales/server";
import { List, Pencil, Wand2 } from "lucide-react";
import Link from "next/link";
import { StepIndicator } from "../_components/step-indicator";

export const metadata = {
  title: "Generate | Voidream",
};

export default async function Generation() {
  const t = await getScopedI18n("generate");
  const steps = [
    { number: 1, text: t("steps.step1") },
    { number: 2, text: t("steps.step2") },
    { number: 3, text: t("steps.step3") },
  ];
  const currentStep = 1;

  return (
    <>
      <h1 className="mt-24 font-medium text-center text-5xl text-primary/80">
        {t("title")}
      </h1>

      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        className="mt-16"
      />

      <div className="flex h-full w-full bg-secondary px-6 py-8 dark:bg-card">
        <div className="z-10 mx-auto flex h-full w-full max-w-screen-xl gap-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            <Link
              href="/generate/script"
              className="group flex w-full flex-col rounded-lg border border-border bg-card dark:bg-black transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:border-primary/40 active:scale-[0.98]"
            >
              <div className="flex w-full px-6">
                <div className="w-full border-b border-border" />
              </div>
              <div className="relative mx-auto flex w-full flex-col items-center p-6">
                <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card">
                  <div className="z-10 flex max-w-[460px] flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-primary/40">
                      <Pencil className="h-8 w-8 stroke-[1.5px] text-primary/60" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-base font-medium text-primary">
                        {t("mode.script")}
                      </p>
                    </div>
                  </div>
                  <div className="base-grid absolute h-full w-full opacity-40" />
                  <div className="absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
                </div>
              </div>
            </Link>
            <Link
              href="/generate/guided"
              className="group flex w-full flex-col rounded-lg border border-border bg-card dark:bg-black transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:border-primary/40 active:scale-[0.98]"
            >
              <div className="flex w-full px-6">
                <div className="w-full border-b border-border" />
              </div>
              <div className="relative mx-auto flex w-full  flex-col items-center p-6">
                <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card">
                  <div className="z-10 flex max-w-[460px] flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-primary/40">
                      <Wand2 className="h-8 w-8 stroke-[1.5px] text-primary/60" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-base font-medium text-primary">
                        {t("mode.guided")}
                      </p>
                    </div>
                  </div>
                  <div className="base-grid absolute h-full w-full opacity-40" />
                  <div className="absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
                </div>
              </div>
            </Link>
            <Link
              href="/generate/segment"
              className="group flex w-full flex-col rounded-lg border border-border bg-card dark:bg-black transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:border-primary/40 active:scale-[0.98]"
            >
              <div className="flex w-full px-6">
                <div className="w-full border-b border-border" />
              </div>
              <div className="relative mx-auto flex w-full  flex-col items-center p-6">
                <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card">
                  <div className="z-10 flex max-w-[460px] flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-primary/40">
                      <List className="h-8 w-8 stroke-[1.5px] text-primary/60" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-base font-medium text-primary">
                        {t("mode.segment")}
                      </p>
                    </div>
                  </div>
                  <div className="base-grid absolute h-full w-full opacity-40" />
                  <div className="absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
