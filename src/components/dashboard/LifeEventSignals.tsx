import { Activity, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Signal {
  id: string;
  type: string;
  region: string;
  period: string;
  intensity: "low" | "moderate" | "high";
  hypothesis: string;
}

const signals: Signal[] = [
  {
    id: "1",
    type: "Address Update Cluster",
    region: "Bihar → Delhi NCR Corridor",
    period: "Oct–Nov 2024",
    intensity: "high",
    hypothesis: "Possible seasonal migration pattern from agricultural to urban employment regions.",
  },
  {
    id: "2",
    type: "Mobile Number Update Cluster",
    region: "Kerala – Ernakulam District",
    period: "Dec 2024",
    intensity: "moderate",
    hypothesis: "May indicate return migration of NRI population during festival season.",
  },
  {
    id: "3",
    type: "Demographic Update Surge",
    region: "Tamil Nadu – Chennai Urban",
    period: "Jan 2025",
    intensity: "moderate",
    hypothesis: "Consistent with academic year transitions and student relocations.",
  },
];

const intensityStyles = {
  low: "bg-info/10 border-info/20",
  moderate: "bg-warning/10 border-warning/20",
  high: "bg-accent/10 border-accent/30",
};

const intensityDot = {
  low: "bg-info",
  moderate: "bg-warning",
  high: "bg-accent",
};

export function LifeEventSignals() {
  return (
    <div className="gov-card">
      <div className="gov-card-header">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Life-Event Signal Detection
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Clusters indicating migration or major demographic transitions
        </p>
      </div>
      <div className="gov-card-body space-y-3">
        {signals.map((signal) => (
          <div
            key={signal.id}
            className={cn(
              "p-4 rounded-md border",
              intensityStyles[signal.intensity]
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", intensityDot[signal.intensity])} />
                <h4 className="font-medium text-sm text-foreground">{signal.type}</h4>
              </div>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {signal.period}
              </span>
            </div>
            <p className="text-sm text-foreground mb-2">{signal.region}</p>
            <div className="p-2 bg-background/50 rounded border border-border">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Signal Hypothesis: </span>
                {signal.hypothesis}
              </p>
            </div>
          </div>
        ))}

        <div className="mt-4 p-3 bg-muted/30 rounded-md border border-border">
          <p className="text-xs text-muted-foreground flex items-start gap-2">
            <span className="font-medium text-foreground shrink-0">Note:</span>
            <span>
              These signals are data-driven observations based on update clustering patterns. 
              They represent hypotheses for further investigation, not confirmed causal relationships.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
