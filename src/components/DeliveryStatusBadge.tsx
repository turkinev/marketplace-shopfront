import { cn } from "@/lib/utils";

export type DeliveryStatus = 
  | "collecting" 
  | "stopping_soon" 
  | "fixing" 
  | "ordered" 
  | "shipping" 
  | "arrived";

interface StatusConfig {
  label: string;
  color: string;
  dotColor: string;
}

const statusConfigs: Record<DeliveryStatus, StatusConfig> = {
  collecting: {
    label: "Сбор",
    color: "text-emerald-600",
    dotColor: "bg-emerald-500",
  },
  stopping_soon: {
    label: "Скоро стоп",
    color: "text-amber-600",
    dotColor: "bg-amber-500",
  },
  fixing: {
    label: "Фиксирую",
    color: "text-blue-600",
    dotColor: "bg-blue-500",
  },
  ordered: {
    label: "Заказано",
    color: "text-violet-600",
    dotColor: "bg-violet-500",
  },
  shipping: {
    label: "В пути",
    color: "text-cyan-600",
    dotColor: "bg-cyan-500",
  },
  arrived: {
    label: "Прибыло",
    color: "text-green-600",
    dotColor: "bg-green-500",
  },
};

interface DeliveryStatusBadgeProps {
  status: DeliveryStatus;
  dateInfo?: string; // e.g., "до 15 февраля" or "с 20 февраля"
  className?: string;
}

export const DeliveryStatusBadge = ({ 
  status, 
  dateInfo, 
  className 
}: DeliveryStatusBadgeProps) => {
  const config = statusConfigs[status];

  return (
    <div 
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary/80 text-xs font-medium",
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", config.dotColor)} />
      <span className={config.color}>{config.label}</span>
      {dateInfo && (
        <span className="text-muted-foreground">{dateInfo}</span>
      )}
    </div>
  );
};
