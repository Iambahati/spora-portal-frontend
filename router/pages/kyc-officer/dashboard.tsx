import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuthCheck } from '../../hooks/use-auth-check'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { 
  FileCheck, 
  CheckCircle,
  Clock,
  Eye,
  X,
  UserCheck,
  History,
  Search,
  RefreshCw,
  FileText,
  Calendar,
  User,
  Mail,
  Shield,
  Award
} from 'lucide-react'

// Mock KYC applications data - this would come from API in real app
const mockKYCApplications = [
  {
    id: 1,
    userId: 101,
    applicantName: "John Smith",
    email: "john.smith@email.com",
    status: "pending",
    submittedAt: "2024-01-15T10:30:00Z",
    stage: "identity_verification",
    documents: {
      identity_front: { uploaded: true, verified: false, url: "/placeholder.jpg" },
      identity_back: { uploaded: true, verified: false, url: "/placeholder.jpg" },
      selfie: { uploaded: true, verified: false, url: "/placeholder-user.jpg" }
    },
    reviewNotes: ""
  },
  {
    id: 2,
    userId: 102,
    applicantName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    status: "pending",
    submittedAt: "2024-01-14T14:15:00Z",
    stage: "document_review",
    documents: {
      identity_front: { uploaded: true, verified: true, url: "/placeholder.jpg" },
      identity_back: { uploaded: true, verified: true, url: "/placeholder.jpg" },
      selfie: { uploaded: true, verified: false, url: "/placeholder-user.jpg" }
    },
    reviewNotes: ""
  },
  {
    id: 3,
    userId: 103,
    applicantName: "Michael Brown",
    email: "michael.brown@email.com",
    status: "pending",
    submittedAt: "2024-01-13T09:45:00Z",
    stage: "final_review",
    documents: {
      identity_front: { uploaded: true, verified: true, url: "/placeholder.jpg" },
      identity_back: { uploaded: true, verified: true, url: "/placeholder.jpg" },
      selfie: { uploaded: true, verified: true, url: "/placeholder-user.jpg" }
    },
    reviewNotes: "All documents verified. Ready for approval."
  }
]

// Mock approved applications by this officer
const mockApprovedApplications = [
  {
    id: 201,
    applicantName: "Emma Davis",
    email: "emma.davis@email.com",
    approvedAt: "2024-01-10T16:20:00Z"
  },
  {
    id: 202,
    applicantName: "David Wilson",
    email: "david.wilson@email.com",
    approvedAt: "2024-01-08T11:30:00Z"
  },
  {
    id: 203,
    applicantName: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    approvedAt: "2024-01-05T13:45:00Z"
  }
]

export default function KYCOfficerDashboard() {
  const { user } = useAuthCheck()
  
  const [kycApplications, setKycApplications] = useState(mockKYCApplications)
  const [approvedApplications, setApprovedApplications] = useState(mockApprovedApplications)
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewNotes, setReviewNotes] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [refreshing, setRefreshing] = useState(false)

  // Filter applications based on search and status
  const filteredApplications = kycApplications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = kycApplications.filter(app => app.status === 'pending').length
  const approvedTodayCount = approvedApplications.filter(app => {
    const today = new Date().toDateString()
    return new Date(app.approvedAt).toDateString() === today
  }).length

  const handleApproveApplication = async () => {
    if (!selectedApplication) return
    
    try {
      // In real app, this would make API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update application status
      setKycApplications(prev => prev.map(app => 
        app.id === selectedApplication.id 
          ? { ...app, status: 'approved', reviewNotes }
          : app
      ))
      
      // Add to approved applications
      const newApproved = {
        id: selectedApplication.id,
        applicantName: selectedApplication.applicantName,
        email: selectedApplication.email,
        approvedAt: new Date().toISOString()
      }
      setApprovedApplications(prev => [newApproved, ...prev])
      
      setIsReviewDialogOpen(false)
      setSelectedApplication(null)
      setReviewNotes("")
    } catch (error) {
      console.error('Failed to approve application:', error)
    }
  }

  const handleRejectApplication = async () => {
    if (!selectedApplication) return
    
    try {
      // In real app, this would make API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update application status
      setKycApplications(prev => prev.map(app => 
        app.id === selectedApplication.id 
          ? { ...app, status: 'rejected', reviewNotes }
          : app
      ))
      
      setIsReviewDialogOpen(false)
      setSelectedApplication(null)
      setReviewNotes("")
    } catch (error) {
      console.error('Failed to reject application:', error)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary'
      case 'approved': return 'default'
      case 'rejected': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-[#eb6e03]" />
                <div>
                  <h1 className="text-2xl font-bold text-[#040956]">KYC Officer Dashboard</h1>
                  <p className="text-sm text-gray-600">KYC Review & Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <ProfileDropdown user={user || undefined} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved Today</p>
                  <p className="text-3xl font-bold text-green-600">{approvedTodayCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Approved</p>
                  <p className="text-3xl font-bold text-blue-600">{approvedApplications.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#eb6e03]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Applications */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Pending KYC Applications
            </CardTitle>
            <CardDescription>
              Review and process customer verification applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredApplications.length === 0 ? (
              <div className="text-center py-8">
                <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No applications found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div
                    key={application.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{application.applicantName}</h3>
                          <Badge variant={getStatusBadgeVariant(application.status)}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {application.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(application.submittedAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedApplication(application)
                            setReviewNotes(application.reviewNotes)
                            setIsReviewDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recently Approved Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Recently Approved by You
            </CardTitle>
            <CardDescription>
              Applications you have recently approved
            </CardDescription>
          </CardHeader>
          <CardContent>
            {approvedApplications.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No approved applications yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedApplications.slice(0, 5).map((application) => (
                  <div
                    key={application.id}
                    className="border border-gray-200 rounded-lg p-4 bg-green-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{application.applicantName}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {application.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Approved {formatDate(application.approvedAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approved
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              KYC Application Review
            </DialogTitle>
            <DialogDescription>
              Review applicant details and documents for verification
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Applicant Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Applicant Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Name:</span>
                      <span className="font-medium">{selectedApplication.applicantName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="font-medium">{selectedApplication.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Submitted:</span>
                      <span className="font-medium">{formatDate(selectedApplication.submittedAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Document Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedApplication.documents).map(([docType, doc]: [string, any]) => (
                      <div key={docType} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium capitalize">
                            {docType.replace('_', ' ')}
                          </h4>
                          <Badge variant={doc.verified ? "default" : "secondary"}>
                            {doc.verified ? "Verified" : "Pending"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {doc.uploaded ? "Document uploaded" : "No document"}
                          </span>
                        </div>
                        {doc.uploaded && (
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            View Document
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Review Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Review Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="review-notes">Add your review comments</Label>
                      <Textarea
                        id="review-notes"
                        placeholder="Enter any notes about this application..."
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  onClick={handleApproveApplication}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Approve Application
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRejectApplication}
                  className="flex-1"
                  size="lg"
                >
                  <X className="h-5 w-5 mr-2" />
                  Reject Application
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsReviewDialogOpen(false)}
                  className="flex-1"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
