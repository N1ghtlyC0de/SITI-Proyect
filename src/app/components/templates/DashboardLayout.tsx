import type { ReactNode } from "react";

interface DashboardLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export function DashboardLayout({
  title,
  description,
  children,
  className = "",
}: DashboardLayoutProps) {
  return (
    <main className={`page-shell ${className}`}>
      <header className="page-header">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>
      <div className="page-grid">{children}</div>
    </main>
  );
}
