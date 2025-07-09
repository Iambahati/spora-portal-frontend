import { MessageSquare } from 'lucide-react';

export default function AdminFeedbackPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 text-center">
      <MessageSquare className="h-16 w-16 text-purple-500 mb-6" />
      <h2 className="text-2xl font-bold mb-2">User Feedback</h2>
      <p className="text-gray-600 mb-4">This section is coming soon. Review and respond to user feedback here.</p>
    </div>
  );
}
