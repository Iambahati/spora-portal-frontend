import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/lib/i18n/context'
import { useAuthCheck } from '../../hooks/use-auth-check'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { 
  Users, 
  DollarSign, 
  FileCheck, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileText,
  UserCheck,
  Award,
  Banknote,
  History,
  MessageSquare,
  BarChart3,
  Settings,
  Bell,
  Building,
  UserPlus,
  Download
} from 'lucide-react'

// Admin sidebar navigation items
const ADMIN_SIDEBAR_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: BarChart3, active: true },
  { key: 'users', label: 'User Management', icon: Users },
  { key: 'nda', label: 'NDA Documents', icon: FileText },
  { key: 'kyc', label: 'KYC Approvals', icon: UserCheck },
  { key: 'certificates', label: 'Share Certificates', icon: Award },
  { key: 'funds', label: 'Fund Management', icon: Banknote },
  { key: 'transactions', label: 'Transaction History', icon: History },
  { key: 'feedback', label: 'User Feedback', icon: MessageSquare },
  { key: 'reports', label: 'Reports', icon: Download },
  { key: 'settings', label: 'Settings', icon: Settings },
]

// Mock admin data - in real app this would come from API
const adminStats = {
  totalUsers: 1247,
  newUsersThisMonth: 89,
  fundsRaised: 2845000,
  fundsRaisedThisMonth: 245000,
  pendingKYC: 23,
  approvedKYC: 1156,
  rejectedKYC: 68,
  totalNDAs: 12,
  acceptedNDAs: 1098,
  pendingNDAs: 149,
  activeFunds: 8,
  totalTransactions: 3421,
  pendingWithdrawals: 7,
  userFeedbackCount: 156,
  averageRating: 4.7
}

const recentActivities = [
  {
    type: 'kyc_approval',
    message: 'KYC approved for John Smith',
    time: '5 minutes ago',
    status: 'success'
  },
  {
    type: 'user_registration',
    message: 'New user registered: Sarah Johnson',
    time: '12 minutes ago',
    status: 'info'
  },
  {
    type: 'nda_accepted',
    message: 'NDA accepted by Michael Chen',
    time: '25 minutes ago',
    status: 'success'
  },
  {
    type: 'kyc_pending',
    message: 'New KYC submission from Emma Davis',
    time: '1 hour ago',
    status: 'warning'
  },
  {
    type: 'fund_investment',
    message: 'Investment of $50,000 in Tech Fund',
    time: '2 hours ago',
    status: 'success'
  }
]

export default function AdminDashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const { user } = useAuthCheck()

  // Check if user is admin (in real app, this would be proper role checking)
  const isAdmin = user?.email === 'admin@spora-bank.com' || (user as any)?.role === 'admin'

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Admin Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
      fixed lg:relative lg:translate-x-0 z-30 h-screen flex flex-col`}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-xs text-gray-600">Spora One Trust</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-1 h-8 w-8"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {ADMIN_SIDEBAR_ITEMS.map((item) => (
            <AdminSidebarItem 
              key={item.key}
              item={item}
              collapsed={sidebarCollapsed}
              active={activeSection === item.key}
              onClick={() => {
                setActiveSection(item.key)
                setMobileMenuOpen(false)
              }}
            />
          ))}
        </nav>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications Badge */}
              <div className="relative">
                <Button variant="outline" size="sm" className="p-2 h-10 w-10 rounded-full border-gray-200 hover:bg-gray-50">
                  <Bell className="h-5 w-5 text-gray-600" />
                </Button>
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">5</span>
                </div>
              </div>
              <ProfileDropdown 
                user={{
                  name: (user as any)?.full_name || user?.name,
                  email: user?.email,
                  avatar: (user as any)?.avatar
                }} 
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeSection === 'dashboard' && <DashboardContent />}
          {activeSection === 'users' && <div className="text-center py-12 text-gray-500">User Management - Coming Soon</div>}
          {activeSection === 'nda' && <NDAManagementContent />}
          {activeSection === 'kyc' && <KYCApprovalsContent />}
          {activeSection === 'certificates' && <div className="text-center py-12 text-gray-500">Share Certificates - Coming Soon</div>}
          {activeSection === 'funds' && <div className="text-center py-12 text-gray-500">Fund Management - Coming Soon</div>}
          {activeSection === 'transactions' && <div className="text-center py-12 text-gray-500">Transaction History - Coming Soon</div>}
          {activeSection === 'feedback' && <div className="text-center py-12 text-gray-500">User Feedback - Coming Soon</div>}
          {activeSection === 'reports' && <div className="text-center py-12 text-gray-500">Reports - Coming Soon</div>}
          {activeSection === 'settings' && <div className="text-center py-12 text-gray-500">Settings - Coming Soon</div>}
        </main>
      </div>
    </div>
  )
}

// Admin Sidebar Item Component
function AdminSidebarItem({ 
  item, 
  collapsed, 
  active,
  onClick 
}: { 
  item: typeof ADMIN_SIDEBAR_ITEMS[0]
  collapsed: boolean
  active: boolean
  onClick: () => void
}) {
  const Icon = item.icon

  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
        active 
          ? 'bg-red-600 text-white' 
          : 'text-gray-700 hover:bg-gray-100'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
    </button>
  )
}

// Dashboard Content Component
function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{adminStats.totalUsers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <UserPlus className="h-3 w-3 mr-1" />
              +{adminStats.newUsersThisMonth} this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Funds Raised</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${(adminStats.fundsRaised / 1000000).toFixed(1)}M</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +${(adminStats.fundsRaisedThisMonth / 1000).toFixed(0)}K this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending KYC</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{adminStats.pendingKYC}</div>
            <p className="text-xs text-gray-500 mt-1">Requires review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Funds</CardTitle>
            <Building className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{adminStats.activeFunds}</div>
            <p className="text-xs text-gray-500 mt-1">Investment opportunities</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KYC Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">KYC Status Overview</CardTitle>
            <CardDescription>Current verification status breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{adminStats.approvedKYC}</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {Math.round((adminStats.approvedKYC / adminStats.totalUsers) * 100)}%
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{adminStats.pendingKYC}</span>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  {Math.round((adminStats.pendingKYC / adminStats.totalUsers) * 100)}%
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm">Rejected</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{adminStats.rejectedKYC}</span>
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  {Math.round((adminStats.rejectedKYC / adminStats.totalUsers) * 100)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
            <CardDescription>Latest admin actions and user activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    activity.status === 'success' ? 'bg-green-100' :
                    activity.status === 'warning' ? 'bg-orange-100' :
                    activity.status === 'info' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {activity.type === 'kyc_approval' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {activity.type === 'user_registration' && <UserPlus className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'nda_accepted' && <FileCheck className="h-4 w-4 text-green-600" />}
                    {activity.type === 'kyc_pending' && <Clock className="h-4 w-4 text-orange-600" />}
                    {activity.type === 'fund_investment' && <DollarSign className="h-4 w-4 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">NDA Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Accepted</span>
                <span className="font-medium">{adminStats.acceptedNDAs}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pending</span>
                <span className="font-medium text-orange-600">{adminStats.pendingNDAs}</span>
              </div>
              <Progress value={(adminStats.acceptedNDAs / (adminStats.acceptedNDAs + adminStats.pendingNDAs)) * 100} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">User Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{adminStats.averageRating}/5.0</div>
            <p className="text-xs text-gray-500 mt-1">{adminStats.userFeedbackCount} total reviews</p>
            <div className="flex items-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`text-sm ${star <= Math.floor(adminStats.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                  ★
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{adminStats.totalTransactions.toLocaleString()}</div>
            <div className="flex items-center text-xs text-orange-600 mt-1">
              <Clock className="h-3 w-3 mr-1" />
              {adminStats.pendingWithdrawals} pending withdrawals
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// NDA Management Component
function NDAManagementContent() {
  type NDADocument = {
    id: number;
    title: string;
    filename: string;
    uploadDate: string;
    status: "active" | "inactive";
    acceptedBy: number;
    pendingBy: number;
    fileSize: string;
    version: string;
    fileData?: string;
    fileType?: string;
  }

  const [ndaDocuments, setNdaDocuments] = useState<NDADocument[]>([
    {
      id: 1,
      title: "Investment Agreement NDA 2024",
      filename: "investment-nda-2024.pdf",
      uploadDate: "2024-06-15",
      status: "active",
      acceptedBy: 1098,
      pendingBy: 149,
      fileSize: "2.4 MB",
      version: "v1.2"
    },
    {
      id: 2,
      title: "Partnership Confidentiality Agreement",
      filename: "partnership-ca-2024.pdf", 
      uploadDate: "2024-05-20",
      status: "inactive",
      acceptedBy: 892,
      pendingBy: 0,
      fileSize: "1.8 MB",
      version: "v1.0"
    }
  ])

  // Load stored NDAs from localStorage on component mount
  useEffect(() => {
    const storedNDAs = localStorage.getItem('admin_ndas')
    if (storedNDAs) {
      try {
        const parsedNDAs = JSON.parse(storedNDAs)
        setNdaDocuments(prevNDAs => [...parsedNDAs, ...prevNDAs])
      } catch (error) {
        console.error('Failed to load stored NDAs:', error)
      }
    }
  }, [])

  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [uploadForm, setUploadForm] = useState<{
    title: string;
    file: File | null;
  }>({
    title: "",
    file: null
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setUploadForm({ ...uploadForm, file })
    }
  }

  const handleNDAUpload = async () => {
    if (uploadForm.title && uploadForm.file) {
      try {
        // In a real application, this would upload to your backend
        // For now, we'll simulate the upload and store file data
        const fileDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(uploadForm.file!)
        })

        const newNDA = {
          id: ndaDocuments.length + 1,
          title: uploadForm.title,
          filename: uploadForm.file.name,
          uploadDate: new Date().toISOString().split('T')[0],
          status: "active" as const,
          acceptedBy: 0,
          pendingBy: adminStats.totalUsers,
          fileSize: `${(uploadForm.file.size / 1024 / 1024).toFixed(1)} MB`,
          version: "v1.0",
          fileData: fileDataUrl, // Store file data for download
          fileType: uploadForm.file.type
        }
        
        setNdaDocuments([newNDA, ...ndaDocuments])
        
        // Store in localStorage for persistence across sessions (in real app, this would be in database)
        const storedNDAs = JSON.parse(localStorage.getItem('admin_ndas') || '[]')
        localStorage.setItem('admin_ndas', JSON.stringify([newNDA, ...storedNDAs]))
        
        setUploadForm({ title: "", file: null })
        setShowUploadDialog(false)
        
        // Show success message
        alert('NDA document uploaded successfully!')
      } catch (error) {
        console.error('Failed to upload NDA:', error)
        alert('Failed to upload NDA document. Please try again.')
      }
    }
  }

  const toggleNDAStatus = (id: number) => {
    const updatedNDAs = ndaDocuments.map(nda => 
      nda.id === id 
        ? { ...nda, status: nda.status === 'active' ? 'inactive' as const : 'active' as const }
        : nda
    )
    setNdaDocuments(updatedNDAs)
    
    // Update stored NDAs
    const storedNDAs = updatedNDAs.filter(nda => nda.fileData)
    localStorage.setItem('admin_ndas', JSON.stringify(storedNDAs))
  }

  const downloadNDA = (nda: NDADocument) => {
    if (nda.fileData) {
      // Download uploaded file
      const link = document.createElement('a')
      link.href = nda.fileData
      link.download = nda.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // For mock documents, create a sample PDF content
      const pdfContent = `Sample NDA Document: ${nda.title}\n\nThis is a placeholder for the actual NDA document content.\n\nDocument Details:\n- Version: ${nda.version}\n- Upload Date: ${nda.uploadDate}\n- Status: ${nda.status}`
      const blob = new Blob([pdfContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = nda.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">NDA Document Management</h2>
          <p className="text-gray-600 mt-1">Upload and manage non-disclosure agreements</p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)} className="bg-blue-600 hover:bg-blue-700">
          <FileText className="h-4 w-4 mr-2" />
          Upload New NDA
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total NDAs</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ndaDocuments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active NDAs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {ndaDocuments.filter(nda => nda.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accepted</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {ndaDocuments.reduce((acc, nda) => acc + nda.acceptedBy, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Acceptance</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {ndaDocuments.reduce((acc, nda) => acc + nda.pendingBy, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NDA Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>NDA Documents</CardTitle>
          <CardDescription>Manage your non-disclosure agreement documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ndaDocuments.map((nda) => (
              <div key={nda.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{nda.title}</h3>
                    <p className="text-sm text-gray-500">{nda.filename} • {nda.fileSize} • {nda.version}</p>
                    <p className="text-xs text-gray-400">Uploaded: {nda.uploadDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <div className="font-medium text-green-600">{nda.acceptedBy} accepted</div>
                    <div className="text-orange-600">{nda.pendingBy} pending</div>
                  </div>
                  
                  <Badge variant={nda.status === 'active' ? 'default' : 'secondary'}>
                    {nda.status}
                  </Badge>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => downloadNDA(nda)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleNDAStatus(nda.id)}
                    >
                      {nda.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      {showUploadDialog && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowUploadDialog(false)
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upload New NDA Document</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUploadDialog(false)}
                className="p-1 h-8 w-8 rounded-full hover:bg-gray-100"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="pb-2" htmlFor="nda-title">Document Title</Label>
                <Input
                  id="nda-title"
                  value={uploadForm.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="Enter NDA document title"
                />
              </div>
              
              <div>
                <Label className="pb-2" htmlFor="nda-file">PDF Document</Label>
                <div
                  className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-[#eb6e03] hover:bg-[#eb6e03]/5 transition-colors rounded-lg flex flex-col items-center justify-center cursor-pointer group"
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.add('border-[#eb6e03]', 'bg-[#eb6e03]/10')
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.remove('border-[#eb6e03]', 'bg-[#eb6e03]/10')
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.remove('border-[#eb6e03]', 'bg-[#eb6e03]/10')
                    const files = e.dataTransfer.files
                    if (files.length > 0 && files[0].type === "application/pdf") {
                      setUploadForm({ ...uploadForm, file: files[0] })
                    }
                  }}
                  onClick={() => document.getElementById('nda-file')?.click()}
                >
                  {uploadForm.file ? (
                    <div className="text-center">
                      <FileText className="h-8 w-8 text-[#eb6e03] mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">{uploadForm.file.name}</p>
                      <p className="text-xs text-gray-500">{(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <p className="text-xs text-[#eb6e03] mt-1">Click to replace</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText className="h-8 w-8 text-gray-400 group-hover:text-[#eb6e03] mx-auto mb-2 transition-colors" />
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        Drag and drop PDF file here
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        or <span className="text-[#eb6e03] font-medium">click to browse</span>
                      </p>
                    </div>
                  )}
                </div>
                <Input
                  id="nda-file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-2">Only PDF files are accepted (max 10MB)</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button onClick={handleNDAUpload} disabled={!uploadForm.title || !uploadForm.file}>
                Upload NDA
              </Button>
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

// KYC Approvals Component
function KYCApprovalsContent() {
  type KYCApplication = {
    id: number;
    userId: number;
    userName: string;
    email: string;
    submittedDate: string;
    status: string;
    documents: string[];
    reviewNotes: string;
    stage: string;
  }

  const [kycApplications, setKycApplications] = useState<KYCApplication[]>([
    {
      id: 1,
      userId: 1001,
      userName: "John Smith",
      email: "john.smith@email.com",
      submittedDate: "2024-06-20",
      status: "pending",
      documents: ["passport.pdf", "address_proof.pdf", "selfie.jpg"],
      reviewNotes: "",
      stage: "document_review"
    },
    {
      id: 2,
      userId: 1002,
      userName: "Sarah Johnson", 
      email: "sarah.j@email.com",
      submittedDate: "2024-06-19",
      status: "pending",
      documents: ["drivers_license.pdf", "utility_bill.pdf", "selfie.jpg"],
      reviewNotes: "",
      stage: "identity_verification"
    },
    {
      id: 3,
      userId: 1003,
      userName: "Michael Chen",
      email: "m.chen@email.com",
      submittedDate: "2024-06-18",
      status: "approved",
      documents: ["passport.pdf", "bank_statement.pdf", "selfie.jpg"],
      reviewNotes: "All documents verified successfully",
      stage: "completed"
    }
  ])

  const [selectedApplication, setSelectedApplication] = useState<KYCApplication | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")

  const handleApproveKYC = (applicationId: number) => {
    setKycApplications(kycApplications.map(app => 
      app.id === applicationId 
        ? { ...app, status: 'approved', reviewNotes, stage: 'completed' }
        : app
    ))
    setSelectedApplication(null)
    setReviewNotes("")
  }

  const handleRejectKYC = (applicationId: number) => {
    setKycApplications(kycApplications.map(app => 
      app.id === applicationId 
        ? { ...app, status: 'rejected', reviewNotes, stage: 'rejected' }
        : app
    ))
    setSelectedApplication(null)
    setReviewNotes("")
  }

  const pendingApplications = kycApplications.filter(app => app.status === 'pending')
  const approvedApplications = kycApplications.filter(app => app.status === 'approved')
  const rejectedApplications = kycApplications.filter(app => app.status === 'rejected')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">KYC Approvals</h2>
        <p className="text-gray-600 mt-1">Review and approve customer verification applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingApplications.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedApplications.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedApplications.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileCheck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kycApplications.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Pending KYC Applications</CardTitle>
          <CardDescription>Applications requiring review and approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingApplications.map((application) => (
              <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{application.userName}</h3>
                    <p className="text-sm text-gray-500">{application.email}</p>
                    <p className="text-xs text-gray-400">Submitted: {application.submittedDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <div className="font-medium">Stage: {application.stage.replace('_', ' ')}</div>
                    <div className="text-gray-500">{application.documents.length} documents</div>
                  </div>
                  
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    Pending
                  </Badge>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedApplication(application)}
                  >
                    Review
                  </Button>
                </div>
              </div>
            ))}
            
            {pendingApplications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No pending KYC applications
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      {selectedApplication && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedApplication(null)
              setReviewNotes("")
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Review KYC Application</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedApplication(null)
                  setReviewNotes("")
                }}
                className="p-1 h-8 w-8 rounded-full hover:bg-gray-100"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>User Name</Label>
                  <p className="font-medium">{selectedApplication.userName}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{selectedApplication.email}</p>
                </div>
                <div>
                  <Label>Submission Date</Label>
                  <p className="font-medium">{selectedApplication.submittedDate}</p>
                </div>
                <div>
                  <Label>Current Stage</Label>
                  <p className="font-medium">{selectedApplication.stage.replace('_', ' ')}</p>
                </div>
              </div>
              
              <div>
                <Label>Submitted Documents</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {selectedApplication.documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{doc}</span>
                      <Button variant="outline" size="sm" className="ml-auto">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="review-notes">Review Notes</Label>
                <textarea
                  id="review-notes"
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                  rows={3}
                  value={reviewNotes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReviewNotes(e.target.value)}
                  placeholder="Add notes about the review decision..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button 
                onClick={() => handleApproveKYC(selectedApplication.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleRejectKYC(selectedApplication.id)}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button variant="outline" onClick={() => setSelectedApplication(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
