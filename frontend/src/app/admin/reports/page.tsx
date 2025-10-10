import { Clock } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Reports Page</h1>
      <div className="mt-4 border p-4 rounded-lg text-center">
        <Clock className="h-12 w-12 mx-auto text-blue-600" />
        <p>The reports feature is coming soon.</p>
      </div>
    </div>
  );
}
