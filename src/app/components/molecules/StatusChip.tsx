import React from "react";
import { cn } from "../../lib/utils";
import { StatusType } from "./StatusBadge";

interface StatusChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  status: StatusType;
  isActive?: boolean;
  label?: string;
}

export function StatusChip({
  status,
  isActive = false,
  label,
  children,
  className,
  ...props
}: StatusChipProps) {
  const activeClasses = {
    success: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
    error: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
    neutral: "bg-primary text-primary-foreground border-primary", // Neutral is often the "All" button
  };

  const inactiveClasses = "bg-card text-muted-foreground border-border hover:bg-muted";

  return (
    <button
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap border shadow-sm flex items-center gap-1.5 [&>svg]:size-4 [&>svg]:text-current focus:outline-none focus:ring-2 focus:ring-primary/50",
        isActive ? activeClasses[status] : inactiveClasses,
        className
      )}
      {...props}
    >
      {label || children}
    </button>
  );
}
