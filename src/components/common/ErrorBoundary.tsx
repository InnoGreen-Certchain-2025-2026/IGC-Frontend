import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Safe to log generic error metadata. Avoid logging sensitive form values.
    console.error("Unhandled UI error", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-2xl font-semibold">Đã xảy ra lỗi</h1>
          <p className="text-muted-foreground text-sm">
            Ứng dụng gặp lỗi ngoài ý muốn. Vui lòng tải lại trang.
          </p>
          <Button type="button" onClick={() => window.location.reload()}>
            Tải lại
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
