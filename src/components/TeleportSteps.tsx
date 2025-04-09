
import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StepStatus = 'idle' | 'loading' | 'complete' | 'error';

interface Step {
  id: string;
  title: string;
  description: string;
  status: StepStatus;
}

interface TeleportStepsProps {
  steps: Step[];
  currentStepId: string;
}

const TeleportSteps: React.FC<TeleportStepsProps> = ({ steps, currentStepId }) => {
  return (
    <div className="space-y-4 mt-6">
      {steps.map((step, index) => {
        const isCurrent = step.id === currentStepId;
        const isCompleted = step.status === 'complete';
        const isLoading = step.status === 'loading';
        const isError = step.status === 'error';
        
        const stepNumberClass = cn(
          "flex items-center justify-center h-8 w-8 rounded-full border text-sm font-medium mr-4",
          {
            "bg-primary text-white border-primary": isCurrent && !isCompleted && !isError,
            "bg-green-600 text-white border-green-600": isCompleted,
            "bg-red-600 text-white border-red-600": isError,
            "border-gray-300 text-gray-500": !isCurrent && !isCompleted && !isError,
            "animate-pulse": isLoading
          }
        );
        
        return (
          <div key={step.id} className="flex items-start">
            <div className={stepNumberClass}>
              {isCompleted ? (
                <Check className="h-4 w-4" />
              ) : isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                index + 1
              )}
            </div>
            <div className="flex-1">
              <h3 className={cn("font-medium", {
                "text-primary": isCurrent && !isCompleted && !isError,
                "text-green-600": isCompleted,
                "text-red-600": isError,
                "text-gray-500": !isCurrent && !isCompleted && !isError
              })}>
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeleportSteps;
