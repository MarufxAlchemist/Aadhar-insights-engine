import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  tooltip?: string;
  className?: string;
}

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  tooltip,
  className,
}: KPICardProps) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  const trendColor =
    trend === "up"
      ? "text-success"
      : trend === "down"
      ? "text-destructive"
      : "text-muted-foreground";

  return (
    <div className={cn("kpi-card p-5", className)}>
      <div className="flex items-start justify-between mb-3">
        <span className="metric-label">{title}</span>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-sm">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="space-y-1">
        <p className="metric-value text-3xl text-foreground">{value}</p>
        {(trend || subtitle) && (
          <div className="flex items-center gap-2">
            {trend && (
              <span className={cn("flex items-center gap-1 text-sm", trendColor)}>
                <TrendIcon className="w-3.5 h-3.5" />
                {trendValue}
              </span>
            )}
            {subtitle && (
              <span className="text-sm text-muted-foreground">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
