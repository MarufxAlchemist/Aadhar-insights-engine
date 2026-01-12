import { useState } from "react";
import { Calendar, ChevronDown, MapPin, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

const INDIAN_STATES = [
  { code: "ALL", name: "All States" },
  { code: "AP", name: "Andhra Pradesh" },
  { code: "AR", name: "Arunachal Pradesh" },
  { code: "AS", name: "Assam" },
  { code: "BR", name: "Bihar" },
  { code: "CG", name: "Chhattisgarh" },
  { code: "GA", name: "Goa" },
  { code: "GJ", name: "Gujarat" },
  { code: "HR", name: "Haryana" },
  { code: "HP", name: "Himachal Pradesh" },
  { code: "JH", name: "Jharkhand" },
  { code: "KA", name: "Karnataka" },
  { code: "KL", name: "Kerala" },
  { code: "MP", name: "Madhya Pradesh" },
  { code: "MH", name: "Maharashtra" },
  { code: "MN", name: "Manipur" },
  { code: "ML", name: "Meghalaya" },
  { code: "MZ", name: "Mizoram" },
  { code: "NL", name: "Nagaland" },
  { code: "OD", name: "Odisha" },
  { code: "PB", name: "Punjab" },
  { code: "RJ", name: "Rajasthan" },
  { code: "SK", name: "Sikkim" },
  { code: "TN", name: "Tamil Nadu" },
  { code: "TS", name: "Telangana" },
  { code: "TR", name: "Tripura" },
  { code: "UP", name: "Uttar Pradesh" },
  { code: "UK", name: "Uttarakhand" },
  { code: "WB", name: "West Bengal" },
  { code: "JK", name: "Jammu & Kashmir" },
  { code: "LA", name: "Ladakh" },
  { code: "DL", name: "Delhi" },
  { code: "PY", name: "Puducherry" },
  { code: "CH", name: "Chandigarh" },
  { code: "AN", name: "Andaman & Nicobar" },
  { code: "DN", name: "Dadra & Nagar Haveli" },
  { code: "LD", name: "Lakshadweep" },
];

const UPDATE_TYPES = [
  { value: "all", label: "All Update Types" },
  { value: "demographic", label: "Demographic Updates" },
  { value: "biometric", label: "Biometric Updates" },
  { value: "address", label: "Address Updates" },
  { value: "mobile", label: "Mobile Updates" },
  { value: "email", label: "Email Updates" },
];

const TIME_PRESETS = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last Quarter" },
  { value: "1y", label: "Last Year" },
  { value: "custom", label: "Custom Range" },
];

interface GlobalFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  state: string;
  dateRange: DateRange | undefined;
  updateType: string;
  timePreset: string;
}

export function GlobalFilters({ onFilterChange }: GlobalFiltersProps) {
  const [state, setState] = useState("ALL");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 3, 1),
    to: new Date(2025, 2, 31),
  });
  const [updateType, setUpdateType] = useState("all");
  const [timePreset, setTimePreset] = useState("1y");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const filters: FilterState = {
      state,
      dateRange,
      updateType,
      timePreset,
      ...newFilters,
    };
    onFilterChange?.(filters);
  };

  const handleStateChange = (value: string) => {
    setState(value);
    handleFilterChange({ state: value });
  };

  const handleUpdateTypeChange = (value: string) => {
    setUpdateType(value);
    handleFilterChange({ updateType: value });
  };

  const handleTimePresetChange = (value: string) => {
    setTimePreset(value);
    if (value !== "custom") {
      const now = new Date();
      let from: Date;
      switch (value) {
        case "7d":
          from = new Date(now.setDate(now.getDate() - 7));
          break;
        case "30d":
          from = new Date(now.setDate(now.getDate() - 30));
          break;
        case "90d":
          from = new Date(now.setDate(now.getDate() - 90));
          break;
        case "1y":
        default:
          from = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
      }
      const newRange = { from, to: new Date() };
      setDateRange(newRange);
      handleFilterChange({ timePreset: value, dateRange: newRange });
    }
  };

  const clearFilters = () => {
    setState("ALL");
    setUpdateType("all");
    setTimePreset("1y");
    setDateRange({
      from: new Date(2024, 3, 1),
      to: new Date(2025, 2, 31),
    });
    handleFilterChange({
      state: "ALL",
      updateType: "all",
      timePreset: "1y",
    });
  };

  const hasActiveFilters = state !== "ALL" || updateType !== "all" || timePreset !== "1y";

  const selectedState = INDIAN_STATES.find((s) => s.code === state);

  return (
    <div className="bg-card border-b border-border px-6 py-3">
      <div className="flex items-center gap-3 flex-wrap">
        {/* State Filter */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <Select value={state} onValueChange={handleStateChange}>
            <SelectTrigger className="w-[180px] h-9 text-sm">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {INDIAN_STATES.map((stateItem) => (
                <SelectItem key={stateItem.code} value={stateItem.code}>
                  {stateItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time Preset */}
        <Select value={timePreset} onValueChange={handleTimePresetChange}>
          <SelectTrigger className="w-[140px] h-9 text-sm">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            {TIME_PRESETS.map((preset) => (
              <SelectItem key={preset.value} value={preset.value}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Calendar Range Picker */}
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 h-9">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {dateRange?.from && dateRange?.to
                  ? `${format(dateRange.from, "dd MMM yy")} – ${format(dateRange.to, "dd MMM yy")}`
                  : "Select dates"}
              </span>
              <ChevronDown className="w-3 h-3 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={(range) => {
                setDateRange(range);
                if (range?.from && range?.to) {
                  setTimePreset("custom");
                  handleFilterChange({ dateRange: range, timePreset: "custom" });
                }
              }}
              numberOfMonths={2}
              defaultMonth={dateRange?.from}
            />
          </PopoverContent>
        </Popover>

        {/* Update Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={updateType} onValueChange={handleUpdateTypeChange}>
            <SelectTrigger className="w-[180px] h-9 text-sm">
              <SelectValue placeholder="Update Type" />
            </SelectTrigger>
            <SelectContent>
              {UPDATE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {state !== "ALL" && (
              <Badge variant="secondary" className="text-xs">
                {selectedState?.name}
              </Badge>
            )}
            {updateType !== "all" && (
              <Badge variant="secondary" className="text-xs">
                {UPDATE_TYPES.find((t) => t.value === updateType)?.label}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
