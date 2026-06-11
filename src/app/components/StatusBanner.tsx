import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Badge } from "./Badge";

export type ConnectionStatus = "online" | "offline" | "syncing";

interface StatusBannerProps {
  status: ConnectionStatus;
  pendingCount?: number;
}

export function StatusBanner({ status, pendingCount = 0 }: StatusBannerProps) {
  const statusConfig = {
    online: {
      variant: "success" as const,
      icon: Wifi,
      text: "En línea",
    },
    offline: {
      variant: "warning" as const,
      icon: WifiOff,
      text: "Sin conexión",
    },
    syncing: {
      variant: "info" as const,
      icon: RefreshCw,
      text: `Sincronizando ${pendingCount} ventas`,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="w-full justify-center py-2">
      <Icon className={`size-4 ${status === "syncing" ? "animate-spin" : ""}`} />
      <span>{config.text}</span>
    </Badge>
  );
}
