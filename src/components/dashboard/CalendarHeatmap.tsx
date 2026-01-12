import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DayData {
  date: string;
  value: number;
  label: string;
}

// Generate sample data for the year
function generateYearData(): DayData[] {
  const data: DayData[] = [];
  const startDate = new Date(2024, 3, 1); // April 2024
  const endDate = new Date(2025, 2, 31); // March 2025
  
  const current = new Date(startDate);
  while (current <= endDate) {
    // Simulate varying activity levels with some spikes
    const month = current.getMonth();
    const day = current.getDate();
    
    let baseValue = 50000 + Math.random() * 30000;
    
    // Seasonal patterns
    if (month >= 0 && month <= 2) baseValue *= 1.3; // Q4 peak
    if (month >= 9 && month <= 11) baseValue *= 1.2; // Q2 mild peak
    
    // Random spikes (migration events, etc.)
    if (Math.random() > 0.95) baseValue *= 2.5;
    
    // Weekends lower
    const dayOfWeek = current.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) baseValue *= 0.6;
    
    data.push({
      date: current.toISOString().split("T")[0],
      value: Math.round(baseValue),
      label: current.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    });
    
    current.setDate(current.getDate() + 1);
  }
  
  return data;
}

function getIntensityLevel(value: number): number {
  if (value < 40000) return 0;
  if (value < 55000) return 1;
  if (value < 70000) return 2;
  if (value < 90000) return 3;
  return 4;
}

function getIntensityColor(level: number): string {
  switch (level) {
    case 0:
      return "bg-muted";
    case 1:
      return "bg-info/20";
    case 2:
      return "bg-info/40";
    case 3:
      return "bg-info/60";
    case 4:
      return "bg-info";
    default:
      return "bg-muted";
  }
}

function formatNumber(num: number): string {
  if (num >= 100000) return (num / 100000).toFixed(1) + "L";
  if (num >= 1000) return (num / 1000).toFixed(0) + "K";
  return num.toString();
}

export function CalendarHeatmap() {
  const yearData = generateYearData();
  
  // Group by weeks
  const weeks: DayData[][] = [];
  let currentWeek: DayData[] = [];
  
  yearData.forEach((day, index) => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    
    currentWeek.push(day);
    
    if (index === yearData.length - 1) {
      weeks.push(currentWeek);
    }
  });
  
  // Get month labels
  const months = [
    "Apr", "May", "Jun", "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"
  ];

  return (
    <div className="gov-card">
      <div className="gov-card-header">
        <h3 className="font-semibold text-foreground">Activity Calendar</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Daily update activity over the selected period
        </p>
      </div>
      <div className="gov-card-body">
        <div className="overflow-x-auto">
          {/* Month labels */}
          <div className="flex mb-2 text-xs text-muted-foreground">
            <div className="w-8" /> {/* Spacer for day labels */}
            <div className="flex">
              {months.map((month, i) => (
                <div key={month} className="flex-shrink-0" style={{ width: `${(100 / 12)}%`, minWidth: "40px" }}>
                  {month}
                </div>
              ))}
            </div>
          </div>
          
          {/* Heatmap grid */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col justify-around text-xs text-muted-foreground pr-2 w-8">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>
            
            {/* Calendar cells */}
            <div className="flex gap-[2px] flex-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[2px]">
                  {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                    const dayData = week.find((d) => {
                      const date = new Date(d.date);
                      return date.getDay() === dayIndex;
                    });
                    
                    if (!dayData) {
                      return (
                        <div
                          key={dayIndex}
                          className="w-3 h-3 rounded-sm bg-transparent"
                        />
                      );
                    }
                    
                    const intensity = getIntensityLevel(dayData.value);
                    
                    return (
                      <Tooltip key={dayIndex}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "w-3 h-3 rounded-sm cursor-pointer transition-transform hover:scale-125",
                              getIntensityColor(intensity)
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          <div className="space-y-1">
                            <p className="font-medium">{dayData.label}</p>
                            <p>Updates: <span className="font-semibold">{formatNumber(dayData.value)}</span></p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={cn("w-3 h-3 rounded-sm", getIntensityColor(level))}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
