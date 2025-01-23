import { StepIndicator } from "../../../_components/step-indicator";
import { RefineStoryContent } from "./refine-story-content";

export const metadata = {
  title: "Voidream",
};

export default async function RefineStory() {
  const steps = [
    { number: 1, text: "Select Mode" },
    { number: 2, text: "Prompt" },
    { number: 3, text: "Refine" },
    { number: 4, text: "Customize" },
  ];
  const currentStep = 3;

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

      <div className="min-h-screen p-4 space-y-8 py-8">
        <div className="container mx-auto">
          <RefineStoryContent />
        </div>
      </div>
    </>
  );
}
