import React from 'react'
import { CheckCircle, Clock, AlertCircle, FileText, UserCheck, FileSignature, CreditCard, Award, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface InvestmentStage {
  id: string
  title: string
  description: string
  status: 'completed' | 'current' | 'pending' | 'blocked'
  icon: React.ElementType
}

export const INVESTMENT_STAGES: InvestmentStage[] = [
  {
    id: 'nda',
    title: 'Sign NDA',
    description: 'Awaiting NDA acknowledgment',
    status: 'pending',
    icon: FileText
  },
  {
    id: 'kyc-pending',
    title: 'Pending KYC',
    description: 'Document verification in progress',
    status: 'pending',
    icon: Clock
  },
  {
    id: 'kyc-approved',
    title: 'KYC Approved',
    description: 'Identity verified successfully',
    status: 'pending',
    icon: UserCheck
  },
  {
    id: 'payment-pending',
    title: 'Payment Pending',
    description: 'Awaiting payment confirmation',
    status: 'pending',
    icon: CreditCard
  },
  {
    id: 'payment-confirmed',
    title: 'Payment Confirmed',
    description: 'Payment has been confirmed',
    status: 'pending',
    icon: CheckCircle
  },
  {
    id: 'certificate-issued',
    title: 'Certificate Issued',
    description: 'Share certificate has been issued',
    status: 'pending',
    icon: Award
  },
]

interface InvestmentStagesProps {
  stages?: InvestmentStage[]
  currentStage?: string
  className?: string
  variant?: 'vertical' | 'horizontal'
  showDescription?: boolean
}

export function InvestmentStages({ 
  stages = INVESTMENT_STAGES, 
  currentStage,
  className,
  variant = 'vertical',
  showDescription = true
}: InvestmentStagesProps) {
  // Update stages based on current stage
  const updatedStages = stages.map((stage, index) => {
    const currentIndex = stages.findIndex(s => s.id === currentStage)
    
    if (currentIndex === -1) {
      return stage // No current stage set, keep original
    }
    
    if (index < currentIndex) {
      return { ...stage, status: 'completed' as const }
    } else if (index === currentIndex) {
      return { ...stage, status: 'current' as const }
    } else {
      return { ...stage, status: 'pending' as const }
    }
  })

  const getStageStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          circle: 'bg-green-500 border-green-500 text-white',
          line: 'bg-green-500',
          text: 'text-green-700',
          description: 'text-green-600'
        }
      case 'current':
        return {
          circle: 'bg-[#eb6e03] border-[#eb6e03] text-white animate-pulse',
          line: 'bg-gray-200',
          text: 'text-[#eb6e03] font-semibold',
          description: 'text-[#eb6e03]'
        }
      case 'blocked':
        return {
          circle: 'bg-red-100 border-red-300 text-red-600',
          line: 'bg-gray-200',
          text: 'text-red-600',
          description: 'text-red-500'
        }
      default: // pending
        return {
          circle: 'bg-gray-100 border-gray-300 text-gray-500',
          line: 'bg-gray-200',
          text: 'text-gray-500',
          description: 'text-gray-400'
        }
    }
  }

  const getStatusIcon = (stage: InvestmentStage, index: number) => {
    const Icon = stage.icon
    
    if (stage.status === 'completed') {
      return <CheckCircle className="h-4 w-4" />
    }
    
    if (stage.status === 'blocked') {
      return <AlertCircle className="h-4 w-4" />
    }
    
    if (stage.status === 'current') {
      return <Icon className="h-4 w-4" />
    }
    
    return <span className="text-xs font-semibold">{index + 1}</span>
  }

  if (variant === 'horizontal') {
    return (
      <div className={cn("w-full overflow-x-auto", className)}>
        <div className="flex items-center min-w-max">
          {updatedStages.map((stage, index) => {
            const styles = getStageStyles(stage.status)
            const isLast = index === updatedStages.length - 1
            
            return (
              <React.Fragment key={stage.id}>
                <div className="flex flex-col items-center">
                  {/* Circle */}
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                      styles.circle
                    )}
                  >
                    {getStatusIcon(stage, index)}
                  </div>
                  
                  {/* Text */}
                  <div className="mt-2 text-center max-w-[120px]">
                    <p className={cn("text-sm font-medium", styles.text)}>
                      {stage.title}
                    </p>
                    {showDescription && (
                      <p className={cn("text-xs mt-1 leading-tight", styles.description)}>
                        {stage.description}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Connecting line */}
                {!isLast && (
                  <div className="flex-shrink-0 mx-4">
                    <div 
                      className={cn(
                        "w-12 h-0.5 transition-all duration-200",
                        index < updatedStages.findIndex(s => s.status === 'current') 
                          ? 'bg-green-500' 
                          : 'bg-gray-200'
                      )}
                    />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    )
  }

  // Vertical layout (default)
  return (
    <div className={cn("space-y-4", className)}>
      {updatedStages.map((stage, index) => {
        const styles = getStageStyles(stage.status)
        const isLast = index === updatedStages.length - 1
        
        return (
          <div key={stage.id} className="relative flex items-start">
            {/* Connecting line */}
            {!isLast && (
              <div 
                className={cn(
                  "absolute left-5 top-10 w-0.5 h-16 transition-all duration-200",
                  index < updatedStages.findIndex(s => s.status === 'current') 
                    ? 'bg-green-500' 
                    : 'bg-gray-200'
                )}
              />
            )}
            
            {/* Circle */}
            <div 
              className={cn(
                "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 relative z-10",
                styles.circle
              )}
            >
              {getStatusIcon(stage, index)}
            </div>
            
            {/* Content */}
            <div className="ml-4 min-w-0 flex-1">
              <h3 className={cn("text-sm font-medium", styles.text)}>
                {stage.title}
              </h3>
              {showDescription && (
                <p className={cn("text-sm mt-1", styles.description)}>
                  {stage.description}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default InvestmentStages
