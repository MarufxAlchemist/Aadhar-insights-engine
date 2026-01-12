import { KPICard } from "@/components/dashboard/KPICard";
import {
  AreaChart,
  Area,
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
} from "recharts";
import { FilterState } from "@/components/filters/GlobalFilters";
import { calculateFilteredMetrics, formatNumber as formatNum } from "@/utils/filterUtils";
import { useMemo } from "react";

interface EnrolmentAnalysisSectionProps {
  filters?: FilterState;
}

const monthlyEnrolments = [
  { month: "Apr 24", enrolments: 2450000, newborns: 890000, adults: 1560000 },
  { month: "May 24", enrolments: 2680000, newborns: 920000, adults: 1760000 },
  { month: "Jun 24", enrolments: 2320000, newborns: 850000, adults: 1470000 },
  { month: "Jul 24", enrolments: 2890000, newborns: 980000, adults: 1910000 },
  { month: "Aug 24", enrolments: 2750000, newborns: 940000, adults: 1810000 },
  { month: "Sep 24", enrolments: 2580000, newborns: 870000, adults: 1710000 },
  { month: "Oct 24", enrolments: 2920000, newborns: 1020000, adults: 1900000 },
  { month: "Nov 24", enrolments: 3100000, newborns: 1080000, adults: 2020000 },
  { month: "Dec 24", enrolments: 2780000, newborns: 950000, adults: 1830000 },
  { month: "Jan 25", enrolments: 3250000, newborns: 1150000, adults: 2100000 },
  { month: "Feb 25", enrolments: 2980000, newborns: 1050000, adults: 1930000 },
  { month: "Mar 25", enrolments: 2690000, newborns: 920000, adults: 1770000 },
];

const ageDistribution = [
  { name: "0-5 years", value: 28, fill: "hsl(var(--chart-primary))" },
  { name: "6-18 years", value: 18, fill: "hsl(var(--chart-secondary))" },
  { name: "19-35 years", value: 25, fill: "hsl(var(--chart-tertiary))" },
  { name: "36-60 years", value: 22, fill: "hsl(var(--info))" },
  { name: "60+ years", value: 7, fill: "hsl(var(--muted-foreground))" },
];

const genderDistribution = [
  { name: "Male", value: 51.2, fill: "hsl(var(--chart-primary))" },
  { name: "Female", value: 48.5, fill: "hsl(var(--chart-tertiary))" },
  { name: "Third Gender", value: 0.3, fill: "hsl(var(--chart-secondary))" },
];

const stateWiseEnrolments = [
  { state: "UP", enrolments: 3200000, rate: 2.8 },
  { state: "MH", enrolments: 2850000, rate: 2.4 },
  { state: "BR", enrolments: 1890000, rate: 3.2 },
  { state: "WB", enrolments: 1720000, rate: 2.1 },
  { state: "TN", enrolments: 1680000, rate: 1.9 },
  { state: "RJ", enrolments: 1580000, rate: 2.6 },
  { state: "KA", enrolments: 1450000, rate: 2.2 },
  { state: "GJ", enrolments: 1320000, rate: 2.0 },
  { state: "MP", enrolments: 1450000, rate: 2.5 },
  { state: "AP", enrolments: 1120000, rate: 1.8 },
];

const urbanRuralSplit = [
  { name: "Urban", value: 38, fill: "hsl(var(--chart-primary))" },
  { name: "Rural", value: 62, fill: "hsl(var(--chart-secondary))" },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(0) + "K";
  return num.toString();
}

export function EnrolmentAnalysisSection({ filters }: EnrolmentAnalysisSectionProps) {
  // Calculate metrics based on filters
  const metrics = useMemo(() => calculateFilteredMetrics(filters), [filters]);

  // Calculate derived metrics
  const infantEnrolments = formatNumber(Math.round(metrics.totalEnrolments * 0.36));
  const dailyAvgEnrolments = formatNumber(Math.round(metrics.totalEnrolments / 365));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="New Enrolments (FY)"
          value={formatNumber(metrics.totalEnrolments)}
          trend="up"
          trendValue={metrics.enrolmentTrend}
          subtitle="vs previous year"
          tooltip="Total new Aadhaar registrations in the current financial year."
        />
        <KPICard
          title="Infant Enrolments"
          value={infantEnrolments}
          trend="up"
          trendValue="+12.8%"
          subtitle="age 0-5 years"
          tooltip="Enrolments for children under 5, typically linked to birth registrations."
        />
        <KPICard
          title="Coverage Rate"
          value="99.2%"
          trend="up"
          trendValue="+0.3%"
          subtitle="national average"
          tooltip="Percentage of eligible population with Aadhaar coverage."
        />
        <KPICard
          title="Daily Avg Enrolments"
          value={dailyAvgEnrolments}
          trend="neutral"
          trendValue="Steady"
          subtitle="current month"
          tooltip="Average daily enrolments in the current month."
        />
      </div>

      {/* Monthly Trend */}
      <div className="gov-card">
        <div className="gov-card-header">
          <h3 className="font-semibold text-foreground">Monthly Enrolment Trends</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Breakdown by age category over the selected period
          </p>
        </div>
        <div className="gov-card-body">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEnrolments}>
                <defs>
                  <linearGradient id="enrolmentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="newbornGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-tertiary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-tertiary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="adults"
                  stackId="1"
                  stroke="hsl(var(--chart-primary))"
                  fill="url(#enrolmentGradient)"
                  name="Adults (6+)"
                />
                <Area
                  type="monotone"
                  dataKey="newborns"
                  stackId="1"
                  stroke="hsl(var(--chart-tertiary))"
                  fill="url(#newbornGradient)"
                  name="Infants (0-5)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Demographics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Age Distribution */}
        <div className="gov-card">
          <div className="gov-card-header">
            <h3 className="font-semibold text-foreground">Age Distribution</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Enrolment breakdown by age group
            </p>
          </div>
          <div className="gov-card-body">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${value}%`}
                  >
                    {ageDistribution.map((entry, index) => (
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

        {/* Gender Distribution */}
        <div className="gov-card">
          <div className="gov-card-header">
            <h3 className="font-semibold text-foreground">Gender Distribution</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Gender ratio in enrolments
            </p>
          </div>
          <div className="gov-card-body">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${value}%`}
                  >
                    {genderDistribution.map((entry, index) => (
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

        {/* Urban/Rural Split */}
        <div className="gov-card">
          <div className="gov-card-header">
            <h3 className="font-semibold text-foreground">Urban vs Rural</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Geographic distribution of enrolments
            </p>
          </div>
          <div className="gov-card-body">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={urbanRuralSplit}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {urbanRuralSplit.map((entry, index) => (
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

      {/* State-wise Breakdown */}
      <div className="gov-card">
        <div className="gov-card-header">
          <h3 className="font-semibold text-foreground">Top 10 States by Enrolment Volume</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Enrolment counts and growth rates by state
          </p>
        </div>
        <div className="gov-card-body">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateWiseEnrolments} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                <XAxis
                  type="number"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <YAxis
                  type="category"
                  dataKey="state"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  width={50}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === "enrolments") return [formatNumber(value), "Enrolments"];
                    return [`${value}%`, "Growth Rate"];
                  }}
                />
                <Bar dataKey="enrolments" fill="hsl(var(--chart-primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
            The enrolment analysis reveals continued strong uptake among infant populations (0-5 years),
            suggesting effective integration with birth registration systems. The 62% rural enrolment share
            indicates healthy penetration in underserved areas. States like Bihar and UP show higher growth
            rates, reflecting efforts to close remaining coverage gaps. The gender distribution approaching
            parity (51.2% male, 48.5% female) indicates equitable access across demographics.
          </p>
        </div>
      </div>
    </div>
  );
}
