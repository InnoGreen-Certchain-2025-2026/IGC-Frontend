import { RouterProvider } from "react-router";
import { router } from "./router/index";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
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
  );
}

export default App;
