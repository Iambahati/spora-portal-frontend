"use client"

import { InvestmentStages, INVESTMENT_STAGES } from "./investment-stages"

interface InvestmentStepperProps {
  currentStage?: string
  variant?: 'vertical' | 'horizontal'
  showDescription?: boolean
  className?: string
}

export function InvestmentStepper({ 
  currentStage = 'nda',
  variant = 'vertical',
  showDescription = true,
  className
}: InvestmentStepperProps) {
  return (
    <InvestmentStages
      stages={INVESTMENT_STAGES}
      currentStage={currentStage}
      variant={variant}
      showDescription={showDescription}
      className={className}
    />
  )
}
