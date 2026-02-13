import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "@/features/hooks";

/**
 * Wraps routes that require authentication.
 * If the user is not authenticated, redirects to the auth page.
 */
export default function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
