import { Link } from "react-router-dom";
import { Feather } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-bg text-center px-6">
      <Feather className="h-10 w-10 text-primary mb-4" />
      <h1 className="text-3xl font-bold tracking-tight mb-2">Page not found</h1>
      <p className="text-text-muted mb-6">The page you're looking for doesn't exist or was moved.</p>
      <Link to="/dashboard" className="btn-gradient">
        Back to Dashboard
      </Link>
    </div>
  );
}
