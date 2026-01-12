import { KPICard } from "@/components/dashboard/KPICard";
import { UFITrendChart } from "@/components/dashboard/UFITrendChart";
import { StateHeatmap } from "@/components/dashboard/StateHeatmap";
import { GapAnalysisChart } from "@/components/dashboard/GapAnalysisChart";
import { AnomalyAlerts } from "@/components/dashboard/AnomalyAlerts";
import { LifeEventSignals } from "@/components/dashboard/LifeEventSignals";
import { FilterState } from "@/components/filters/GlobalFilters";
import { calculateFilteredMetrics, formatNumber } from "@/utils/filterUtils";
import { useMemo } from "react";

interface OverviewSectionProps {
  filters?: FilterState;
}

export function OverviewSection({ filters }: OverviewSectionProps) {
  // Calculate metrics based on filters
  const metrics = useMemo(() => calculateFilteredMetrics(filters), [filters]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Enrolments"
          value={formatNumber(metrics.totalEnrolments)}
          trend="up"
          trendValue={metrics.enrolmentTrend}
          subtitle="vs previous year"
          tooltip="Total new Aadhaar registrations during the selected period. Growth indicates expanding coverage in previously underserved demographics."
        />
        <KPICard
          title="Total Updates"
          value={formatNumber(metrics.totalUpdates)}
          trend="up"
          trendValue={metrics.updatesTrend}
          subtitle="vs previous year"
          tooltip="Total demographic, biometric, and contact updates processed. Higher update volume reflects active platform engagement."
        />
        <KPICard
          title="Update Friction Index"
          value={metrics.updateFrictionIndex.toString()}
          trend="down"
          trendValue={metrics.ufiTrend}
          subtitle="national average"
          tooltip="Ratio measuring update complexity. Values above 1.0 suggest users require multiple visits or attempts to complete updates, indicating potential administrative friction."
        />
        <KPICard
          title="Enrolment-Update Gap"
          value={formatNumber(metrics.enrolmentUpdateGap)}
          trend="neutral"
          trendValue={metrics.gapTrend}
          subtitle="net difference"
          tooltip="Difference between enrolments and updates. Negative values indicate a mature system where updates outpace new registrations, typical for high-saturation regions."
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UFITrendChart />
        <StateHeatmap selectedState={filters?.state} />
      </div>

      {/* Gap Analysis */}
      <GapAnalysisChart />

      {/* Signals and Anomalies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LifeEventSignals />
        <AnomalyAlerts />
      </div>
    </div>
  );
}
