import { KPICard } from "@/components/dashboard/KPICard";
import { CalendarHeatmap } from "@/components/dashboard/CalendarHeatmap";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
  Area,
} from "recharts";
import { FilterState } from "@/components/filters/GlobalFilters";
import { calculateFilteredMetrics, formatNumber as formatNum } from "@/utils/filterUtils";
import { useMemo } from "react";

interface UpdateBehaviourSectionProps {
  filters?: FilterState;
}

const updateTypeDistribution = [
  { name: "Address", value: 35, fill: "hsl(var(--chart-primary))" },
  { name: "Mobile", value: 28, fill: "hsl(var(--chart-secondary))" },
  { name: "Biometric", value: 18, fill: "hsl(var(--chart-tertiary))" },
  { name: "Email", value: 12, fill: "hsl(var(--info))" },
  { name: "Name", value: 7, fill: "hsl(var(--muted-foreground))" },
];

const monthlyUFI = [
  { month: "Apr", ufi: 1.42, updates: 3800000, completionRate: 78 },
  { month: "May", ufi: 1.38, updates: 4100000, completionRate: 81 },
  { month: "Jun", ufi: 1.35, updates: 3600000, completionRate: 82 },
  { month: "Jul", ufi: 1.48, updates: 4500000, completionRate: 75 },
  { month: "Aug", ufi: 1.44, updates: 4200000, completionRate: 77 },
  { month: "Sep", ufi: 1.36, updates: 3900000, completionRate: 80 },
  { month: "Oct", ufi: 1.32, updates: 4000000, completionRate: 83 },
  { month: "Nov", ufi: 1.28, updates: 3700000, completionRate: 85 },
  { month: "Dec", ufi: 1.31, updates: 3500000, completionRate: 84 },
  { month: "Jan", ufi: 1.38, updates: 4300000, completionRate: 79 },
  { month: "Feb", ufi: 1.35, updates: 4100000, completionRate: 81 },
  { month: "Mar", ufi: 1.33, updates: 3800000, completionRate: 82 },
];

const repeatUpdateAnalysis = [
  { frequency: "Single Update", count: 32500000, percentage: 71 },
  { frequency: "2 Updates", count: 8200000, percentage: 18 },
  { frequency: "3 Updates", count: 3400000, percentage: 7.5 },
  { frequency: "4+ Updates", count: 1700000, percentage: 3.5 },
];

const stateUFIComparison = [
  { state: "Kerala", ufi: 1.08, category: "optimal" },
  { state: "Telangana", ufi: 1.15, category: "optimal" },
  { state: "Karnataka", ufi: 1.18, category: "optimal" },
  { state: "Tamil Nadu", ufi: 1.22, category: "moderate" },
  { state: "Andhra Pradesh", ufi: 1.25, category: "moderate" },
  { state: "Punjab", ufi: 1.28, category: "moderate" },
  { state: "Gujarat", ufi: 1.35, category: "moderate" },
  { state: "Odisha", ufi: 1.38, category: "elevated" },
  { state: "MP", ufi: 1.42, category: "elevated" },
  { state: "Maharashtra", ufi: 1.45, category: "elevated" },
  { state: "Rajasthan", ufi: 1.48, category: "elevated" },
  { state: "West Bengal", ufi: 1.55, category: "high" },
  { state: "UP", ufi: 1.62, category: "high" },
  { state: "Bihar", ufi: 1.68, category: "high" },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(0) + "K";
  return num.toString();
}

function getUFIColor(ufi: number): string {
  if (ufi < 1.2) return "hsl(var(--info))";
  if (ufi < 1.4) return "hsl(var(--chart-secondary))";
  if (ufi < 1.5) return "hsl(var(--warning))";
  return "hsl(var(--destructive))";
}

export function UpdateBehaviourSection({ filters }: UpdateBehaviourSectionProps) {
  // Calculate metrics based on filters
  const metrics = useMemo(() => calculateFilteredMetrics(filters), [filters]);

  // Calculate completion rate based on UFI (inverse relationship)
  const completionRate = Math.round(100 / metrics.updateFrictionIndex);
  const repeatRate = 100 - completionRate;

  // Generate filtered monthly UFI data
  const filteredMonthlyUFI = useMemo(() => {
    // Base UFI adjustment based on selected state
    let ufiAdjustment = 0;
    if (filters?.state && filters.state !== "ALL") {
      // Adjust UFI based on state (some states have better/worse UFI)
      const stateUFIMap: Record<string, number> = {
        KL: -0.27, TS: -0.20, KA: -0.17, TN: -0.13, AP: -0.10,
        PB: -0.07, HR: -0.03, GJ: 0, OD: 0.03, MP: 0.07,
        MH: 0.10, RJ: 0.13, WB: 0.20, UP: 0.27, BR: 0.33,
      };
      ufiAdjustment = stateUFIMap[filters.state] || 0;
    }

    // Update type affects UFI (some update types are easier than others)
    let updateTypeUFIAdjustment = 0;
    if (filters?.updateType && filters.updateType !== "all") {
      const updateTypeUFIMap: Record<string, number> = {
        mobile: -0.15,      // Mobile updates are easiest
        email: -0.10,       // Email updates are easy
        address: 0.05,      // Address updates are moderate
        demographic: 0.10,  // Demographic updates are harder
        biometric: 0.20,    // Biometric updates are hardest
      };
      updateTypeUFIAdjustment = updateTypeUFIMap[filters.updateType] || 0;
    }

    const totalUFIAdjustment = ufiAdjustment + updateTypeUFIAdjustment;

    return monthlyUFI.map(month => {
      const adjustedUFI = Math.max(1.0, Math.min(2.0, month.ufi + totalUFIAdjustment));
      const adjustedCompletionRate = Math.round(100 / adjustedUFI);

      return {
        ...month,
        ufi: Number(adjustedUFI.toFixed(2)),
        completionRate: Math.max(50, Math.min(95, adjustedCompletionRate)),
      };
    });
  }, [filters]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Updates (FY)"
          value={formatNum(metrics.totalUpdates)}
          trend="up"
          trendValue={metrics.updatesTrend}
          subtitle="vs previous year"
          tooltip="Total demographic and biometric updates processed in the financial year."
        />
        <KPICard
          title="Update Friction Index"
          value={metrics.updateFrictionIndex.toString()}
          trend="down"
          trendValue={metrics.ufiTrend}
          subtitle="national average"
          tooltip="UFI measures update complexity. Lower values indicate smoother update experiences."
        />
        <KPICard
          title="First-Attempt Success"
          value={`${completionRate}%`}
          trend="up"
          trendValue="+3.2%"
          subtitle="completion rate"
          tooltip="Percentage of updates completed successfully on first attempt."
        />
        <KPICard
          title="Repeat Update Rate"
          value={`${repeatRate}%`}
          trend="down"
          trendValue="-2.1%"
          subtitle="multiple attempts"
          tooltip="Percentage of users requiring multiple update attempts within 90 days."
        />
      </div>

      {/* Calendar Heatmap */}
      <CalendarHeatmap />

      {/* UFI Trend and Update Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* UFI Trend */}
        <div className="gov-card">
          <div className="gov-card-header">
            <h3 className="font-semibold text-foreground">UFI & Completion Rate Trends</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Update Friction Index vs first-attempt completion
              {filters?.state && filters.state !== "ALL" && (
                <span className="ml-2 text-primary font-medium">
                  (Filtered by state)
                </span>
              )}
              {filters?.updateType && filters.updateType !== "all" && (
                <span className="ml-2 text-primary font-medium">
                  (Filtered by update type)
                </span>
              )}
            </p>
          </div>
          <div className="gov-card-body">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={filteredMonthlyUFI}>
                  <defs>
                    <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--info))" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(var(--info))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    yAxisId="left"
                    domain={[1.0, 1.7]}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[70, 90]}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="completionRate"
                    fill="url(#completionGradient)"
                    stroke="hsl(var(--info))"
                    strokeWidth={1}
                    name="Completion Rate %"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="ufi"
                    stroke="hsl(var(--chart-tertiary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-tertiary))", r: 4 }}
                    name="UFI"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Update Type Distribution */}
        <div className="gov-card">
          <div className="gov-card-header">
            <h3 className="font-semibold text-foreground">Update Type Distribution</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Breakdown by update category
            </p>
          </div>
          <div className="gov-card-body">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={updateTypeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${value}%`}
                  >
                    {updateTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Share"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* State UFI Comparison */}
      <div className="gov-card">
        <div className="gov-card-header">
          <h3 className="font-semibold text-foreground">State-wise UFI Comparison</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Update Friction Index by state (sorted by efficiency)
          </p>
        </div>
        <div className="gov-card-body">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateUFIComparison} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                <XAxis
                  type="number"
                  domain={[1, 1.8]}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  type="category"
                  dataKey="state"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                  formatter={(value: number) => [value.toFixed(2), "UFI"]}
                />
                <Bar
                  dataKey="ufi"
                  radius={[0, 4, 4, 0]}
                  fill="hsl(var(--chart-primary))"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
            <span className="font-medium">UFI Categories:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-info" />
              <span>&lt;1.2 Optimal</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-info/60" />
              <span>1.2–1.4 Moderate</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-warning" />
              <span>1.4–1.5 Elevated</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-destructive" />
              <span>&gt;1.5 High Friction</span>
            </div>
          </div>
        </div>
      </div>

      {/* Repeat Update Analysis */}
      <div className="gov-card">
        <div className="gov-card-header">
          <h3 className="font-semibold text-foreground">Repeat Update Analysis</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Frequency of multiple update attempts within 90 days
          </p>
        </div>
        <div className="gov-card-body">
          <div className="grid grid-cols-4 gap-4">
            {repeatUpdateAnalysis.map((item) => (
              <div
                key={item.frequency}
                className="p-4 rounded-md bg-muted/30 border border-border"
              >
                <p className="text-sm text-muted-foreground">{item.frequency}</p>
                <p className="text-2xl font-semibold text-foreground mt-1">
                  {formatNumber(item.count)}
                </p>
                <p className="text-sm text-info font-medium">{item.percentage}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interpretation Panel */}
      <div className="gov-card bg-muted/30">
        <div className="gov-card-body">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-info" />
            How to Interpret This Data
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Update Friction Index (UFI) measures the average number of attempts required to complete
            an update. A UFI of 1.35 indicates that on average, 35% more attempts are made than theoretically
            necessary. States with UFI above 1.5 (Bihar, UP, West Bengal) may indicate infrastructure
            constraints, operator training gaps, or document verification challenges. The 29% repeat update
            rate, while declining, represents significant scope for process optimization.
          </p>
        </div>
      </div>
    </div>
  );
}
