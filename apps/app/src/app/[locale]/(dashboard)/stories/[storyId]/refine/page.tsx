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
    <div className="min-h-screen flex flex-col">
      <div className="pt-8 sm:pt-12 pb-6 space-y-6 sm:space-y-8 px-4">
        <h1 className="font-medium text-center text-3xl sm:text-4xl lg:text-5xl text-primary/80">
          Refine Your Story
        </h1>
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>

      <div className="flex-1 px-4 py-6 space-y-8">
        <div className="container mx-auto">
          <RefineStoryContent />
        </div>
      </div>
    </div>
  );
}
