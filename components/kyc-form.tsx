"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileUpload } from "@/components/file-upload"
import { CheckCircle, Upload, AlertCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

interface KYCFormProps {
  onSubmit: (formData: FormData) => Promise<void>
}

export function KYCForm({ onSubmit }: KYCFormProps) {
  const { t } = useI18n()
  const [documentType, setDocumentType] = useState<"id" | "passport">("id")
  const [files, setFiles] = useState({
    idFront: null as File | null,
    idBack: null as File | null,
    passportFirst: null as File | null,
    passportLast: null as File | null,
    passportPhoto: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [showAnimation, setShowAnimation] = useState(false)

  const handleFileChange = (fileType: keyof typeof files, file: File | null) => {
    setFiles((prev) => ({ ...prev, [fileType]: file }))

    // Check if all required documents are uploaded for animation
    if (documentType === "id" && fileType === "idBack" && file && files.idFront) {
      setShowAnimation(true)
      setTimeout(() => setShowAnimation(false), 2000)
    } else if (documentType === "passport" && fileType === "passportLast" && file && files.passportFirst) {
      setShowAnimation(true)
      setTimeout(() => setShowAnimation(false), 2000)
    }
  }

  const validateForm = () => {
    const newErrors: string[] = []

    if (documentType === "id") {
      if (!files.idFront) newErrors.push(t("kyc.idFrontRequired"))
      if (!files.idBack) newErrors.push(t("kyc.idBackRequired"))
    } else {
      if (!files.passportFirst) newErrors.push(t("kyc.passportFirstRequired"))
      if (!files.passportLast) newErrors.push(t("kyc.passportLastRequired"))
    }

    if (!files.passportPhoto) newErrors.push(t("kyc.passportPhotoRequired"))

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("documentType", documentType)

      if (documentType === "id") {
        if (files.idFront) formData.append("idFront", files.idFront)
        if (files.idBack) formData.append("idBack", files.idBack)
      } else {
        if (files.passportFirst) formData.append("passportFirst", files.passportFirst)
        if (files.passportLast) formData.append("passportLast", files.passportLast)
      }

      if (files.passportPhoto) formData.append("passportPhoto", files.passportPhoto)

      await onSubmit(formData)
    } catch (error) {
      setErrors([t("kyc.submissionFailed")])
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormComplete = () => {
    if (documentType === "id") {
      return files.idFront && files.idBack && files.passportPhoto
    }
    return files.passportFirst && files.passportLast && files.passportPhoto
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Document Type Selection */}
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
{t("kyc.selectDocumentType")}
            
          </p>
        </div>
        <RadioGroup
          value={documentType}
          onValueChange={(value) => setDocumentType(value as "id" | "passport")}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="id" id="id" className="border-slate-300 text-[#eb6e03]" />
            <Label htmlFor="id" className="text-[#040956] cursor-pointer">
              {t("kyc.driversLicenseOrId")}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="passport" id="passport" className="border-slate-300 text-[#eb6e03]" />
            <Label htmlFor="passport" className="text-[#040956] cursor-pointer">
              {t("kyc.kenyanPassport")}
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Document Upload Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {documentType === "id" ? (
          <>
            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-[#040956] flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  {t("kyc.idFront")}
                </CardTitle>
                <CardDescription className="text-slate-500">{t("kyc.uploadFrontSide")}</CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFileChange={(file) => handleFileChange("idFront", file)}
                  accept="image/*"
                  maxSize={5 * 1024 * 1024} // 5MB
                />
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-[#040956] flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  {t("kyc.idBack")}
                </CardTitle>
                <CardDescription className="text-slate-500">{t("kyc.uploadBackSide")}</CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFileChange={(file) => handleFileChange("idBack", file)}
                  accept="image/*"
                  maxSize={5 * 1024 * 1024} // 5MB
                />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-[#040956] flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  {t("kyc.passportFirstPage")}
                </CardTitle>
                <CardDescription className="text-slate-500">{t("kyc.uploadFirstPage")}</CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFileChange={(file) => handleFileChange("passportFirst", file)}
                  accept="image/*"
                  maxSize={5 * 1024 * 1024} // 5MB
                />
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-[#040956] flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  {t("kyc.passportLastPage")}
                </CardTitle>
                <CardDescription className="text-slate-500">{t("kyc.uploadLastPage")}</CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFileChange={(file) => handleFileChange("passportLast", file)}
                  accept="image/*"
                  maxSize={5 * 1024 * 1024} // 5MB
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Passport Photo Upload */}
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-[#040956] flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {t("kyc.passportStylePhoto")}
          </CardTitle>
          <CardDescription className="text-slate-500">{t("kyc.uploadPassportPhoto")}</CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload
            onFileChange={(file) => handleFileChange("passportPhoto", file)}
            accept="image/*"
            maxSize={5 * 1024 * 1024} // 5MB
          />
        </CardContent>
      </Card>

      {/* Completion Animation */}
      {showAnimation && (
        <div className="flex items-center justify-center p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <CheckCircle className="h-6 w-6 text-green-400 mr-2 animate-pulse" />
          <span className="text-green-400 font-semibold">{t("kyc.documentsUploaded")}</span>
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert className="border-red-500/30 bg-red-500/10">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-400">
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isFormComplete() || isSubmitting}
        className="w-full bg-[#eb6e03] hover:bg-[#eb6e03]/90 text-white font-semibold py-3 text-lg"
      >
        {isSubmitting ? t("common.submitting") : t("kyc.submitDocuments")}
      </Button>
    </form>
  )
}
