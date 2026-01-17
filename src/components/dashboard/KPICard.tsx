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
  interpretation?: string;
  className?: string;
}

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  tooltip,
  interpretation,
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
    <div className={cn("kpi-card p-6 animate-fade-in", className)}>
      <div className="flex items-start justify-between mb-4">
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

      <div className="space-y-2">
        <p className="metric-value text-4xl text-foreground">{value}</p>
        {(trend || subtitle) && (
          <div className="flex items-center gap-2">
            {trend && (
              <span className={cn("flex items-center gap-1 text-sm font-medium", trendColor)}>
                <TrendIcon className="w-4 h-4" />
                {trendValue}
              </span>
            )}
            {subtitle && (
              <span className="text-sm text-muted-foreground">{subtitle}</span>
            )}
          </div>
        )}
        {interpretation && (
          <p className="text-xs text-muted-foreground mt-3 italic leading-relaxed">
            {interpretation}
          </p>
        )}
      </div>
    </div>
  );
}
