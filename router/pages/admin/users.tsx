import { EnhancedUserTable } from '@/components/admin/enhanced-user-table';
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';
import { Sheet, SheetContent, SheetTitle, SheetFooter } from '@/components/ui/sheet';

export default function AdminUsersPage() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', role: 'investor' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const allowedRoles = ["investor", "admin", "onboarding-officer"] as const;

  // Store the refresh function from EnhancedUserTable
  const tableRefreshFn = useRef<() => void>(undefined);

  const handleOpen = () => {
    setShowModal(true);
    setForm({ full_name: '', email: '', role: 'investor' });
    setError(null);
    setSuccess(null);
  };
  const handleClose = () => setShowModal(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    let selectedRole = form.role;
    if (selectedRole === 'kyc-officer') selectedRole = 'onboarding-officer';
    try {
      await apiClient.createAdminUser({ ...form, role: selectedRole as typeof allowedRoles[number] });
      setSuccess('User created successfully.');
      setTimeout(() => {
        setShowModal(false);
        // Call the table refresh function if available
        tableRefreshFn.current?.();
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen h-screen">
      <div className="flex-1 min-h-0 overflow-auto container mx-auto py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
              <p className="text-muted-foreground">
                Manage user accounts, roles, and permissions across the platform.
              </p>
            </div>
            <Button onClick={handleOpen} className="ml-4">Add User</Button>
          </div>
          {/* Pass onRefresh callback to EnhancedUserTable instead of ref */}
          <EnhancedUserTable onRefresh={fn => { tableRefreshFn.current = fn; }} />
        </div>
      </div>
      {/* Remove Dialog and use only Sheet for slide-in modal */}
      {showModal && (
        <Sheet open={showModal} onOpenChange={setShowModal}>
          <SheetContent side="right" className="max-w-md w-full">
            <SheetTitle>Add New User</SheetTitle>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <Input id="full_name" name="full_name" placeholder="Full Name" value={form.full_name} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input id="email" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select id="role" name="role" value={form.role} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option value="investor">Investor</option>
                  <option value="kyc-officer">KYC Officer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">{success}</div>}
              <SheetFooter>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create User'}</Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
