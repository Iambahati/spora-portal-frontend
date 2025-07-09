import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { useAuthState } from '@/lib/auth-context'
import { useI18n } from '@/lib/i18n/context'
import { NavigationHeader } from '@/components/navigation-header'
import AppFooter from '@/components/professional-footer'
import { InvestmentStages } from '@/components/investment-stages'
import { getStageForPage } from '@/lib/investment-stage-utils'
import { 
  FileText, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ArrowRight,
  Eye,
  Clock,
  ScrollText,
  BookOpen
} from 'lucide-react'

// Mock NDA data - in real app this would come from API
const getActiveNDA = () => {
  // First try to get admin uploaded NDAs
  const adminNDAs = JSON.parse(localStorage.getItem('admin_ndas') || '[]')
  const activeAdminNDA = adminNDAs.find((nda: any) => nda.status === 'active')
  
  if (activeAdminNDA) {
    return {
      id: activeAdminNDA.id,
      title: activeAdminNDA.title,
      content: `This is the content of ${activeAdminNDA.title}. In a real application, this would display the actual NDA content from the uploaded PDF file.`,
      fileName: activeAdminNDA.filename,
      uploadDate: activeAdminNDA.uploadDate,
      version: activeAdminNDA.version,
      isActive: true,
      fileData: activeAdminNDA.fileData,
      fileType: activeAdminNDA.fileType
    }
  }
  
  // Fallback to mock NDA
  return {
    id: 1,
    title: "Investment Agreement NDA 2024",
    content: `
MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into on [DATE] by and between Spora One Trust ("Company") and the undersigned investor ("Investor").

WHEREAS, Company and Investor wish to explore potential investment opportunities; and

WHEREAS, in connection with such discussions, each party may disclose to the other certain confidential and proprietary information;

NOW, THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION
For purposes of this Agreement, "Confidential Information" means any and all non-public, proprietary or confidential information disclosed by either party to the other, whether orally, in writing, or in any other form, including but not limited to:
- Financial information, business plans, and strategies
- Investment opportunities and portfolio details
- Technical data, trade secrets, and know-how
- Customer lists and market research
- Any other information marked or identified as confidential

2. OBLIGATIONS OF RECEIVING PARTY
The receiving party agrees to:
- Hold all Confidential Information in strict confidence
- Use Confidential Information solely for the purpose of evaluating potential investment opportunities
- Not disclose Confidential Information to any third party without prior written consent
- Protect Confidential Information with the same degree of care used to protect its own confidential information

3. EXCEPTIONS
The obligations set forth in Section 2 shall not apply to information that:
- Is or becomes publicly available through no breach of this Agreement
- Was rightfully known prior to disclosure
- Is rightfully received from a third party without breach of confidentiality
- Is required to be disclosed by law or court order

4. RETURN OF INFORMATION
Upon termination of discussions or upon request, each party shall promptly return or destroy all Confidential Information and any copies thereof.

5. TERM
This Agreement shall remain in effect for a period of three (3) years from the date of execution unless earlier terminated by mutual consent.

6. REMEDIES
Each party acknowledges that any breach of this Agreement may cause irreparable harm for which monetary damages would be inadequate. Therefore, each party shall be entitled to seek injunctive relief and other equitable remedies.

7. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of [JURISDICTION].

By accepting this agreement, you acknowledge that you have read, understood, and agree to be bound by all terms and conditions set forth herein.
    `,
    fileName: "investment-nda-2024.pdf",
    uploadDate: "2024-06-15",
    version: "v1.2",
    isActive: true
  }
}

export default function NDAAcceptancePage() {
  const { user } = useAuthState()
  const { t } = useI18n()
  const navigate = useNavigate()

  const [currentNDA, setCurrentNDA] = useState<any>(null)
  const [ndaAccepted, setNdaAccepted] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reading tracking states
  const [readingProgress, setReadingProgress] = useState(0)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null)
  const [timeSpentReading, setTimeSpentReading] = useState(0)
  const [comprehensionChecks, setComprehensionChecks] = useState({
    understoodConfidentiality: false,
    understoodConsequences: false,
    confirmedIdentity: false,
    confirmedRead: false // New checkbox
  })

  const contentRef = useRef<HTMLDivElement>(null)
  const MINIMUM_READING_TIME = 30 // seconds
  const READING_PROGRESS_THRESHOLD = 95 // percentage

  // Helper to get a unique user key for localStorage
  const getUserKey = () => {
    if (user && typeof user === 'object') {
      // Try all possible unique fields in order
      if ('id' in user && user.id) return String(user.id)
      if ('email' in user && user.email) return user.email
      if ('full_name' in user && user.full_name) return user.full_name
      if ('name' in user && user.name) return user.name
    }
    return 'anonymous'
  }
  const TIMER_KEY = `nda_timer_${getUserKey()}`
  const STATUS_KEY = `nda_status_${getUserKey()}`

  // Helper to get a display name for the user
  const getUserDisplayName = () => {
    if (user && typeof user === 'object') {
      if ('full_name' in user && user.full_name) return user.full_name
      if ('name' in user && user.name) return user.name
      if ('email' in user && user.email) return user.email
    }
    return 'this user'
  }

  // Load active NDA and check user status
  useEffect(() => {
    const nda = getActiveNDA()
    setCurrentNDA(nda)

    // Check if user has already accepted/declined this NDA
    const userNDAStatus = localStorage.getItem(STATUS_KEY)
    if (userNDAStatus) {
      setNdaAccepted(userNDAStatus === 'accepted')
    }

    // Restore timer from storage if available
    const storedTime = localStorage.getItem(TIMER_KEY)
    if (storedTime && !isNaN(Number(storedTime))) {
      setTimeSpentReading(Math.min(Number(storedTime), MINIMUM_READING_TIME))
    } else {
      setTimeSpentReading(0)
    }
    setReadingStartTime(Date.now())
  }, [user])

  // Update reading time every second, cap at 30s, persist to localStorage
  useEffect(() => {
    if (ndaAccepted !== null) return // Don't run timer if NDA is accepted/declined
    if (timeSpentReading >= MINIMUM_READING_TIME) return // Already capped
    let interval: NodeJS.Timeout | null = null
    if (readingStartTime) {
      interval = setInterval(() => {
        setTimeSpentReading(prev => {
          const next = Math.min(prev + 1, MINIMUM_READING_TIME)
          localStorage.setItem(TIMER_KEY, String(next))
          return next
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [readingStartTime, ndaAccepted])

  // Scroll tracking for reading progress
  const handleScroll = useCallback(() => {
    if (!contentRef.current) return
    const element = contentRef.current
    const scrollTop = element.scrollTop
    const scrollHeight = element.scrollHeight - element.clientHeight
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 100
    setReadingProgress(Math.min(progress, 100))
    if (progress >= READING_PROGRESS_THRESHOLD) {
      setHasScrolledToBottom(true)
    }
  }, [READING_PROGRESS_THRESHOLD])

  // Check if user can accept NDA
  const canAcceptNDA = () => {
    return (
      hasScrolledToBottom &&
      timeSpentReading >= MINIMUM_READING_TIME &&
      comprehensionChecks.understoodConfidentiality &&
      comprehensionChecks.understoodConsequences &&
      comprehensionChecks.confirmedIdentity &&
      comprehensionChecks.confirmedRead // Require new checkbox
    )
  }

  const handleAcceptNDA = async () => {
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      localStorage.setItem(STATUS_KEY, 'accepted')
      setNdaAccepted(true)
      setTimeout(() => {
        navigate('/kyc-upload')
      }, 2000)
    } catch (error) {
      console.error('Failed to accept NDA:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeclineNDA = async () => {
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      localStorage.setItem(STATUS_KEY, 'declined')
      setNdaAccepted(false)
    } catch (error) {
      console.error('Failed to decline NDA:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const downloadNDA = () => {
    if (!currentNDA) return
    
    if (currentNDA.fileData) {
      // Download uploaded file
      const link = document.createElement('a')
      link.href = currentNDA.fileData
      link.download = currentNDA.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // Download text content as file
      const blob = new Blob([currentNDA.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = currentNDA.fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  if (ndaAccepted === true) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-green-700">NDA Accepted</CardTitle>
            <CardDescription>
              Thank you for accepting the Non-Disclosure Agreement. You can now proceed with the KYC process.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/kyc-upload')} className="w-full">
              Continue to KYC Process
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (ndaAccepted === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-red-700">NDA Declined</CardTitle>
            <CardDescription>
              You have declined the Non-Disclosure Agreement. Unfortunately, you cannot proceed with the investment process without accepting the NDA.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                To continue with your investment journey, you must accept the NDA. Please review the document again and contact support if you have any questions.
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setNdaAccepted(null)} className="flex-1">
                Review Again
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex-1">
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show loading state while NDA is being loaded
  if (!currentNDA) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading NDA document...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <NavigationHeader 
        user={user ?? undefined}
      />

      {/* Investment Stages Progress */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-[#040956] mb-4">Account Setup Progress</h2>
              <InvestmentStages
                currentStage={getStageForPage('nda-acceptance')}
                variant="horizontal"
                showDescription={false}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Non-Disclosure Agreement</CardTitle>
              <CardDescription className="text-lg">
                Please review and accept the NDA to continue with your investment process
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Reading Progress Indicator */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <ScrollText className="h-4 w-4" />
                    Reading Progress
                  </span>
                  <span className="font-medium">{Math.round(readingProgress)}%</span>
                </div>
                <Progress value={readingProgress} className="h-2" />
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Time reading: {Math.floor(timeSpentReading / 60)}m {timeSpentReading % 60}s
                  </span>
                  <span>
                    Minimum: {Math.floor(MINIMUM_READING_TIME / 60)}m {MINIMUM_READING_TIME % 60}s
                  </span>
                </div>
              </div>

              {/* NDA Document Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-gray-600" />
                  <div>
                    <h3 className="font-semibold">{currentNDA?.title}</h3>
                    <p className="text-sm text-gray-500">Version {currentNDA?.version} • Updated {currentNDA?.uploadDate}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={downloadNDA}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>

              {/* NDA Content - Always Visible */}
              <Card className="border-2 border-blue-200">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Document Content
                  </CardTitle>
                  <CardDescription>
                    Please read the entire document carefully. You must scroll to the bottom to continue.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div 
                    ref={contentRef}
                    onScroll={handleScroll}
                    className="h-96 overflow-y-auto p-6 prose prose-sm max-w-none"
                    style={{ scrollBehavior: 'smooth' }}
                  >
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                      {currentNDA?.content}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* Reading Requirements Status */}
              <Card className="border-orange-200">
                <CardHeader className="bg-orange-50">
                  <CardTitle className="text-lg">Reading Requirements</CardTitle>
                  <CardDescription>
                    Please complete all requirements below before you can accept the NDA
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    {hasScrolledToBottom ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                    <span className={hasScrolledToBottom ? "text-green-600" : "text-gray-500"}>
                      Read the entire document (scroll to bottom)
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {timeSpentReading >= MINIMUM_READING_TIME ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                    <span className={timeSpentReading >= MINIMUM_READING_TIME ? "text-green-600" : "text-gray-500"}>
                      Spend at least {MINIMUM_READING_TIME} seconds reading ({timeSpentReading}s elapsed)
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Comprehension Checks */}
              <Card className="border-purple-200">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="text-lg">Comprehension Confirmation</CardTitle>
                  <CardDescription>
                    Please confirm your understanding by checking all boxes below
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="confidentiality"
                      checked={comprehensionChecks.understoodConfidentiality}
                      onCheckedChange={(checked) =>
                        setComprehensionChecks(prev => ({
                          ...prev,
                          understoodConfidentiality: checked as boolean
                        }))
                      }
                    />
                    <label htmlFor="confidentiality" className="text-sm leading-relaxed cursor-pointer">
                      I understand that I must keep all information shared by Spora One Trust strictly confidential and not disclose it to any third parties.
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="consequences"
                      checked={comprehensionChecks.understoodConsequences}
                      onCheckedChange={(checked) =>
                        setComprehensionChecks(prev => ({
                          ...prev,
                          understoodConsequences: checked as boolean
                        }))
                      }
                    />
                    <label htmlFor="consequences" className="text-sm leading-relaxed cursor-pointer">
                      I understand the legal consequences of breaching this NDA and that Spora One Trust may seek injunctive relief and damages.
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="identity"
                      checked={comprehensionChecks.confirmedIdentity}
                      onCheckedChange={(checked: boolean | "indeterminate") =>
                        setComprehensionChecks(prev => ({
                          ...prev,
                          confirmedIdentity: Boolean(checked)
                        }))
                      }
                    />
                    <label htmlFor="identity" className="text-sm leading-relaxed cursor-pointer">
                      I confirm that I am {getUserDisplayName()} and I have the authority to enter into this agreement on my behalf.
                    </label>
                  </div>

                  {/* New checkbox for reading confirmation */}
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="read"
                      checked={comprehensionChecks.confirmedRead}
                      onCheckedChange={(checked) =>
                        setComprehensionChecks(prev => ({
                          ...prev,
                          confirmedRead: checked as boolean
                        }))
                      }
                    />
                    <label htmlFor="read" className="text-sm leading-relaxed cursor-pointer">
                      I confirm that I have read the NDA and understand its contents in full.
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Important Notice */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> By accepting this NDA, you agree to keep all shared information confidential. 
                  Declining this agreement will prevent you from proceeding with the investment process.
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  onClick={handleAcceptNDA} 
                  disabled={isSubmitting || !canAcceptNDA()}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Accept NDA and Continue
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="destructive" 
                  onClick={handleDeclineNDA}
                  disabled={isSubmitting}
                  className="flex-1"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 mr-2" />
                      Decline NDA
                    </>
                  )}
                </Button>
              </div>

              {/* Acceptance Requirements Summary */}
              {!canAcceptNDA() && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <strong>Requirements not met:</strong> Please complete all reading requirements and comprehension checks above before you can accept the NDA.
                  </AlertDescription>
                </Alert>
              )}

              {/* Help Text */}
              <div className="text-center text-sm text-gray-500 pt-4">
                Have questions about this agreement? Contact our support team for assistance.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Professional Footer */}
      <AppFooter />
    </div>
  )
}
