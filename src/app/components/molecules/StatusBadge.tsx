import React from "react";
import { cn } from "../../lib/utils";

export type StatusType = "success" | "warning" | "error" | "info" | "neutral";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType;
  label?: string;
}

export function StatusBadge({
  status,
  label,
  children,
  className,
  ...props
}: StatusBadgeProps) {
  const statusClasses = {
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    neutral: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap shadow-sm [&>svg]:size-3.5 [&>svg]:text-current",
        statusClasses[status],
        className
      )}
      {...props}
    >
      {label || children}
    </span>
  );
}
