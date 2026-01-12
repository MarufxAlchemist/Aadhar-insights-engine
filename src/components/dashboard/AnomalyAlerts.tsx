import { cn } from "@/lib/utils";
import { AlertTriangle, TrendingUp, TrendingDown, MapPin, Clock } from "lucide-react";

interface Anomaly {
  id: string;
  type: "surge" | "drop";
  title: string;
  location: string;
  timeWindow: string;
  severity: "low" | "medium" | "high";
  description: string;
}

const anomalies: Anomaly[] = [
  {
    id: "1",
    type: "surge",
    title: "Sudden Update Surge Detected",
    location: "Bihar – Patna District",
    timeWindow: "Jan 15–22, 2025",
    severity: "high",
    description: "Address updates increased 340% above baseline, potentially indicating post-flood migration patterns.",
  },
  {
    id: "2",
    type: "drop",
    title: "Sharp Drop in Enrolment Activity",
    location: "Rajasthan – Jaipur Urban",
    timeWindow: "Dec 1–15, 2024",
    severity: "medium",
    description: "New enrolments fell 65% below expected levels. May correlate with center closures or operational issues.",
  },
  {
    id: "3",
    type: "surge",
    title: "Mobile Number Update Spike",
    location: "Maharashtra – Mumbai Suburban",
    timeWindow: "Feb 1–10, 2025",
    severity: "medium",
    description: "Mobile updates 180% above normal, consistent with telecom porting trends in the region.",
  },
  {
    id: "4",
    type: "drop",
    title: "Biometric Update Decline",
    location: "West Bengal – Kolkata",
    timeWindow: "Nov 20–30, 2024",
    severity: "low",
    description: "Biometric updates reduced by 40%, likely due to seasonal factors and festival period.",
  },
];

const severityStyles = {
  low: "severity-low border",
  medium: "severity-medium border",
  high: "severity-high border",
};

const severityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function AnomalyAlerts() {
  return (
    <div className="gov-card">
      <div className="gov-card-header flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            Anomaly Detection
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Early warning signals for unusual activity patterns
          </p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
          {anomalies.length} active alerts
        </span>
      </div>
      <div className="gov-card-body space-y-3">
        {anomalies.map((anomaly) => (
          <div
            key={anomaly.id}
            className={cn(
              "p-4 rounded-md",
              severityStyles[anomaly.severity]
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {anomaly.type === "surge" ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <h4 className="font-medium text-sm">{anomaly.title}</h4>
              </div>
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded",
                  anomaly.severity === "high" && "bg-destructive/20",
                  anomaly.severity === "medium" && "bg-warning/20",
                  anomaly.severity === "low" && "bg-info/20"
                )}
              >
                {severityLabels[anomaly.severity]} Severity
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {anomaly.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {anomaly.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {anomaly.timeWindow}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
