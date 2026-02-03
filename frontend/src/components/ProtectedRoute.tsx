import { Navigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from "lucide-react";
import type { JSX } from "react";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#0d1117]">
                <Loader2 className="animate-spin text-amber-500" size={40} />
            </div>
        );
    }
    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}