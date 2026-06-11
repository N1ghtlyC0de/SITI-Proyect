import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

type StatusType = "success" | "error" | "warning" | "info" | "cancelled" | "ok";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: "sm" | "md";
  showIcon?: boolean;
}

const statusConfig = {
  success: {
    bg: "bg-success/10",
    text: "text-success",
    border: "border-success/20",
    icon: CheckCircle2,
    label: "Éxito"
  },
  ok: {
    bg: "bg-success/10",
    text: "text-success",
    border: "border-success/20",
    icon: CheckCircle2,
    label: "OK"
  },
  error: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    border: "border-destructive/20",
    icon: XCircle,
    label: "Error"
  },
  cancelled: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
    icon: XCircle,
    label: "Anulada"
  },
  warning: {
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning/20",
    icon: AlertTriangle,
    label: "Advertencia"
  },
  info: {
    bg: "bg-info/10",
    text: "text-info",
    border: "border-info/20",
    icon: Info,
    label: "Info"
  }
};

export function StatusBadge({ status, label, size = "md", showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const displayLabel = label || config.label;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm"
  };

  const iconSize = size === "sm" ? "size-3" : "size-4";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
      role="status"
      aria-label={displayLabel}
    >
      {showIcon && <Icon className={iconSize} aria-hidden="true" />}
      <span>{displayLabel}</span>
    </span>
  );
}
