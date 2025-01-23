import { StepIndicator } from "../../_components/step-indicator";

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
    </>
  );
}
