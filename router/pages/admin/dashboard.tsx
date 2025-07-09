import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, TrendingUp, Clock, UserPlus } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import type { AdminStatsResponse } from '@/types/api';
import EmptyState from '@/components/ui/empty-state';
import { useState as useTabState } from 'react';

export default function AdminDashboardPage() {
  return <DashboardContent />;
}

function DashboardSkeleton() {
  // Improved skeleton: sticky header, more realistic card/table shapes, ARIA roles
  return (
    <div className="space-y-8 overflow-y-auto max-h-[calc(100vh-48px)] pr-2" aria-busy="true" aria-label="Loading dashboard">
      {/* Sticky Welcome/Brand Section Skeleton */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-red-100 to-orange-50 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 min-h-[80px] shadow-sm">
        <div>
          <div className="h-6 w-64 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-40 bg-gray-100 rounded" />
        </div>
        <div className="h-8 w-24 bg-red-200 rounded-full" />
      </div>
      {/* Stats Overview Skeleton */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" aria-label="Stats overview loading">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded shadow p-4 space-y-3 flex flex-col justify-between min-h-[110px]">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-8 w-20 bg-gray-100 rounded" />
            <div className="h-3 w-16 bg-green-100 rounded" />
          </div>
        ))}
      </section>
      {/* KYC Status Breakdown Skeleton */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-label="KYC status loading">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded shadow p-4 space-y-3 flex flex-col justify-between min-h-[90px]">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-8 w-20 bg-gray-100 rounded" />
            <div className="h-3 w-16 bg-gray-100 rounded" />
          </div>
        ))}
      </section>
      {/* NDA Stats Skeleton */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-label="NDA stats loading">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded shadow p-4 space-y-3 flex flex-col justify-between min-h-[90px]">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-8 w-20 bg-gray-100 rounded" />
            <div className="h-3 w-16 bg-gray-100 rounded" />
          </div>
        ))}
      </section>
      {/* Recent Activities Skeleton */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6" aria-label="Recent activities loading">
        <div className="bg-white rounded shadow p-4">
          <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <div className="h-3 w-3 bg-gray-300 rounded-full" />
              <div className="h-4 w-48 bg-gray-100 rounded" />
              <div className="h-3 w-12 bg-gray-50 rounded ml-auto" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function DashboardContent() {
  const [adminStats, setAdminStats] = useState<AdminStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Tab state for KYC and NDA sections
  const [kycTab, setKYCTab] = useTabState<'pending' | 'approved' | 'rejected'>('pending');
  const [ndaTab, setNDATab] = useTabState<'total' | 'accepted' | 'pending'>('total');

  useEffect(() => {
    setLoading(true);
    apiClient.getAdminStats()
      .then((stats: AdminStatsResponse) => {
        setAdminStats(stats);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load dashboard stats');
        setLoading(false);
      });
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (error) return (
    <EmptyState
      title="Unable to load dashboard"
      description="Something went wrong while loading admin stats. Please try again."
      action={<button className="mt-4 bg-red-600 text-white px-4 py-2 rounded" onClick={() => window.location.reload()}>Try Again</button>}
    />
  );
  if (!adminStats || Object.keys(adminStats).length === 0) return (
    <EmptyState
      title="No Dashboard Data"
      description="There is currently no data to display on the dashboard."
    />
  );

  return (
    <div className="space-y-8 overflow-y-auto max-h-[calc(100vh-48px)] pr-2" role="main" aria-label="Admin dashboard">
      {/* Sticky Welcome/Brand Section */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-red-100 to-orange-50 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome to the Spora One Admin Dashboard</h2>
          <p className="text-gray-600">Monitor platform activity, manage users, and review compliance at a glance.</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-600 text-white text-sm font-semibold">Admin</span>
        </div>
      </div>
      {/* Stats Overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" aria-label="Stats overview">
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
      </section>
      {/* KYC Stats Tabs */}
      <section className="bg-white rounded shadow p-6" aria-label="KYC status">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">KYC Status Overview</h3>
        <div className="flex gap-2 mb-4" aria-labelledby="kyc-stats-label">
          <button onClick={() => setKYCTab('pending')} className={`px-4 py-2 rounded-t-md font-medium border-b-2 transition-colors ${kycTab === 'pending' ? 'border-orange-500 text-orange-700 bg-orange-50' : 'border-transparent text-gray-500 bg-gray-50 hover:bg-orange-50'}`}>Pending</button>
          <button onClick={() => setKYCTab('approved')} className={`px-4 py-2 rounded-t-md font-medium border-b-2 transition-colors ${kycTab === 'approved' ? 'border-green-500 text-green-700 bg-green-50' : 'border-transparent text-gray-500 bg-gray-50 hover:bg-green-50'}`}>Approved</button>
          <button onClick={() => setKYCTab('rejected')} className={`px-4 py-2 rounded-t-md font-medium border-b-2 transition-colors ${kycTab === 'rejected' ? 'border-red-500 text-red-700 bg-red-50' : 'border-transparent text-gray-500 bg-gray-50 hover:bg-red-50'}`}>Rejected</button>
        </div>
        <div className="transition-all duration-200">
          {kycTab === 'pending' && (
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-orange-600">{adminStats.pendingKYC}</div>
              <div className="text-xs text-gray-500 mt-1">KYC applications requiring review</div>
            </div>
          )}
          {kycTab === 'approved' && (
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-green-600">{adminStats.approvedKYC}</div>
              <div className="text-xs text-gray-500 mt-1">Users fully verified</div>
            </div>
          )}
          {kycTab === 'rejected' && (
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-red-600">{adminStats.rejectedKYC}</div>
              <div className="text-xs text-gray-500 mt-1">Applications rejected</div>
            </div>
          )}
        </div>
      </section>
      {/* NDA Stats Tabs */}
      <section className="bg-white rounded shadow p-6" aria-label="NDA stats">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">NDA Documents Overview</h3>
        <div className="flex gap-2 mb-4" aria-labelledby="nda-stats-label">
          <button onClick={() => setNDATab('total')} className={`px-4 py-2 rounded-t-md font-medium border-b-2 transition-colors ${ndaTab === 'total' ? 'border-gray-500 text-gray-700 bg-gray-50' : 'border-transparent text-gray-500 bg-gray-50 hover:bg-gray-100'}`}>Total</button>
          <button onClick={() => setNDATab('accepted')} className={`px-4 py-2 rounded-t-md font-medium border-b-2 transition-colors ${ndaTab === 'accepted' ? 'border-green-500 text-green-700 bg-green-50' : 'border-transparent text-gray-500 bg-gray-50 hover:bg-green-50'}`}>Accepted</button>
          <button onClick={() => setNDATab('pending')} className={`px-4 py-2 rounded-t-md font-medium border-b-2 transition-colors ${ndaTab === 'pending' ? 'border-orange-500 text-orange-700 bg-orange-50' : 'border-transparent text-gray-500 bg-gray-50 hover:bg-orange-50'}`}>Pending</button>
        </div>
        <div className="transition-all duration-200">
          {ndaTab === 'total' && (
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-gray-900">{adminStats.totalNDAs}</div>
              <div className="text-xs text-gray-500 mt-1">All NDA documents</div>
            </div>
          )}
          {ndaTab === 'accepted' && (
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-green-600">{adminStats.acceptedNDAs}</div>
              <div className="text-xs text-gray-500 mt-1">NDAs accepted by users</div>
            </div>
          )}
          {ndaTab === 'pending' && (
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-orange-600">{adminStats.pendingNDAs}</div>
              <div className="text-xs text-gray-500 mt-1">NDAs awaiting acceptance</div>
            </div>
          )}
        </div>
      </section>
      {/* Recent Activities */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6" aria-label="Recent activities">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {Array.isArray(adminStats.recentActivities) && adminStats.recentActivities.length > 0 ? (
              <ul className="space-y-2">
                {adminStats.recentActivities.map((activity, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <span className={
                      activity.status === 'success' ? 'text-green-600' :
                      activity.status === 'info' ? 'text-blue-600' :
                      activity.status === 'warning' ? 'text-orange-600' : 'text-gray-600'
                    }>
                      ●
                    </span>
                    <span>{activity.message}</span>
                    <span className="ml-auto text-xs text-gray-400">{activity.time}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-sm">No recent activities.</div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
