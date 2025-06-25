import { useState } from "react"
import { useAuthCheck } from "@/router/hooks/use-auth-check"
import { KYCForm } from "@/components/kyc-form"
import { SuccessSplash } from "@/components/success-splash"
import { NavigationHeader } from "@/components/navigation-header"
import AppFooter from "@/components/professional-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Camera, CheckCircle2, Upload, Eye, Shield, Info } from "lucide-react"
import { InvestmentStages } from '@/components/investment-stages'
import { getStageForPage } from '@/lib/investment-stage-utils'

export default function KYCUploadPage() {
  const { user } = useAuthCheck()
  const [showSplash, setShowSplash] = useState(false)

  const handleKYCSubmit = async (formData: FormData) => {
    try {
      // In a real app, this would upload to the API
      console.log('KYC form submitted:', formData)
      setShowSplash(true)
    } catch (error) {
      console.error('Failed to submit KYC:', error)
    }
  }

  if (showSplash) {
    return <SuccessSplash />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <NavigationHeader 
        user={{
          name: user?.name || "User",
          email: user?.email || ""
        }}
        title="Identity Verification"
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Section */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#eb6e03]/10 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-[#eb6e03]" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Account Setup Progress</h2>
            </div>
            <InvestmentStages
              currentStage={getStageForPage('kyc-upload')}
              variant="horizontal"
              showDescription={false}
              className="w-full"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Verify Your Identity</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload your government-issued ID and a verification photo to comply with regulatory requirements.
            </p>
          </div>

          {/* Why We Need This */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Why we need this</h3>
                <p className="text-blue-800 text-sm">
                  We need to verify your identity to comply with regulatory requirements and protect your investment. Your verification photo will be cross-checked with your ID to ensure authenticity and prevent fraud.
                </p>
              </div>
            </div>
          </div>

          {/* Process Overview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Process</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#eb6e03]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Upload className="h-6 w-6 text-[#eb6e03]" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">1. Upload Documents</h4>
                <p className="text-sm text-gray-600">Securely upload your ID and verification photo</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-[#eb6e03]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Eye className="h-6 w-6 text-[#eb6e03]" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">2. Manual Review</h4>
                <p className="text-sm text-gray-600">Our KYC team validates document authenticity</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-[#eb6e03]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="h-6 w-6 text-[#eb6e03]" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">3. Approval</h4>
                <p className="text-sm text-gray-600">Verification completed within 2-3 business days</p>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Requirements</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Government ID */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#eb6e03]/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 text-[#eb6e03]" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Government-issued ID</h4>
                </div>
                <p className="text-sm text-gray-600 ml-11 mb-2">
                  Upload <strong>any one</strong> of the following:
                </p>
                <ul className="space-y-1 text-sm text-gray-600 ml-11">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                    National ID Card
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                    Valid Passport
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                    Driving License
                  </li>
                </ul>
                <p className="text-xs text-gray-500 ml-11">Must be current and unexpired</p>
              </div>

              {/* Verification Photo */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#eb6e03]/10 rounded-lg flex items-center justify-center">
                    <Camera className="h-4 w-4 text-[#eb6e03]" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Verification Photo</h4>
                </div>
                <ul className="space-y-1 text-sm text-gray-600 ml-11">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                    Clear selfie photo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                    Face fully visible
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                    Good lighting, no filters
                  </li>
                </ul>
                <p className="text-xs text-gray-500 ml-11">Will be compared with your ID photo</p>
              </div>
            </div>
          </div>

          {/* Upload Form */}
          <Card className="border-gray-200 bg-white rounded-xl">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Documents</h3>
                  <p className="text-gray-600">Drag and drop your files or click to browse</p>
                </div>
                
                <KYCForm onSubmit={handleKYCSubmit} />
              </div>
            </CardContent>
          </Card>

          {/* Review Time Notice */}
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Review Time:</strong> Our KYC team will review and verify your documents within 2-3 business days. You'll receive an email notification once verification is complete.
            </AlertDescription>
          </Alert>

          {/* Security Notice */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-gray-900 mb-1">Your Privacy & Security</p>
                <p className="text-gray-700">All documents are encrypted during upload and storage. Only our certified KYC team can access your information, and it's used solely for verification purposes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Footer */}
      <AppFooter />
    </div>
  )
}
