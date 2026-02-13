import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { RouterProvider } from "react-router";
import { router } from "./router/index";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
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

  // Fetch user info on app startup (page refresh)
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMe());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <AppInner />
    </Provider>
  );
}
