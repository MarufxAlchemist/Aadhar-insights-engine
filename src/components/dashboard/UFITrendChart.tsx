import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const data = [
  { month: "Apr", ufi: 1.2, baseline: 1.0 },
  { month: "May", ufi: 1.15, baseline: 1.0 },
  { month: "Jun", ufi: 1.35, baseline: 1.0 },
  { month: "Jul", ufi: 1.42, baseline: 1.0 },
  { month: "Aug", ufi: 1.28, baseline: 1.0 },
  { month: "Sep", ufi: 1.55, baseline: 1.0 },
  { month: "Oct", ufi: 1.48, baseline: 1.0 },
  { month: "Nov", ufi: 1.62, baseline: 1.0 },
  { month: "Dec", ufi: 1.38, baseline: 1.0 },
  { month: "Jan", ufi: 1.25, baseline: 1.0 },
  { month: "Feb", ufi: 1.18, baseline: 1.0 },
  { month: "Mar", ufi: 1.22, baseline: 1.0 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="font-medium text-foreground mb-1">{label} 2024</p>
        <p className="text-sm">
          <span className="text-chart-primary font-medium">UFI: {payload[0]?.value}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">
          Higher UFI may indicate repeated user updates or administrative friction requiring policy attention.
        </p>
      </div>
    );
  }
  return null;
}

export function UFITrendChart() {
  return (
    <div className="gov-card">
      <div className="gov-card-header">
        <h3 className="font-semibold text-foreground">Update Friction Index (UFI) Trend</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          12-month rolling analysis of update complexity
        </p>
      </div>
      <div className="gov-card-body">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                domain={[0.8, 1.8]}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={1}
                stroke="hsl(var(--chart-quaternary))"
                strokeDasharray="5 5"
                label={{ value: "Baseline", position: "right", fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <Line
                type="monotone"
                dataKey="ufi"
                stroke="hsl(var(--chart-primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-primary))", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: "hsl(var(--chart-primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-3 bg-muted/50 rounded-md">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">How to interpret:</span> UFI above 1.0 indicates higher-than-expected update frequency. Sustained elevation (3+ months) may signal systemic friction in specific demographics or regions.
          </p>
        </div>
      </div>
    </div>
  );
}
