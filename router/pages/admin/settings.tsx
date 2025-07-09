import { Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 text-center">
      <Settings className="h-16 w-16 text-gray-500 mb-6" />
      <h2 className="text-2xl font-bold mb-2">Settings</h2>
      <p className="text-gray-600 mb-4">This section is coming soon. Configure platform and admin settings here.</p>
    </div>
  );
}
