import { Navigate, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/Auth/context/AuthContext";

/**
 * Protects routes that require authentication.
 * Redirects to /login if user is not authenticated.
 */
export function RequireAuth() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Ideally, render a spinner or skeleton here
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return <Outlet />;
}

/**
 * Protects routes that are ONLY for public (unauthenticated) users.
 * Redirects to /app (or /app/chats) if user IS authenticated.
 * Used for Login/Register pages.
 */
export function PublicOnly() {
  const { user, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next") || "/app/chats";

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user) {
    return <Navigate to={next} replace />;
  }

  return <Outlet />;
}
