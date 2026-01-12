import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { month: "Apr", enrolments: 2.4, updates: 3.2, gap: -0.8 },
  { month: "May", enrolments: 2.6, updates: 3.1, gap: -0.5 },
  { month: "Jun", enrolments: 2.8, updates: 3.5, gap: -0.7 },
  { month: "Jul", enrolments: 2.5, updates: 3.8, gap: -1.3 },
  { month: "Aug", enrolments: 2.3, updates: 3.4, gap: -1.1 },
  { month: "Sep", enrolments: 2.7, updates: 4.1, gap: -1.4 },
  { month: "Oct", enrolments: 2.9, updates: 3.9, gap: -1.0 },
  { month: "Nov", enrolments: 3.1, updates: 4.2, gap: -1.1 },
  { month: "Dec", enrolments: 2.8, updates: 3.6, gap: -0.8 },
  { month: "Jan", enrolments: 2.4, updates: 3.3, gap: -0.9 },
  { month: "Feb", enrolments: 2.5, updates: 3.2, gap: -0.7 },
  { month: "Mar", enrolments: 2.7, updates: 3.4, gap: -0.7 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const enrolments = payload.find((p) => p.dataKey === "enrolments")?.value || 0;
    const updates = payload.find((p) => p.dataKey === "updates")?.value || 0;
    const gap = payload.find((p) => p.dataKey === "gap")?.value || 0;

    return (
      <div className="chart-tooltip">
        <p className="font-medium text-foreground mb-2">{label} 2024</p>
        <div className="space-y-1 text-sm">
          <p>
            <span className="inline-block w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: "hsl(var(--chart-primary))" }} />
            Enrolments: {enrolments}M
          </p>
          <p>
            <span className="inline-block w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: "hsl(var(--chart-secondary))" }} />
            Updates: {updates}M
          </p>
          <p className={gap < 0 ? "text-destructive" : "text-success"}>
            Gap: {gap > 0 ? "+" : ""}{gap}M
          </p>
        </div>
      </div>
    );
  }
  return null;
}

export function GapAnalysisChart() {
  return (
    <div className="gov-card">
      <div className="gov-card-header">
        <h3 className="font-semibold text-foreground">Enrolment–Update Gap Analysis</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Tracking divergence between new registrations and update volume
        </p>
      </div>
      <div className="gov-card-body">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                tickFormatter={(value) => `${value}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: "10px" }}
                formatter={(value) => <span className="text-sm text-muted-foreground capitalize">{value}</span>}
              />
              <Bar
                dataKey="enrolments"
                fill="hsl(var(--chart-primary))"
                radius={[2, 2, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="updates"
                fill="hsl(var(--chart-secondary))"
                radius={[2, 2, 0, 0]}
                barSize={20}
              />
              <Line
                type="monotone"
                dataKey="gap"
                stroke="hsl(var(--chart-tertiary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-tertiary))", strokeWidth: 0, r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Interpretation Panel */}
        <div className="mt-4 p-4 bg-muted/50 rounded-md border border-border">
          <h4 className="text-sm font-medium text-foreground mb-2">Current Gap Interpretation</h4>
          <p className="text-sm text-muted-foreground">
            The persistent negative gap (-0.7M to -1.4M) indicates the system is in a <span className="font-medium text-foreground">maintenance phase</span>, where existing users are actively updating records faster than new enrolments are occurring. This suggests:
          </p>
          <ul className="mt-2 text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li><span className="text-foreground">Digital Inclusion:</span> High saturation in covered demographics</li>
            <li><span className="text-foreground">System Maturity:</span> Platform is being actively used for updates</li>
            <li><span className="text-foreground">Infrastructure:</span> Update centers are under sustained load</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
