import { BrowserRouter } from "react-router";
import { AppRoutes } from "./router/index";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <ScrollArea className="h-screen w-full">
          <AppRoutes />
        </ScrollArea>

        <Toaster
          duration={3000}
          closeButton
          position="top-center"
          theme="system"
          richColors
        />
      </TooltipProvider>
    </BrowserRouter>
  );
}

export default App;
