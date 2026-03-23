import * as React from "react"
import { cn } from "@/lib/utils"

export type StatusType = "buy" | "sell" | "hold" | "active" | "paused" | "danger" | "warning" | "neutral";

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusType;
  label?: string;
  pulse?: boolean;
}

const statusConfig: Record<StatusType, { bg: string, text: string, border: string, dot: string }> = {
  buy: { bg: "bg-brand-green/10", text: "text-brand-green", border: "border-brand-green/20", dot: "bg-brand-green" },
  sell: { bg: "bg-brand-red/10", text: "text-brand-red", border: "border-brand-red/20", dot: "bg-brand-red" },
  hold: { bg: "bg-brand-amber/10", text: "text-brand-amber", border: "border-brand-amber/20", dot: "bg-brand-amber" },
  active: { bg: "bg-brand-green/10", text: "text-brand-green", border: "border-brand-green/20", dot: "bg-brand-green" },
  paused: { bg: "bg-brand-amber/10", text: "text-brand-amber", border: "border-brand-amber/20", dot: "bg-brand-amber" },
  danger: { bg: "bg-brand-red/10", text: "text-brand-red", border: "border-brand-red/20", dot: "bg-brand-red" },
  warning: { bg: "bg-brand-amber/10", text: "text-brand-amber", border: "border-brand-amber/20", dot: "bg-brand-amber" },
  neutral: { bg: "bg-white/5", text: "text-muted-foreground", border: "border-brand-border", dot: "bg-muted-foreground" },
};

export const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, status, label, pulse = false, ...props }, ref) => {
    const config = statusConfig[status] || statusConfig.neutral;
    const displayLabel = label || status.toUpperCase();

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border",
          config.bg,
          config.text,
          config.border,
          className
        )}
        {...props}
      >
        <div className={cn("w-1.5 h-1.5 rounded-full", config.dot, pulse && "animate-pulse")} />
        {displayLabel}
      </div>
    );
  }
);
StatusBadge.displayName = "StatusBadge";
