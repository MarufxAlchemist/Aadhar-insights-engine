import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StateData {
  state: string;
  code: string;
  ufi: number;
  enrolments: number;
  updates: number;
}

interface StateHeatmapProps {
  selectedState?: string;
}

const stateData: StateData[] = [
  { state: "Maharashtra", code: "MH", ufi: 1.45, enrolments: 2850000, updates: 4132500 },
  { state: "Uttar Pradesh", code: "UP", ufi: 1.62, enrolments: 3200000, updates: 5184000 },
  { state: "Karnataka", code: "KA", ufi: 1.18, enrolments: 1450000, updates: 1711000 },
  { state: "Tamil Nadu", code: "TN", ufi: 1.22, enrolments: 1680000, updates: 2049600 },
  { state: "Gujarat", code: "GJ", ufi: 1.35, enrolments: 1320000, updates: 1782000 },
  { state: "Rajasthan", code: "RJ", ufi: 1.48, enrolments: 1580000, updates: 2338400 },
  { state: "West Bengal", code: "WB", ufi: 1.55, enrolments: 1720000, updates: 2666000 },
  { state: "Madhya Pradesh", code: "MP", ufi: 1.42, enrolments: 1450000, updates: 2059000 },
  { state: "Bihar", code: "BR", ufi: 1.68, enrolments: 1890000, updates: 3175200 },
  { state: "Andhra Pradesh", code: "AP", ufi: 1.25, enrolments: 1120000, updates: 1400000 },
  { state: "Telangana", code: "TS", ufi: 1.15, enrolments: 890000, updates: 1023500 },
  { state: "Kerala", code: "KL", ufi: 1.08, enrolments: 680000, updates: 734400 },
  { state: "Odisha", code: "OD", ufi: 1.38, enrolments: 920000, updates: 1269600 },
  { state: "Punjab", code: "PB", ufi: 1.28, enrolments: 620000, updates: 793600 },
  { state: "Haryana", code: "HR", ufi: 1.32, enrolments: 580000, updates: 765600 },
];

function getHeatColor(ufi: number): string {
  if (ufi < 1.2) return "bg-info/20 text-info";
  if (ufi < 1.4) return "bg-info/40 text-info";
  if (ufi < 1.5) return "bg-warning/30 text-warning";
  if (ufi < 1.6) return "bg-warning/50 text-warning";
  return "bg-destructive/30 text-destructive";
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(0) + "K";
  return num.toString();
}

export function StateHeatmap({ selectedState }: StateHeatmapProps) {
  // Filter states based on selection
  const filteredStates = selectedState && selectedState !== "ALL"
    ? stateData.filter(state => state.code === selectedState)
    : stateData;

  return (
    <div className="gov-card">
      <div className="gov-card-header">
        <h3 className="font-semibold text-foreground">State-wise UFI Distribution</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Update Friction Index intensity by state
          {selectedState && selectedState !== "ALL" && (
            <span className="ml-2 text-primary font-medium">
              (Filtered: {filteredStates[0]?.state || selectedState})
            </span>
          )}
        </p>
      </div>
      <div className="gov-card-body">
        <div className="grid grid-cols-5 gap-2">
          {filteredStates.map((state) => (
            <Tooltip key={state.code}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "aspect-square rounded-md flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105",
                    getHeatColor(state.ufi),
                    selectedState === state.code && "ring-2 ring-primary ring-offset-2"
                  )}
                >
                  <span className="font-semibold text-sm">{state.code}</span>
                  <span className="text-xs font-medium">{state.ufi}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-1.5">
                  <p className="font-medium">{state.state}</p>
                  <div className="text-sm space-y-0.5">
                    <p>UFI: <span className="font-medium">{state.ufi}</span></p>
                    <p>Enrolments: <span className="font-medium">{formatNumber(state.enrolments)}</span></p>
                    <p>Updates: <span className="font-medium">{formatNumber(state.updates)}</span></p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {filteredStates.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No data available for the selected state
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span>UFI Intensity:</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-info/20" />
              <span>&lt;1.2</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-info/40" />
              <span>1.2–1.4</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-warning/40" />
              <span>1.4–1.6</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-destructive/30" />
              <span>&gt;1.6</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
