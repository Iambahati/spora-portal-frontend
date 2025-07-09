import { History } from 'lucide-react';

export default function AdminTransactionsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 text-center">
      <History className="h-16 w-16 text-blue-500 mb-6" />
      <h2 className="text-2xl font-bold mb-2">Transaction History</h2>
      <p className="text-gray-600 mb-4">This section is coming soon. View and audit all platform transactions here.</p>
    </div>
  );
}
