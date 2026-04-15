import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "@/features/hooks";

/**
 * Wraps routes that require authentication.
 * If the user is not authenticated, redirects to the auth page.
 */
export default function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hasToken = !!localStorage.getItem("access_token");

  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
