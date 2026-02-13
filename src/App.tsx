import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { RouterProvider } from "react-router";
import { router } from "./router/index";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { persistor, store } from "./features/store";

function AppInner() {
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
