import { LucideIcon } from "lucide-react";

interface MiniKPIProps {
  icon: LucideIcon;
  label: string;
  value: string;
  variant?: "default" | "warning";
}

export function MiniKPI({ icon: Icon, label, value, variant = "default" }: MiniKPIProps) {
  return (
    <div className="flex items-center gap-3 rounded-card bg-card p-4 shadow-sm">
      <div className={`rounded-lg p-2 ${variant === "warning" ? "bg-warning/10" : "bg-primary/10"}`}>
        <Icon className={`size-5 ${variant === "warning" ? "text-warning" : "text-primary"}`} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold tabular-nums">{value}</p>
      </div>
    </div>
  );
}
