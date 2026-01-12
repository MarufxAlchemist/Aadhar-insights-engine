import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OverviewSection } from "@/components/sections/OverviewSection";
import { MethodologySection } from "@/components/sections/MethodologySection";
import { EnrolmentAnalysisSection } from "@/components/sections/EnrolmentAnalysisSection";
import { UpdateBehaviourSection } from "@/components/sections/UpdateBehaviourSection";
import { SocietalSignalsSection } from "@/components/sections/SocietalSignalsSection";
import { AnomalyDetectionSection } from "@/components/sections/AnomalyDetectionSection";
import { VisualInsightsSection } from "@/components/sections/VisualInsightsSection";
import { FilterState } from "@/components/filters/GlobalFilters";

const Index = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [filters, setFilters] = useState<FilterState>({
    state: "ALL",
    dateRange: {
      from: new Date(2024, 3, 1),
      to: new Date(2025, 2, 31),
    },
    updateType: "all",
    timePreset: "1y",
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection filters={filters} />;
      case "methodology":
        return <MethodologySection />;
      case "enrolment":
        return <EnrolmentAnalysisSection filters={filters} />;
      case "updates":
        return <UpdateBehaviourSection filters={filters} />;
      case "signals":
        return <SocietalSignalsSection filters={filters} />;
      case "anomalies":
        return <AnomalyDetectionSection filters={filters} />;
      case "insights":
        return <VisualInsightsSection filters={filters} />;
      default:
        return <OverviewSection filters={filters} />;
    }
  };

  return (
    <DashboardLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onFilterChange={handleFilterChange}
    >
      {renderSection()}
    </DashboardLayout>
  );
};

export default Index;
