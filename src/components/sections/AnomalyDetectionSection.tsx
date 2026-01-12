import { KPICard } from "@/components/dashboard/KPICard";
import { AnomalyAlerts } from "@/components/dashboard/AnomalyAlerts";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { AlertTriangle, Shield, Eye, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FilterState } from "@/components/filters/GlobalFilters";
import { useMemo } from "react";

interface AnomalyDetectionSectionProps {
  filters?: FilterState;
}

const anomalyTimeline = [
  { date: "Week 1", normal: 125000, actual: 128000, threshold: 150000 },
  { date: "Week 2", normal: 132000, actual: 135000, threshold: 158000 },
  { date: "Week 3", normal: 128000, actual: 245000, threshold: 154000, anomaly: true },
  { date: "Week 4", normal: 135000, actual: 142000, threshold: 162000 },
  { date: "Week 5", normal: 130000, actual: 138000, threshold: 156000 },
  { date: "Week 6", normal: 142000, actual: 85000, threshold: 170000, anomaly: true },
  { date: "Week 7", normal: 138000, actual: 145000, threshold: 166000 },
  { date: "Week 8", normal: 145000, actual: 152000, threshold: 174000 },
  { date: "Week 9", normal: 140000, actual: 148000, threshold: 168000 },
  { date: "Week 10", normal: 148000, actual: 320000, threshold: 178000, anomaly: true },
  { date: "Week 11", normal: 155000, actual: 162000, threshold: 186000 },
  { date: "Week 12", normal: 150000, actual: 158000, threshold: 180000 },
];

const detailedAnomalies = [
  {
    id: "ANM-2025-0412",
    type: "surge",
    severity: "high",
    location: "Bihar - Patna District",
    timeWindow: "15-18 Jan 2025",
    metric: "Address Updates",
    deviation: "+185%",
    baselineValue: "45,000",
    actualValue: "128,250",
    status: "investigating",
    hypothesis: "Possible internal migration surge post-election period",
    assignedTo: "Regional Analysis Team",
    createdAt: "18 Jan 2025, 09:30",
  },
  {
    id: "ANM-2025-0398",
    type: "drop",
    severity: "medium",
    location: "Tamil Nadu - Chennai",
    timeWindow: "8-12 Jan 2025",
    metric: "Biometric Updates",
    deviation: "-62%",
    baselineValue: "28,000",
    actualValue: "10,640",
    status: "resolved",
    hypothesis: "System maintenance window - confirmed",
    assignedTo: "Infrastructure Team",
    createdAt: "12 Jan 2025, 14:15",
    resolvedAt: "13 Jan 2025, 11:00",
  },
  {
    id: "ANM-2025-0385",
    type: "surge",
    severity: "medium",
    location: "Maharashtra - Pune",
    timeWindow: "5-8 Jan 2025",
    metric: "Mobile Updates",
    deviation: "+95%",
    baselineValue: "32,000",
    actualValue: "62,400",
    status: "monitoring",
    hypothesis: "New telecom operator migration",
    assignedTo: "Pattern Analysis Unit",
    createdAt: "8 Jan 2025, 16:45",
  },
  {
    id: "ANM-2025-0371",
    type: "pattern",
    severity: "low",
    location: "Gujarat - Multiple Districts",
    timeWindow: "1-15 Jan 2025",
    metric: "Name Corrections",
    deviation: "+45%",
    baselineValue: "12,000",
    actualValue: "17,400",
    status: "closed",
    hypothesis: "Post-census correction drive",
    assignedTo: "Quality Assurance",
    createdAt: "15 Jan 2025, 10:00",
    resolvedAt: "20 Jan 2025, 09:00",
  },
];

const weeklyAnomalyStats = [
  { week: "W1", detected: 3, resolved: 2, pending: 1 },
  { week: "W2", detected: 5, resolved: 4, pending: 1 },
  { week: "W3", detected: 8, resolved: 5, pending: 3 },
  { week: "W4", detected: 4, resolved: 6, pending: 1 },
  { week: "W5", detected: 2, resolved: 2, pending: 1 },
  { week: "W6", detected: 6, resolved: 3, pending: 4 },
  { week: "W7", detected: 3, resolved: 5, pending: 2 },
  { week: "W8", detected: 4, resolved: 3, pending: 3 },
];

function formatNumber(num: number): string {
  if (num >= 100000) return (num / 100000).toFixed(1) + "L";
  if (num >= 1000) return (num / 1000).toFixed(0) + "K";
  return num.toString();
}

function getStatusIcon(status: string) {
  switch (status) {
    case "resolved":
    case "closed":
      return <CheckCircle2 className="w-4 h-4 text-success" />;
    case "investigating":
      return <Eye className="w-4 h-4 text-warning" />;
    case "monitoring":
      return <Clock className="w-4 h-4 text-info" />;
    default:
      return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "resolved":
    case "closed":
      return "bg-success/10 text-success border-success/20";
    case "investigating":
      return "bg-warning/10 text-warning border-warning/20";
    case "monitoring":
      return "bg-info/10 text-info border-info/20";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getSeverityBadge(severity: string) {
  switch (severity) {
    case "high":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "medium":
      return "bg-warning/10 text-warning border-warning/20";
    case "low":
      return "bg-info/10 text-info border-info/20";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function AnomalyDetectionSection({ filters }: AnomalyDetectionSectionProps) {
  // Calculate dynamic anomaly metrics based on filters
  const anomalyMetrics = useMemo(() => {
    // Base values for all states, full year
    const baseActiveAnomalies = 7;
    const baseHighSeverity = 2;
    const baseResolutionTime = 3.2;
    const baseAccuracy = 96.4;

    // Time multiplier
    let timeMultiplier = 1.0;
    if (filters?.timePreset && filters.timePreset !== "1y") {
      const multipliers: Record<string, number> = {
        "7d": 0.019,
        "30d": 0.082,
        "90d": 0.247,
        "1y": 1.0,
        custom: 1.0,
      };
      timeMultiplier = multipliers[filters.timePreset] || 1.0;
    }

    // State-specific adjustments
    let stateMultiplier = 1.0;
    let accuracyAdjustment = 0;
    let resolutionAdjustment = 0;

    if (filters?.state && filters.state !== "ALL") {
      // Different states have different anomaly rates
      const stateAnomalyRates: Record<string, number> = {
        // Low anomaly states (better systems)
        KL: 0.4, TS: 0.5, KA: 0.6, TN: 0.7,
        // Medium anomaly states
        AP: 0.8, PB: 0.9, HR: 0.9, GJ: 1.0, OD: 1.0,
        // High anomaly states (more complex operations)
        MP: 1.2, MH: 1.3, RJ: 1.3, WB: 1.5, UP: 1.7, BR: 1.8,
      };
      stateMultiplier = stateAnomalyRates[filters.state] || 1.0;

      // Better performing states have higher accuracy
      if (stateMultiplier < 0.8) {
        accuracyAdjustment = 1.5; // +1.5%
        resolutionAdjustment = -0.5; // Faster resolution
      } else if (stateMultiplier > 1.3) {
        accuracyAdjustment = -1.2; // -1.2%
        resolutionAdjustment = 0.8; // Slower resolution
      }
    }

    // Update type affects anomaly detection
    let updateTypeMultiplier = 1.0;
    if (filters?.updateType && filters.updateType !== "all") {
      const updateTypeAnomalyRates: Record<string, number> = {
        mobile: 0.5,      // Mobile updates have fewer anomalies
        email: 0.6,       // Email updates are simple
        address: 1.2,     // Address updates have more anomalies
        demographic: 1.3, // Demographic updates are complex
        biometric: 1.5,   // Biometric updates have most anomalies
      };
      updateTypeMultiplier = updateTypeAnomalyRates[filters.updateType] || 1.0;
    }

    // Calculate final metrics
    const totalMultiplier = stateMultiplier * updateTypeMultiplier * timeMultiplier;

    const activeAnomalies = Math.max(1, Math.round(baseActiveAnomalies * totalMultiplier));
    const highSeverity = Math.max(0, Math.round(baseHighSeverity * totalMultiplier));
    const resolutionTime = Math.max(0.5, baseResolutionTime + resolutionAdjustment);
    const accuracy = Math.min(99.9, Math.max(85, baseAccuracy + accuracyAdjustment));

    return {
      activeAnomalies,
      highSeverity,
      resolutionTime: resolutionTime.toFixed(1) + "d",
      accuracy: accuracy.toFixed(1) + "%",
      trendValue: activeAnomalies < 7 ? `-${7 - activeAnomalies}` : `+${activeAnomalies - 7}`,
    };
  }, [filters]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Anomalies"
          value={anomalyMetrics.activeAnomalies.toString()}
          trend={anomalyMetrics.activeAnomalies <= 7 ? "down" : "up"}
          trendValue={anomalyMetrics.trendValue}
          subtitle="from last week"
          tooltip="Number of anomalies currently being investigated or monitored."
        />
        <KPICard
          title="High Severity"
          value={anomalyMetrics.highSeverity.toString()}
          trend="neutral"
          trendValue="Stable"
          subtitle="requiring attention"
          tooltip="Anomalies with deviation >100% or affecting critical systems."
        />
        <KPICard
          title="Avg Resolution Time"
          value={anomalyMetrics.resolutionTime}
          trend="down"
          trendValue="-0.8d"
          subtitle="improving"
          tooltip="Average time from anomaly detection to resolution or classification."
        />
        <KPICard
          title="Detection Accuracy"
          value={anomalyMetrics.accuracy}
          trend="up"
          trendValue="+1.2%"
          subtitle="true positives"
          tooltip="Percentage of detected anomalies that were confirmed as genuine irregularities."
        />
      </div>

      {/* Alert Summary */}
      <AnomalyAlerts />

      {/* Anomaly Timeline */}
      <div className="gov-card">
        <div className="gov-card-header">
          <h3 className="font-semibold text-foreground">Activity Deviation Timeline</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Actual vs expected activity with anomaly markers
          </p>
        </div>
        <div className="gov-card-body">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={anomalyTimeline}>
                <defs>
                  <linearGradient id="normalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--info))" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="hsl(var(--info))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                <XAxis
                  dataKey="date"
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
                  formatter={(value: number, name: string) => [formatNumber(value), name]}
                />
                <ReferenceLine
                  y={150000}
                  stroke="hsl(var(--warning))"
                  strokeDasharray="5 5"
                  label={{ value: "Upper Threshold", fill: "hsl(var(--warning))", fontSize: 10 }}
                />
                <Area
                  type="monotone"
                  dataKey="normal"
                  stroke="hsl(var(--info))"
                  strokeWidth={1}
                  fill="url(#normalGradient)"
                  name="Expected Baseline"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="hsl(var(--chart-primary))"
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    if (payload.anomaly) {
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={6}
                          fill="hsl(var(--destructive))"
                          stroke="hsl(var(--background))"
                          strokeWidth={2}
                        />
                      );
                    }
                    return <circle cx={cx} cy={cy} r={3} fill="hsl(var(--chart-primary))" />;
                  }}
                  name="Actual Activity"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-primary))]" />
              <span>Actual Activity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--info))]" />
              <span>Expected Baseline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span>Anomaly Detected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Anomaly Log */}
      <div className="gov-card">
        <div className="gov-card-header flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Anomaly Investigation Log</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Detailed tracking of detected anomalies
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Filter:</span>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">All</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">Active</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">High</Badge>
          </div>
        </div>
        <div className="gov-card-body p-0">
          <div className="divide-y divide-border">
            {detailedAnomalies.map((anomaly) => (
              <div key={anomaly.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-muted-foreground">{anomaly.id}</span>
                    <Badge className={`text-xs ${getSeverityBadge(anomaly.severity)}`}>
                      {anomaly.severity.toUpperCase()}
                    </Badge>
                    <Badge className={`text-xs ${getStatusBadge(anomaly.status)}`}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(anomaly.status)}
                        {anomaly.status}
                      </span>
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{anomaly.createdAt}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium">{anomaly.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Time Window</p>
                    <p className="text-sm font-medium">{anomaly.timeWindow}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Metric</p>
                    <p className="text-sm font-medium">{anomaly.metric}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Deviation</p>
                    <p className={`text-sm font-medium ${anomaly.type === 'surge' ? 'text-destructive' : 'text-warning'}`}>
                      {anomaly.deviation} ({anomaly.baselineValue} → {anomaly.actualValue})
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Hypothesis:</span> {anomaly.hypothesis}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    Assigned: {anomaly.assignedTo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Stats */}
      <div className="gov-card">
        <div className="gov-card-header">
          <h3 className="font-semibold text-foreground">Weekly Detection & Resolution</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Anomaly detection and resolution trends
          </p>
        </div>
        <div className="gov-card-body">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyAnomalyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="detected"
                  stackId="1"
                  stroke="hsl(var(--warning))"
                  fill="hsl(var(--warning)/0.3)"
                  name="Detected"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stackId="2"
                  stroke="hsl(var(--success))"
                  fill="hsl(var(--success)/0.3)"
                  name="Resolved"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interpretation Panel */}
      <div className="gov-card bg-muted/30">
        <div className="gov-card-body">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-info" />
            Anomaly Classification Framework
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-destructive mb-1">High Severity</p>
              <p className="text-muted-foreground">
                Deviation &gt;100% from baseline, or affecting &gt;5 districts, or impacting
                critical infrastructure. Requires immediate investigation.
              </p>
            </div>
            <div>
              <p className="font-medium text-warning mb-1">Medium Severity</p>
              <p className="text-muted-foreground">
                Deviation 50-100% from baseline, localized to 1-5 districts.
                Requires investigation within 48 hours.
              </p>
            </div>
            <div>
              <p className="font-medium text-info mb-1">Low Severity</p>
              <p className="text-muted-foreground">
                Deviation 25-50% from baseline, single district impact.
                Monitored for pattern development over 7 days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
