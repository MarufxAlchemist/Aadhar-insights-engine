import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";
import { FilterState } from "@/components/filters/GlobalFilters";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onFilterChange?: (filters: FilterState) => void;
}

const sectionTitles: Record<string, { title: string; subtitle: string }> = {
  overview: {
    title: "Aadhaar Insights Engine",
    subtitle: "Transforming enrolment and update data into actionable societal signals",
  },
  enrolment: {
    title: "Enrolment Analysis",
    subtitle: "Tracking new Aadhaar registrations across demographics and regions",
  },
  updates: {
    title: "Update Behaviour Analysis",
    subtitle: "Understanding patterns in demographic and biometric update requests",
  },
  signals: {
    title: "Societal Signals",
    subtitle: "Detecting life events and migration patterns through data clusters",
  },
  anomalies: {
    title: "Anomaly Detection",
    subtitle: "Early warning system for unusual activity patterns",
  },
  insights: {
    title: "Visual Insights",
    subtitle: "Export-ready charts and infographics for reports",
  },
  methodology: {
    title: "Methodology & Transparency",
    subtitle: "Data sources, processing methods, and analytical framework",
  },
};

export function DashboardLayout({
  children,
  activeSection,
  onSectionChange,
  onFilterChange,
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { title, subtitle } = sectionTitles[activeSection] || sectionTitles.overview;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <main
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <Header title={title} subtitle={subtitle} onFilterChange={onFilterChange} />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
