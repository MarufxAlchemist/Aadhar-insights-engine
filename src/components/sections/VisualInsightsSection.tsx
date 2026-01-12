import { KPICard } from "@/components/dashboard/KPICard";
import { StateHeatmap } from "@/components/dashboard/StateHeatmap";
import {
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Treemap,
} from "recharts";
import { Download, Printer, FileText, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterState } from "@/components/filters/GlobalFilters";
import { calculateFilteredMetrics, formatNumber as formatNum } from "@/utils/filterUtils";
import { useMemo } from "react";

interface VisualInsightsSectionProps {
  filters?: FilterState;
}

const statePerformance = [
  { state: "Kerala", code: "KL", enrolment: 95, updates: 88, friction: 92, coverage: 99 },
  { state: "Tamil Nadu", code: "TN", enrolment: 88, updates: 82, friction: 85, coverage: 98 },
  { state: "Karnataka", code: "KA", enrolment: 85, updates: 80, friction: 82, coverage: 97 },
  { state: "Maharashtra", code: "MH", enrolment: 82, updates: 78, friction: 72, coverage: 96 },
  { state: "Gujarat", code: "GJ", enrolment: 80, updates: 75, friction: 78, coverage: 95 },
  { state: "Telangana", code: "TS", enrolment: 90, updates: 85, friction: 88, coverage: 98 },
  { state: "Punjab", code: "PB", enrolment: 78, updates: 74, friction: 76, coverage: 94 },
  { state: "Haryana", code: "HR", enrolment: 76, updates: 72, friction: 74, coverage: 93 },
  { state: "Rajasthan", code: "RJ", enrolment: 72, updates: 68, friction: 65, coverage: 92 },
  { state: "Bihar", code: "BR", enrolment: 65, updates: 60, friction: 55, coverage: 88 },
];

const updateTypeBreakdown = [
  { name: "Address", value: 35, fill: "hsl(var(--chart-primary))" },
  { name: "Mobile", value: 28, fill: "hsl(var(--chart-secondary))" },
  { name: "Biometric", value: 18, fill: "hsl(var(--chart-tertiary))" },
  { name: "Email", value: 12, fill: "hsl(var(--info))" },
  { name: "Name", value: 7, fill: "hsl(var(--muted-foreground))" },
];

const regionalDistribution = [
  { name: "North", size: 28500000, fill: "hsl(var(--chart-primary))" },
  { name: "South", size: 24200000, fill: "hsl(var(--chart-secondary))" },
  { name: "West", size: 21800000, fill: "hsl(var(--chart-tertiary))" },
  { name: "East", size: 18400000, fill: "hsl(var(--info))" },
  { name: "Central", size: 15600000, fill: "hsl(var(--warning))" },
  { name: "NE", size: 4800000, fill: "hsl(var(--muted-foreground))" },
];

const quarterlyTrends = [
  { quarter: "Q1 FY24", enrolments: 7800000, updates: 10200000 },
  { quarter: "Q2 FY24", enrolments: 8200000, updates: 11500000 },
  { quarter: "Q3 FY24", enrolments: 8800000, updates: 12800000 },
  { quarter: "Q4 FY24", enrolments: 7600000, updates: 11300000 },
];

const radarData = [
  { metric: "Coverage", value: 99.2, fullMark: 100 },
  { metric: "Efficiency", value: 81, fullMark: 100 },
  { metric: "Accessibility", value: 88, fullMark: 100 },
  { metric: "Quality", value: 94, fullMark: 100 },
  { metric: "Speed", value: 76, fullMark: 100 },
  { metric: "Equity", value: 85, fullMark: 100 },
];

function formatNumber(num: number): string {
  if (num >= 10000000) return (num / 10000000).toFixed(1) + "Cr";
  if (num >= 100000) return (num / 100000).toFixed(1) + "L";
  if (num >= 1000) return (num / 1000).toFixed(0) + "K";
  return num.toString();
}

const COLORS = [
  "hsl(var(--chart-primary))",
  "hsl(var(--chart-secondary))",
  "hsl(var(--chart-tertiary))",
  "hsl(var(--info))",
  "hsl(var(--warning))",
];

export function VisualInsightsSection({ filters }: VisualInsightsSectionProps) {
  // Calculate filtered metrics
  const metrics = useMemo(() => calculateFilteredMetrics(filters), [filters]);

  // Time multiplier for scaling data
  const timeMultiplier = useMemo(() => {
    if (!filters?.timePreset || filters.timePreset === "1y") return 1.0;
    const multipliers: Record<string, number> = {
      "7d": 0.019,
      "30d": 0.082,
      "90d": 0.247,
      "1y": 1.0,
      custom: 1.0,
    };
    return multipliers[filters.timePreset] || 1.0;
  }, [filters?.timePreset]);

  // Filter state performance table
  const filteredStatePerformance = useMemo(() => {
    if (!filters?.state || filters.state === "ALL") {
      return statePerformance.slice(0, 5); // Top 5
    }
    const selectedState = statePerformance.find(s => s.code === filters.state);
    return selectedState ? [selectedState] : statePerformance.slice(0, 5);
  }, [filters?.state]);

  // Adjust quarterly trends based on filters
  const adjustedQuarterlyTrends = useMemo(() => {
    const updateTypeMultiplier = filters?.updateType && filters.updateType !== "all"
      ? { mobile: 0.28, email: 0.12, address: 0.35, demographic: 0.35, biometric: 0.18 }[filters.updateType] || 1.0
      : 1.0;

    return quarterlyTrends.map(q => ({
      ...q,
      enrolments: Math.round(q.enrolments * timeMultiplier),
      updates: Math.round(q.updates * timeMultiplier * updateTypeMultiplier),
    }));
  }, [filters, timeMultiplier]);

  // Adjust radar data based on state
  const adjustedRadarData = useMemo(() => {
    if (!filters?.state || filters.state === "ALL") return radarData;

    // State-specific performance adjustments
    const stateAdjustments: Record<string, number> = {
      KL: 8, TS: 6, KA: 5, TN: 4, AP: 2,
      PB: 0, HR: 0, GJ: -1, OD: -2, MP: -3,
      MH: -4, RJ: -5, WB: -6, UP: -8, BR: -10,
    };
    const adjustment = stateAdjustments[filters.state] || 0;

    return radarData.map(item => ({
      ...item,
      value: Math.max(50, Math.min(100, item.value + adjustment)),
    }));
  }, [filters?.state]);

  // Calculate dynamic KPIs
  const visualKPIs = useMemo(() => {
    const dailyTransactions = Math.round((metrics.totalEnrolments + metrics.totalUpdates) / 365);
    const activeCentres = filters?.state && filters.state !== "ALL" ? "3,200" : "52,847";
    const dataQuality = filters?.state && filters.state !== "ALL" ? "96.2%" : "94.6%";

    return {
      coverage: filters?.state && filters.state !== "ALL" ? "98.5%" : "99.2%",
      activeCentres,
      dailyTransactions: formatNumber(dailyTransactions),
      dataQuality,
    };
  }, [metrics, filters?.state]);

  // Filter update type breakdown
  const filteredUpdateTypeBreakdown = useMemo(() => {
    if (!filters?.updateType || filters.updateType === "all") {
      return updateTypeBreakdown;
    }

    // Highlight selected update type
    const selectedType = updateTypeBreakdown.find(
      t => t.name.toLowerCase() === filters.updateType
    );

    return selectedType ? [selectedType] : updateTypeBreakdown;
  }, [filters?.updateType]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Export Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Export-Ready Visualizations</h2>
          <p className="text-sm text-muted-foreground">
            Print-optimized charts and infographics for reports
            {(filters?.state && filters.state !== "ALL") || (filters?.updateType && filters.updateType !== "all") ? (
              <span className="ml-2 text-primary font-medium">
                (Filtered view active)
              </span>
            ) : null}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export All
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="w-4 h-4" />
            Print View
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="National Coverage"
          value={visualKPIs.coverage}
          trend="up"
          trendValue="+0.3%"
          subtitle="of eligible population"
          tooltip="Percentage of population aged 5+ with Aadhaar."
        />
        <KPICard
          title="Active Enrolment Centres"
          value={visualKPIs.activeCentres}
          trend="up"
          trendValue="+1,234"
          subtitle="nationwide"
          tooltip="Total operational enrolment and update centres."
        />
        <KPICard
          title="Avg Daily Transactions"
          value={visualKPIs.dailyTransactions}
          trend="neutral"
          trendValue="Stable"
          subtitle="enrolments + updates"
          tooltip="Average combined daily transactions."
        />
        <KPICard
          title="Data Quality Score"
          value={visualKPIs.dataQuality}
          trend="up"
          trendValue="+1.8%"
          subtitle="accuracy metric"
          tooltip="Quality score based on validation checks."
        />
      </div>

      {/* Infographic Panel */}
      <div className="gov-card bg-gradient-to-br from-primary/5 to-transparent">
        <div className="gov-card-header border-primary/20">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4" />
            How Aadhaar Data Becomes a Societal Signal
          </h3>
        </div>
        <div className="gov-card-body">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
            <div className="p-4 rounded-md bg-card border border-border">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h4 className="font-medium text-sm mb-1">Data Collection</h4>
              <p className="text-xs text-muted-foreground">
                Enrolments & updates recorded at {visualKPIs.activeCentres} centres
              </p>
            </div>
            <div className="p-4 rounded-md bg-card border border-border">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h4 className="font-medium text-sm mb-1">Pattern Analysis</h4>
              <p className="text-xs text-muted-foreground">
                Statistical analysis identifies clusters
              </p>
            </div>
            <div className="p-4 rounded-md bg-card border border-border">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h4 className="font-medium text-sm mb-1">Signal Detection</h4>
              <p className="text-xs text-muted-foreground">
                Anomalies & trends flagged for review
              </p>
            </div>
            <div className="p-4 rounded-md bg-card border border-border">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">4</span>
              </div>
              <h4 className="font-medium text-sm mb-1">Hypothesis Generation</h4>
              <p className="text-xs text-muted-foreground">
                Signals mapped to societal events
              </p>
            </div>
            <div className="p-4 rounded-md bg-card border border-border">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">5</span>
              </div>
              <h4 className="font-medium text-sm mb-1">Policy Insights</h4>
              <p className="text-xs text-muted-foreground">
                Data-backed recommendations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Radar */}
        <div className="gov-card">
          <div className="gov-card-header">
            <h3 className="font-semibold text-foreground">System Performance Index</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Multi-dimensional performance assessment
              {filters?.state && filters.state !== "ALL" && (
                <span className="ml-2 text-primary font-medium">
                  (State-specific metrics)
                </span>
              )}
            </p>
          </div>
          <div className="gov-card-body">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={adjustedRadarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="hsl(var(--chart-primary))"
                    fill="hsl(var(--chart-primary))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Update Type Distribution */}
        <div className="gov-card">
          <div className="gov-card-header">
            <h3 className="font-semibold text-foreground">Update Type Distribution</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Breakdown by category
              {filters?.updateType && filters.updateType !== "all" && (
                <span className="ml-2 text-primary font-medium">
                  (Showing: {filters.updateType})
                </span>
              )}
            </p>
          </div>
          <div className="gov-card-body">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredUpdateTypeBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {filteredUpdateTypeBreakdown.map((entry, index) => (
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
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Heatmap */}
      <StateHeatmap selectedState={filters?.state} />

      {/* Quarterly Comparison */}
      <div className="gov-card">
        <div className="gov-card-header">
          <h3 className="font-semibold text-foreground">Quarterly Activity Comparison</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Enrolments vs updates by quarter
            {filters?.timePreset && filters.timePreset !== "1y" && (
              <span className="ml-2 text-primary font-medium">
                (Scaled to time range)
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
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adjustedQuarterlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                <XAxis
                  dataKey="quarter"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                  formatter={(value: number) => [formatNumber(value), ""]}
                />
                <Bar dataKey="enrolments" fill="hsl(var(--chart-primary))" radius={[4, 4, 0, 0]} name="Enrolments" />
                <Bar dataKey="updates" fill="hsl(var(--chart-tertiary))" radius={[4, 4, 0, 0]} name="Updates" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* State Performance Comparison */}
      <div className="gov-card">
        <div className="gov-card-header">
          <h3 className="font-semibold text-foreground">
            {filters?.state && filters.state !== "ALL" ? "Selected State" : "Top 5 States"} - Performance Metrics
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Comparative performance across key indicators
          </p>
        </div>
        <div className="gov-card-body">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">State</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Enrolment Score</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Update Efficiency</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Low Friction</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Coverage</th>
                </tr>
              </thead>
              <tbody>
                {filteredStatePerformance.map((state, index) => (
                  <tr key={state.state} className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        {state.state}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-chart-primary rounded-full"
                            style={{ width: `${state.enrolment}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono">{state.enrolment}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-chart-secondary rounded-full"
                            style={{ width: `${state.updates}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono">{state.updates}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-info rounded-full"
                            style={{ width: `${state.friction}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono">{state.friction}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono text-sm">{state.coverage}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Print Note */}
      <div className="gov-card bg-muted/30 print:hidden">
        <div className="gov-card-body text-center">
          <p className="text-sm text-muted-foreground">
            All visualizations are optimized for A4 landscape printing. Use the Print View button
            for clean, export-ready layouts suitable for official reports and presentations.
          </p>
        </div>
      </div>
    </div>
  );
}
