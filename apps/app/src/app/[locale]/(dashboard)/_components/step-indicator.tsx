import { cn } from "@v1/ui/utils";
import { ChevronRight } from "lucide-react";

interface Step {
  number: number;
  text: string;
}

interface StepProps extends Step {
  status: "completed" | "current" | "upcoming";
}

// 单个步骤组件
function Step({ number, text, status }: StepProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          "text-base font-semibold transition-colors duration-200",
          {
            "bg-primary text-primary-foreground": status === "completed",
            "border-2 border-primary text-primary": status === "current",
            "border border-muted-foreground/40 text-muted-foreground":
              status === "upcoming",
          },
        )}
      >
        {number}
      </div>
      <span
        className={cn("mt-2 text-sm whitespace-nowrap", {
          "text-primary font-medium":
            status === "completed" || status === "current",
          "text-muted-foreground": status === "upcoming",
        })}
      >
        {text}
      </span>
    </div>
  );
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

// 步骤指示器组件
export function StepIndicator({
  steps,
  currentStep,
  className,
}: StepIndicatorProps) {
  return (
    <div className={cn("mb-8 hidden md:block max-w-xl mx-auto", className)}>
      <div className="flex justify-center items-center gap-12">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {index > 0 && (
              <ChevronRight
                className={cn(
                  "w-6 h-6 mr-12",
                  index < currentStep
                    ? "text-primary"
                    : "text-muted-foreground/40",
                )}
              />
            )}
            <Step
              key={step.number}
              {...step}
              status={
                index < currentStep
                  ? "completed"
                  : index === currentStep
                    ? "current"
                    : "upcoming"
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
