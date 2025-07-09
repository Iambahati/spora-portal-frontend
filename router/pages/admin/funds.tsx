import { Banknote } from 'lucide-react';

export default function AdminFundsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 text-center">
      <Banknote className="h-16 w-16 text-green-500 mb-6" />
      <h2 className="text-2xl font-bold mb-2">Fund Management</h2>
      <p className="text-gray-600 mb-4">This section is coming soon. Manage investment funds and allocations here.</p>
    </div>
  );
}
