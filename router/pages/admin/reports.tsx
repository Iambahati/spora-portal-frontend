import { Download } from 'lucide-react';

export default function AdminReportsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 text-center">
      <Download className="h-16 w-16 text-cyan-500 mb-6" />
      <h2 className="text-2xl font-bold mb-2">Reports</h2>
      <p className="text-gray-600 mb-4">This section is coming soon. Generate and download platform reports here.</p>
    </div>
  );
}
