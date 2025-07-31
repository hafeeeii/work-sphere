import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepperProps {
  steps: string[]
  currentStep: number
  className?: string
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ steps, currentStep, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between w-full max-w-2xl", className)}
        {...props}
      >
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                  index < currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : index === currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-muted-foreground text-muted-foreground"
                )}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-sm font-medium text-center transition-colors duration-200",
                  index <= currentStep
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4 transition-colors duration-200",
                  index < currentStep
                    ? "bg-primary"
                    : "bg-border"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    )
  }
)

Stepper.displayName = "Stepper"

export { Stepper }