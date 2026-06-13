import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: "default" | "success" | "warning" | "destructive";
  className?: string;
  onClick?: () => void;
}

const variantStyles = {
  default: {
    bg: "bg-card",
    text: "text-foreground",
    icon: "text-primary"
  },
  success: {
    bg: "bg-success text-primary-foreground",
    text: "text-primary-foreground",
    icon: "text-primary-foreground"
  },
  warning: {
    bg: "bg-warning text-warning-foreground",
    text: "text-warning-foreground",
    icon: "text-warning-foreground"
  },
  destructive: {
    bg: "bg-destructive text-destructive-foreground",
    text: "text-destructive-foreground",
    icon: "text-destructive-foreground"
  }
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  className = "",
  onClick
}: KPICardProps) {
  const styles = variantStyles[variant];

  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={`rounded-card p-4 shadow-sm border border-border transition-all ${styles.bg} ${
        onClick ? "cursor-pointer hover:shadow-md active:scale-98" : ""
      } ${className}`}
      {...(onClick && {
        type: "button",
        "aria-label": `${title}: ${value}`
      })}
    >
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className={`size-4 ${styles.icon}`} aria-hidden="true" />}
        <span className={`text-base font-semibold ${variant !== "default" ? "opacity-90" : "text-muted-foreground"}`}>
          {title}
        </span>
      </div>
      <p className={`text-2xl font-bold ${styles.text} tabular-nums`}>{value}</p>
      {subtitle && (
        <p className={`text-sm mt-1 ${variant !== "default" ? "opacity-75" : "text-muted-foreground"}`}>
          {subtitle}
        </p>
      )}
    </Component>
  );
}
