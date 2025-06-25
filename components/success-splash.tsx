"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Clock, Mail } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export function SuccessSplash() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div
        className={`
        max-w-2xl w-full text-center transform transition-all duration-1000
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
      `}
      >
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-[#eb6e03] rounded-full flex items-center justify-center animate-pulse shadow-lg">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-[#eb6e03]/30 rounded-full animate-ping" />
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#040956] mb-6">{t("portal.kycVerificationInitiated")}</h1>

        {/* Description */}
        <div className="bg-white shadow-lg rounded-lg p-8 border border-slate-200 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-[#eb6e03] mr-2" />
            <span className="text-[#eb6e03] font-semibold text-lg">{t("portal.processingTime")}</span>
          </div>

          <p className="text-[#040956] text-lg leading-relaxed mb-6">{t("portal.kycInitiatedDescription")}</p>

          <div className="flex items-center justify-center text-slate-600">
            <Mail className="h-5 w-5 mr-2" />
            <span>{t("portal.emailNotification")}</span>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-[#eb6e03]/10 border border-[#eb6e03]/20 rounded-lg p-6 shadow-lg">
          <h3 className="text-[#eb6e03] font-semibold text-xl mb-3">{t("portal.whatHappensNext")}</h3>
          <div className="text-[#040956] space-y-2">
            <p>{t("portal.documentVerification")}</p>
            <p>{t("portal.emailNotificationCompletion")}</p>
            <p>{t("portal.accessNextStage")}</p>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-[#eb6e03] rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-[#040956] rounded-full animate-bounce delay-75" />
          <div className="w-3 h-3 bg-[#eb6e03] rounded-full animate-bounce delay-150" />
        </div>
      </div>
    </div>
  )
}
