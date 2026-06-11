import { AlertTriangle, CheckCircle2, Info, XCircle, X } from "lucide-react";
import { ReactNode } from "react";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertBannerProps {
  type: AlertType;
  title?: string;
  message: string | ReactNode;
  onClose?: () => void;
  actions?: ReactNode;
  className?: string;
}

const alertConfig = {
  success: {
    bg: "bg-success/10",
    border: "border-l-success",
    text: "text-success",
    icon: CheckCircle2
  },
  error: {
    bg: "bg-destructive/10",
    border: "border-l-destructive",
    text: "text-destructive",
    icon: XCircle
  },
  warning: {
    bg: "bg-warning/10",
    border: "border-l-warning",
    text: "text-warning",
    icon: AlertTriangle
  },
  info: {
    bg: "bg-info/10",
    border: "border-l-info",
    text: "text-info",
    icon: Info
  }
};

export function AlertBanner({
  type,
  title,
  message,
  onClose,
  actions,
  className = ""
}: AlertBannerProps) {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`rounded-lg border-l-4 p-4 ${config.bg} ${config.border} ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <Icon className={`size-5 ${config.text} flex-shrink-0 mt-0.5`} aria-hidden="true" />

        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`font-semibold mb-1 ${config.text}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${config.text}`}>
            {message}
          </div>
          {actions && (
            <div className="mt-3">
              {actions}
            </div>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className={`flex-shrink-0 rounded-full p-1 transition-colors hover:bg-black/10 ${config.text}`}
            aria-label="Cerrar alerta"
            type="button"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
