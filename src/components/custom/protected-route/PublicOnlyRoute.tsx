import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "@/features/hooks";

/**
 * Wraps routes that should only be accessible when NOT logged in
 * (e.g. landing page, auth page).
 * If the user is already authenticated, redirects to /user-dashboard.
 */
export default function PublicOnlyRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/user-dashboard" replace />;
  }

  return <Outlet />;
}
