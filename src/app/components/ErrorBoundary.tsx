import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-4 text-center animate-fade-in" style={{ width: "100%" }}>
          <div className="w-full max-w-md bg-card rounded-2xl p-6 shadow-xl border border-border transition-all">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-6">
              <AlertTriangle className="h-8 w-8 animate-bounce" />
            </div>
            
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">
              Algo salió mal
            </h1>
            
            <p className="text-sm text-muted-foreground mb-6">
              Ha ocurrido un error inesperado al renderizar esta sección. Puedes intentar reintentar o recargar la aplicación.
            </p>

            {this.state.error && (
              <div className="mb-6 text-left">
                <details className="cursor-pointer bg-muted p-3 rounded-lg text-xs font-mono text-destructive overflow-auto max-h-40 border border-destructive/10">
                  <summary className="font-semibold select-none text-muted-foreground mb-1 outline-none">
                    Ver detalles del error
                  </summary>
                  <p className="mt-1 font-bold">{this.state.error.toString()}</p>
                  {this.state.error.stack && (
                    <pre className="mt-1 opacity-80 whitespace-pre-wrap text-[10px] leading-relaxed">{this.state.error.stack}</pre>
                  )}
                </details>
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-stretch">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2.5 rounded-xl transition-all active:scale-[0.98] cursor-pointer shadow-sm"
              >
                <RefreshCw className="h-4 w-4" />
                Reintentar
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-accent text-secondary-foreground font-semibold px-4 py-2.5 rounded-xl border border-input transition-all active:scale-[0.98] cursor-pointer"
              >
                Recargar página
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
