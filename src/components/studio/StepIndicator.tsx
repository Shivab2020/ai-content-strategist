import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  name: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.id}
            className={cn(
              "relative",
              stepIdx !== steps.length - 1 ? "flex-1 pr-8" : ""
            )}
          >
            <div className="flex items-center">
              <button
                onClick={() => onStepClick?.(step.id)}
                disabled={step.id > currentStep}
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200",
                  step.id < currentStep
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : step.id === currentStep
                    ? "border-2 border-primary bg-background text-primary"
                    : "border-2 border-muted bg-background text-muted-foreground"
                )}
              >
                {step.id < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </button>
              
              {stepIdx !== steps.length - 1 && (
                <div
                  className={cn(
                    "ml-4 h-0.5 flex-1 transition-colors duration-200",
                    step.id < currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
            
            <div className="mt-3">
              <span
                className={cn(
                  "text-sm font-medium",
                  step.id <= currentStep ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.name}
              </span>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
