import { FilterState } from "@/components/filters/GlobalFilters";

// Mock data for calculations - in a real app, this would come from an API
const stateData = [
    { code: "MH", name: "Maharashtra", enrolments: 2850000, updates: 4132500, ufi: 1.45 },
    { code: "UP", name: "Uttar Pradesh", enrolments: 3200000, updates: 5184000, ufi: 1.62 },
    { code: "KA", name: "Karnataka", enrolments: 1450000, updates: 1711000, ufi: 1.18 },
    { code: "TN", name: "Tamil Nadu", enrolments: 1680000, updates: 2049600, ufi: 1.22 },
    { code: "GJ", name: "Gujarat", enrolments: 1320000, updates: 1782000, ufi: 1.35 },
    { code: "RJ", name: "Rajasthan", enrolments: 1580000, updates: 2338400, ufi: 1.48 },
    { code: "WB", name: "West Bengal", enrolments: 1720000, updates: 2666000, ufi: 1.55 },
    { code: "MP", name: "Madhya Pradesh", enrolments: 1450000, updates: 2059000, ufi: 1.42 },
    { code: "BR", name: "Bihar", enrolments: 1890000, updates: 3175200, ufi: 1.68 },
    { code: "AP", name: "Andhra Pradesh", enrolments: 1120000, updates: 1400000, ufi: 1.25 },
    { code: "TS", name: "Telangana", enrolments: 890000, updates: 1023500, ufi: 1.15 },
    { code: "KL", name: "Kerala", enrolments: 680000, updates: 734400, ufi: 1.08 },
    { code: "OD", name: "Odisha", enrolments: 920000, updates: 1269600, ufi: 1.38 },
    { code: "PB", name: "Punjab", enrolments: 620000, updates: 793600, ufi: 1.28 },
    { code: "HR", name: "Haryana", enrolments: 580000, updates: 765600, ufi: 1.32 },
];

// Update type multipliers (percentage of total updates)
const updateTypeMultipliers: Record<string, number> = {
    all: 1.0,
    demographic: 0.35,
    biometric: 0.18,
    address: 0.35,
    mobile: 0.28,
    email: 0.12,
};

// Time range multipliers based on preset
const timeRangeMultipliers: Record<string, number> = {
    "7d": 0.019, // ~7/365
    "30d": 0.082, // ~30/365
    "90d": 0.247, // ~90/365
    "1y": 1.0,
    custom: 1.0, // Will be calculated based on actual date range
};

export interface FilteredMetrics {
    totalEnrolments: number;
    totalUpdates: number;
    updateFrictionIndex: number;
    enrolmentUpdateGap: number;
    enrolmentTrend: string;
    updatesTrend: string;
    ufiTrend: string;
    gapTrend: string;
}

export function calculateFilteredMetrics(filters?: FilterState): FilteredMetrics {
    // Default values (all states, 1 year)
    let filteredStates = stateData;

    // Filter by state
    if (filters?.state && filters.state !== "ALL") {
        filteredStates = stateData.filter(s => s.code === filters.state);
    }

    // Calculate base totals
    const baseEnrolments = filteredStates.reduce((sum, s) => sum + s.enrolments, 0);
    const baseUpdates = filteredStates.reduce((sum, s) => sum + s.updates, 0);
    const avgUFI = filteredStates.length > 0
        ? filteredStates.reduce((sum, s) => sum + s.ufi, 0) / filteredStates.length
        : 1.35;

    // Apply time range multiplier
    let timeMultiplier = 1.0;
    if (filters?.timePreset && filters.timePreset !== "custom") {
        timeMultiplier = timeRangeMultipliers[filters.timePreset] || 1.0;
    } else if (filters?.dateRange?.from && filters?.dateRange?.to) {
        // Calculate custom date range multiplier
        const daysDiff = Math.ceil(
            (filters.dateRange.to.getTime() - filters.dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
        );
        timeMultiplier = Math.min(daysDiff / 365, 1.0);
    }

    // Apply update type multiplier
    const updateTypeMultiplier = filters?.updateType
        ? updateTypeMultipliers[filters.updateType] || 1.0
        : 1.0;

    // Calculate final metrics
    const totalEnrolments = Math.round(baseEnrolments * timeMultiplier);
    const totalUpdates = Math.round(baseUpdates * timeMultiplier * updateTypeMultiplier);
    const updateFrictionIndex = Number(avgUFI.toFixed(2));
    const enrolmentUpdateGap = totalUpdates - totalEnrolments;

    // Calculate trends (mock - in real app would compare with previous period)
    const enrolmentTrend = "+8.2%";
    const updatesTrend = filters?.updateType && filters.updateType !== "all"
        ? "+15.3%"
        : "+12.4%";
    const ufiTrend = "-0.08";
    const gapTrend = "Stable";

    return {
        totalEnrolments,
        totalUpdates,
        updateFrictionIndex,
        enrolmentUpdateGap,
        enrolmentTrend,
        updatesTrend,
        ufiTrend,
        gapTrend,
    };
}

export function formatNumber(num: number): string {
    const absNum = Math.abs(num);
    const sign = num < 0 ? "-" : "";

    if (absNum >= 10000000) return sign + (absNum / 10000000).toFixed(1) + "Cr";
    if (absNum >= 1000000) return sign + (absNum / 1000000).toFixed(1) + "M";
    if (absNum >= 100000) return sign + (absNum / 100000).toFixed(1) + "L";
    if (absNum >= 1000) return sign + (absNum / 1000).toFixed(0) + "K";
    return num.toString();
}
