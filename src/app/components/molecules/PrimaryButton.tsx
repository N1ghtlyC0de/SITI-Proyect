import React from "react";
import { cn } from "../../lib/utils";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "header";
  icon?: React.ReactNode;
}

export function PrimaryButton({
  children,
  className,
  variant = "default",
  icon,
  ...props
}: PrimaryButtonProps) {
  const variantClasses = {
    default: "bg-green-700 hover:bg-green-800 text-white shadow-sm focus:ring-green-500",
    header: "bg-white/10 text-white/90 hover:bg-white/20 hover:text-white focus:ring-white/50",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all focus:outline-none focus:ring-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95 [&>svg]:size-4 [&>svg]:text-current shrink-0",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
