import { FileText } from 'lucide-react';

export default function AdminNDADocumentsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 text-center">
      <FileText className="h-16 w-16 text-blue-400 mb-6" />
      <h2 className="text-2xl font-bold mb-2">NDA Documents</h2>
      <p className="text-gray-600 mb-4">This section is coming soon. Manage and review NDA documents for investors here.</p>
    </div>
  );
}
