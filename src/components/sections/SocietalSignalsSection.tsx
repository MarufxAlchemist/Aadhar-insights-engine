import { KPICard } from "@/components/dashboard/KPICard";
import { LifeEventSignals } from "@/components/dashboard/LifeEventSignals";
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
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
} from "recharts";
import { AlertTriangle, TrendingUp, Users, MapPin } from "lucide-react";
import { FilterState } from "@/components/filters/GlobalFilters";
import { useMemo } from "react";

interface SocietalSignalsSectionProps {
  filters?: FilterState;
}

const migrationCorridors = [
  { from: "Bihar", to: "Delhi", volume: 245000, change: 12.5 },
  { from: "UP", to: "Maharashtra", volume: 198000, change: 8.2 },
  { from: "Odisha", to: "Gujarat", volume: 156000, change: 15.3 },
  { from: "Jharkhand", to: "Karnataka", volume: 134000, change: 9.8 },
  { from: "Rajasthan", to: "Gujarat", volume: 112000, change: 6.4 },
  { from: "WB", to: "Kerala", volume: 98000, change: 18.2 },
  { from: "MP", to: "Maharashtra", volume: 87000, change: 7.1 },
  { from: "Chhattisgarh", to: "Telangana", volume: 76000, change: 11.6 },
];

const seasonalPatterns = [
  { month: "Apr", migration: 85000, marriage: 42000, education: 125000 },
  { month: "May", migration: 125000, marriage: 68000, education: 180000 },
  { month: "Jun", migration: 145000, marriage: 45000, education: 95000 },
  { month: "Jul", migration: 98000, marriage: 38000, education: 65000 },
  { month: "Aug", migration: 78000, marriage: 32000, education: 48000 },
  { month: "Sep", migration: 65000, marriage: 35000, education: 42000 },
  { month: "Oct", migration: 72000, marriage: 125000, education: 38000 },
  { month: "Nov", migration: 95000, marriage: 185000, education: 45000 },
  { month: "Dec", migration: 145000, marriage: 145000, education: 85000 },
  { month: "Jan", migration: 165000, marriage: 52000, education: 145000 },
  { month: "Feb", migration: 135000, marriage: 48000, education: 165000 },
  { month: "Mar", migration: 112000, marriage: 55000, education: 185000 },
];

const clusterEvents = [
  { x: 25, y: 45, z: 150000, type: "migration", label: "Bihar-Delhi Corridor" },
  { x: 55, y: 72, z: 95000, type: "marriage", label: "Festival Season Spike" },
  { x: 78, y: 38, z: 180000, type: "education", label: "Academic Year Start" },
  { x: 42, y: 85, z: 65000, type: "migration", label: "Monsoon Migration" },
  { x: 88, y: 65, z: 120000, type: "employment", label: "Industrial Hub Activity" },
];

const demographicShifts = [
  {
    signal: "Youth Urban Migration",
    indicator: "Address updates (18-30 age group) to metro cities",
    intensity: "High",
    implication: "Economic opportunity-driven relocation",
    status: "increasing",
  },
  {
    signal: "Reverse Migration",
    indicator: "Metro to Tier-2/3 city address changes",
    intensity: "Moderate",
    implication: "Post-pandemic work pattern shifts",
    status: "stable",
  },
  {
    signal: "Marriage-linked Relocation",
    indicator: "Female address updates with name changes",
    intensity: "Seasonal",
    implication: "Cultural marriage season patterns",
    status: "seasonal",
  },
  {
    signal: "Educational Migration",
    indicator: "Address updates for 17-22 age group (Jun-Aug)",
    intensity: "High",
    implication: "Higher education enrollment patterns",
    status: "increasing",
  },
];

function formatNumber(num: number): string {
  if (num >= 100000) return (num / 100000).toFixed(1) + "L";
  if (num >= 1000) return (num / 1000).toFixed(0) + "K";
  return num.toString();
}

function getIntensityBadge(intensity: string) {
  switch (intensity) {
    case "High":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "Moderate":
      return "bg-warning/10 text-warning border-warning/20";
    case "Seasonal":
      return "bg-info/10 text-info border-info/20";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function SocietalSignalsSection({ filters }: SocietalSignalsSectionProps) {
  // Calculate time multiplier for seasonal patterns
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

  // Filter migration corridors based on selected state
  const filteredMigrationCorridors = useMemo(() => {
    if (!filters?.state || filters.state === "ALL") {
      return migrationCorridors;
    }

    // Map state codes to full names
    const stateCodeToName: Record<string, string> = {
      BR: "Bihar", UP: "UP", OD: "Odisha", JH: "Jharkhand",
      RJ: "Rajasthan", WB: "WB", MP: "MP", CG: "Chhattisgarh",
      DL: "Delhi", MH: "Maharashtra", GJ: "Gujarat", KA: "Karnataka",
      KL: "Kerala", TS: "Telangana",
    };

    const stateName = stateCodeToName[filters.state];
    if (!stateName) return migrationCorridors;

    // Filter corridors where selected state is origin or destination
    return migrationCorridors.filter(
      corridor => corridor.from === stateName || corridor.to === stateName
    );
  }, [filters?.state]);

  // Adjust seasonal patterns based on time range
  const adjustedSeasonalPatterns = useMemo(() => {
    return seasonalPatterns.map(month => ({
      ...month,
      migration: Math.round(month.migration * timeMultiplier),
      marriage: Math.round(month.marriage * timeMultiplier),
      education: Math.round(month.education * timeMultiplier),
    }));
  }, [timeMultiplier]);

  // Calculate dynamic KPI values
  const kpiMetrics = useMemo(() => {
    const baseSignalClusters = 24;
    const baseMigrationCorridors = 8;

    // Adjust based on state filter
    let signalClusters = baseSignalClusters;
    let migrationCorridors = baseMigrationCorridors;

    if (filters?.state && filters.state !== "ALL") {
      // Specific state shows fewer but more focused signals
      signalClusters = Math.round(baseSignalClusters * 0.3); // ~7 signals
      migrationCorridors = filteredMigrationCorridors.length;
    }

    // Adjust based on time range
    signalClusters = Math.max(1, Math.round(signalClusters * timeMultiplier));

    return {
      signalClusters,
      migrationCorridors,
      patternMatch: filters?.state && filters.state !== "ALL" ? "96.8%" : "94.2%",
      newSignals: Math.max(1, Math.round(3 * timeMultiplier)),
    };
  }, [filters, timeMultiplier, filteredMigrationCorridors.length]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Signal Clusters"
          value={kpiMetrics.signalClusters.toString()}
          trend="up"
          trendValue="+6"
          subtitle="detected this quarter"
          tooltip="Number of statistically significant activity clusters indicating potential life events or migration patterns."
        />
        <KPICard
          title="Migration Corridors"
          value={kpiMetrics.migrationCorridors.toString()}
          trend="neutral"
          trendValue="Major routes"
          subtitle="active pathways"
          tooltip="Number of inter-state migration routes showing consistent address update patterns."
        />
        <KPICard
          title="Seasonal Pattern Match"
          value={kpiMetrics.patternMatch}
          trend="up"
          trendValue="+2.1%"
          subtitle="correlation score"
          tooltip="How closely current patterns match historical seasonal trends."
        />
        <KPICard
          title="New Signals"
          value={kpiMetrics.newSignals.toString()}
          trend="up"
          trendValue="This week"
          subtitle="requiring review"
          tooltip="Newly detected anomalous patterns that require analyst review."
        />
      </div>

      {/* Life Event Signals Component */}
      <LifeEventSignals />

      {/* Migration Corridors */}
      <div className="gov-card">
        <div className="gov-card-header">
          <h3 className="font-semibold text-foreground">Major Migration Corridors</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Inter-state address update patterns indicating migration flows
            {filters?.state && filters.state !== "ALL" && (
              <span className="ml-2 text-primary font-medium">
                (Filtered: showing routes involving selected state)
              </span>
            )}
          </p>
        </div>
        <div className="gov-card-body">
          {filteredMigrationCorridors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Origin</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Destination</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Volume</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">YoY Change</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMigrationCorridors.map((corridor, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-4 font-medium">{corridor.from}</td>
                      <td className="py-3 px-4">{corridor.to}</td>
                      <td className="py-3 px-4 text-right font-mono">{formatNumber(corridor.volume)}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={corridor.change > 10 ? "text-warning" : "text-info"}>
                          +{corridor.change}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-info" />
                          <span className="text-xs text-muted-foreground">Active</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No migration corridors found for the selected state
            </div>
          )}
        </div>
      </div>

      {/* Seasonal Patterns */}
      <div className="gov-card">
        <div className="gov-card-header">
          <h3 className="font-semibold text-foreground">Seasonal Signal Patterns</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Life-event related address updates by category over time
            {filters?.timePreset && filters.timePreset !== "1y" && (
              <span className="ml-2 text-primary font-medium">
                (Scaled to selected time range)
              </span>
            )}
          </p>
        </div>
        <div className="gov-card-body">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={adjustedSeasonalPatterns}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                <XAxis
                  dataKey="month"
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
                <Line
                  type="monotone"
                  dataKey="migration"
                  stroke="hsl(var(--chart-primary))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Migration"
                />
                <Line
                  type="monotone"
                  dataKey="marriage"
                  stroke="hsl(var(--chart-tertiary))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Marriage"
                />
                <Line
                  type="monotone"
                  dataKey="education"
                  stroke="hsl(var(--info))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Education"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-primary))]" />
              <span className="text-muted-foreground">Migration Signals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-tertiary))]" />
              <span className="text-muted-foreground">Marriage Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--info))]" />
              <span className="text-muted-foreground">Education Relocations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Demographic Shift Signals */}
      <div className="gov-card">
        <div className="gov-card-header">
          <h3 className="font-semibold text-foreground">Demographic Shift Signals</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Emerging patterns from update behaviour analysis
          </p>
        </div>
        <div className="gov-card-body">
          <div className="space-y-4">
            {demographicShifts.map((shift, index) => (
              <div
                key={index}
                className="p-4 border border-border rounded-md bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-foreground">{shift.signal}</h4>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full border ${getIntensityBadge(shift.intensity)}`}
                      >
                        {shift.intensity} Intensity
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{shift.indicator}</p>
                    <p className="text-sm text-foreground/80">
                      <span className="font-medium">Policy Implication:</span> {shift.implication}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {shift.status === "increasing" && <TrendingUp className="w-4 h-4 text-info" />}
                    {shift.status === "stable" && <span className="w-4 h-4 text-center">—</span>}
                    {shift.status === "seasonal" && <span className="w-4 h-4 text-center">⟳</span>}
                    <span className="capitalize">{shift.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interpretation Panel */}
      <div className="gov-card bg-muted/30">
        <div className="gov-card-body">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            Important: Signal Interpretation Guidelines
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Societal signals are <strong>correlational patterns</strong>, not causal conclusions.
            Address update clusters may indicate migration, but could also reflect seasonal
            work patterns, family reunification, or documentation corrections. All signals
            should be cross-validated with census data, employment surveys, and regional
            reports before informing policy decisions. Signals marked as "hypothesis" require
            additional investigation before being treated as confirmed trends.
          </p>
        </div>
      </div>
    </div>
  );
}
