import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  RefreshCw,
  Activity,
  AlertTriangle,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "enrolment", label: "Enrolment Analysis", icon: Users },
  { id: "updates", label: "Update Behaviour Analysis", icon: RefreshCw },
  { id: "signals", label: "Societal Signals", icon: Activity },
  { id: "anomalies", label: "Anomaly Detection", icon: AlertTriangle },
  { id: "insights", label: "Visual Insights", icon: BarChart3 },
  { id: "methodology", label: "Methodology & Transparency", icon: FileText },
];

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function Sidebar({ activeSection, onSectionChange, collapsed, onCollapsedChange }: SidebarProps) {

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="w-8 h-8 flex items-center justify-center">
            <img
              src="/compass-icon.png"
              alt="Aadhaar Compass"
              className="w-8 h-8"
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sidebar-foreground font-semibold text-sm leading-tight">
                Aadhaar Insights
              </span>
              <span className="text-sidebar-foreground/60 text-xs">Engine v1.0</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Developer Credit */}
      {!collapsed && (
        <div className="px-4 py-2 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/50 text-center">
            Developed by <span className="font-medium text-sidebar-foreground/70">Maruf Nadaf</span>
          </p>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
