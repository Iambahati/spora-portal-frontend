import { useAuthState } from '@/lib/auth-context';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";

export default function AdminProfilePage() {
	const { user, loading } = useAuthState();

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-gray-400" />
			</div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen w-full">
			<main className="flex-1 w-full overflow-y-auto">
				<div className="max-w-xl mx-auto space-y-8 p-6">
					<Tabs defaultValue="profile">
						<TabsList>
							<TabsTrigger value="profile">Profile</TabsTrigger>
							<TabsTrigger value="sessions">Sessions</TabsTrigger>
						</TabsList>
						<TabsContent value="profile">
							<ProfileInfoTab user={user} />
							<div className="mt-8">
								<PasswordChangeTab />
							</div>
						</TabsContent>
						<TabsContent value="sessions">
							<DeviceSessionsTab />
						</TabsContent>
					</Tabs>
				</div>
			</main>
		</div>
	);
}

function ProfileInfoTab({ user }: { user: any }) {
	const [editing, setEditing] = useState(false);
	const [form, setForm] = useState({
		full_name: user?.full_name || '',
		email: user?.email || '',
	});

	return (
		<form className="space-y-6">
			<div className="bg-white rounded-xl shadow p-6 space-y-4 border">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
					<input
						className={`w-full border rounded px-3 py-2 transition-colors ${!editing ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
						value={form.full_name}
						disabled={!editing}
						onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
					<input
						className={`w-full border rounded px-3 py-2 transition-colors ${!editing ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
						value={form.email}
						disabled={!editing}
						onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
					/>
				</div>
				<div className="flex gap-3 pt-2">
					{!editing ? (
						<Button
							type="button"
							className="h-10 px-6 font-semibold rounded-xl"
							style={{ backgroundColor: '#eb6e03', borderColor: '#eb6e03' }}
							onClick={() => setEditing(true)}
						>
							Edit
						</Button>
					) : (
						<>
							<Button
								type="submit"
								className="h-10 px-6 font-semibold rounded-xl"
								style={{ backgroundColor: '#eb6e03', borderColor: '#eb6e03' }}
							>
								Update
							</Button>
							<Button
								type="button"
								variant="outline"
								className="h-10 px-6 rounded-xl"
								onClick={() => {
									setEditing(false);
									setForm({ full_name: user?.full_name || '', email: user?.email || '' });
								}}
							>
								Cancel
							</Button>
						</>
					)}
				</div>
			</div>
		</form>
	);
}

function PasswordChangeTab() {
	return (
		<div className="bg-white rounded-xl shadow p-6 space-y-4 border">
			<h2 className="text-lg font-semibold text-gray-900">Password</h2>
			<p className="text-sm text-gray-500">Change your password here. After saving, you'll be logged out.</p>
			<form className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="current-password">Current Password</label>
					<input
						id="current-password"
						type="password"
						className="w-full border rounded px-3 py-2"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="new-password">New Password</label>
					<input
						id="new-password"
						type="password"
						className="w-full border rounded px-3 py-2"
					/>
				</div>
				<Button
					type="submit"
					className="h-10 px-6 font-semibold rounded-xl"
					style={{ backgroundColor: '#eb6e03', borderColor: '#eb6e03' }}
				>
					Save Password
				</Button>
			</form>
		</div>
	);
}

function DeviceSessionsTab() {
	return (
		<div className="bg-white rounded-xl shadow p-6 border">
			<h2 className="text-lg font-semibold text-gray-900">Device Sessions</h2>
			<p className="text-sm text-gray-500">Manage your device sessions and view QR codes for authentication.</p>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<span className="text-sm text-gray-700">Device 1</span>
					<Button
						type="button"
						variant="outline"
						className="h-8 px-4 rounded-xl"
					>
						Remove
					</Button>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-sm text-gray-700">Device 2</span>
					<Button
						type="button"
						variant="outline"
						className="h-8 px-4 rounded-xl"
					>
						Remove
					</Button>
				</div>
				<div className="text-center">
					<img src="/path/to/qr-code.png" alt="QR Code" className="inline-block" />
					<p className="text-sm text-gray-500 mt-2">Scan this QR code to add a new device.</p>
				</div>
			</div>
		</div>
	);
}
