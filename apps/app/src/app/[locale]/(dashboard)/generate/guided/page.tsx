import { StepIndicator } from "../../_components/step-indicator";
import { GuidedGenerationForm } from "./guided-generation-form";

export const metadata = {
  title: "Voidream",
};

export default async function Generation() {
  const steps = [
    { number: 1, text: "Select Mode" },
    { number: 2, text: "Prompt" },
    { number: 3, text: "Refine" },
    { number: 4, text: "Customize" },
  ];
  const currentStep = 2;

  return (
    <>
      <h1 className="mt-24 font-medium text-center text-5xl text-primary/80">
        Guided Story Creation
      </h1>

      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        className="mt-16"
      />
      <div className="mx-auto max-w-3xl w-full mt-8">
        <div className="rounded-xl border text-card-foreground w-full bg-white shadow-lg">
          <GuidedGenerationForm />
        </div>
      </div>
    </>
  );
}
