import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router/index";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { queryClient } from "@/lib/query/queryClient";
import { persistor, store } from "./features/store";
import { useAppDispatch, useAppSelector } from "./features/hooks";
import { fetchMe } from "./features/user/userThunk";
import { logout, setTokens } from "./features/auth/authSlice";
import { setupAxiosInterceptors } from "./lib/axiosInstance";

function AppInner() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Wire axios interceptors to Redux
  useEffect(() => {
    setupAxiosInterceptors({
      onTokenRefreshed: (payload) => dispatch(setTokens(payload)),
      onLogout: () => dispatch(logout()),
    });
  }, [dispatch]);

  // Fetch user info on app startup (page refresh) or after login
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMe());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <PersistGate loading={null} persistor={persistor}>
      <TooltipProvider>
        <ScrollArea className="h-screen w-full">
          <RouterProvider router={router} />
        </ScrollArea>

        <Toaster
          duration={3000}
          closeButton
          position="top-center"
          theme="system"
          richColors
        />
      </TooltipProvider>
    </PersistGate>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <AppInner />
        </ErrorBoundary>
      </QueryClientProvider>
    </Provider>
  );
}
