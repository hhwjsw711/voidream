import { getScopedI18n } from "@/locales/server";
import { Plus } from "lucide-react";
import { StepIndicator } from "./_components/step-indicator";

export const metadata = {
  title: "Dashboard | Voidream",
};

export default async function Page() {
  const t = await getScopedI18n("dashboard");
  const steps = [
    { number: 1, text: "Select Mode" },
    { number: 2, text: "Prompt" },
    { number: 3, text: "Refine" },
  ];
  const currentStep = 2;

  return (
    <>
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        className="mt-16"
      />
      <div className="flex h-full w-full bg-secondary px-6 py-8 dark:bg-black">
        <div className="z-10 mx-auto flex h-full w-full max-w-screen-xl gap-12">
          <div className="flex w-full flex-col rounded-lg border border-border bg-card dark:bg-black">
            <div className="flex w-full flex-col rounded-lg p-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-medium text-primary">
                  {t("bodyTitle")}
                </h2>
                <p className="text-sm font-normal text-primary/60">
                  {t("bodyDescription")}
                </p>
              </div>
            </div>
            <div className="flex w-full px-6">
              <div className="w-full border-b border-border" />
            </div>
            <div className="relative mx-auto flex w-full  flex-col items-center p-6">
              <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card">
                <div className="z-10 flex max-w-[460px] flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-primary/40">
                    <Plus className="h-8 w-8 stroke-[1.5px] text-primary/60" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-base font-medium text-primary">
                      {t("title")}
                    </p>
                    <p className="text-center text-base font-normal text-primary/60">
                      {t("description")}
                    </p>
                  </div>
                </div>
                <div className="base-grid absolute h-full w-full opacity-40" />
                <div className="absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
