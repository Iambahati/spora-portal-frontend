import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import EmptyState from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserProfile, AllUsersResponse } from '@/types/api';

export default function AdminKYCPage() {
  return <KYCApprovalsSection />;
}

function KYCApprovalsSection() {
  const [users, setUsers] = useState<UserProfile[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiClient.getAllUsers(1, 50)
      .then((res: AllUsersResponse) => {
        // Filter users with pending KYC
        setUsers(res.data.data.filter(u => u.kyc_status === 'pending'));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load KYC approvals');
        setLoading(false);
      });
  }, []);

  if (loading) return <KYCTableSkeleton />;
  if (error) return (
    <EmptyState
      title="Unable to load KYC approvals"
      description="Something went wrong while loading KYC data. Please try again."
      action={<button className="mt-4 bg-red-600 text-white px-4 py-2 rounded" onClick={() => window.location.reload()}>Try Again</button>}
    />
  );
  if (!users || users.length === 0) return (
    <EmptyState
      title="No Pending KYC"
      description="There are currently no users with pending KYC."
    />
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100 text-xs text-gray-600 uppercase">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">KYC Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b last:border-0">
              <td className="px-4 py-2">{user.full_name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${user.kyc_status === 'pending' ? 'bg-orange-100 text-orange-700' : user.kyc_status === 'approved' ? 'bg-green-100 text-green-700' : user.kyc_status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{user.kyc_status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KYCTableSkeleton() {
  // Show a skeleton table with 5 rows
  return (
    <div className="overflow-x-auto animate-pulse">
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100 text-xs text-gray-600 uppercase">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">KYC Status</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="border-b last:border-0">
              <td className="px-4 py-2"><Skeleton className="h-4 w-32" /></td>
              <td className="px-4 py-2"><Skeleton className="h-4 w-40" /></td>
              <td className="px-4 py-2"><Skeleton className="h-4 w-20" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
