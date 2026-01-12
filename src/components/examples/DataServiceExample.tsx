/**
 * Example Component: Data Service Usage Demo
 * 
 * This component demonstrates how to use the centralized data service
 * to load and display Aadhaar CSV data.
 */

import { useEffect, useState } from 'react';
import {
    loadEnrolmentData,
    loadDemographicUpdateData,
    AadhaarEnrolmentRecord,
    AadhaarDemographicUpdateRecord,
    getUniqueStates,
    aggregateEnrolmentsByState,
    aggregateUpdatesByState,
    filterByDateRange,
} from '@/data/dataService';

export function DataServiceExample() {
    const [enrolmentData, setEnrolmentData] = useState<AadhaarEnrolmentRecord[]>([]);
    const [updateData, setUpdateData] = useState<AadhaarDemographicUpdateRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);

                // Load both datasets
                const [enrolments, updates] = await Promise.all([
                    loadEnrolmentData(),
                    loadDemographicUpdateData(),
                ]);

                setEnrolmentData(enrolments);
                setUpdateData(updates);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data');
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-destructive font-medium">Error: {error}</p>
            </div>
        );
    }

    // Get unique states
    const states = getUniqueStates(enrolmentData);

    // Aggregate data by state
    const enrolmentsByState = aggregateEnrolmentsByState(enrolmentData);
    const updatesByState = aggregateUpdatesByState(updateData);

    // Example: Filter data for September 2025
    const septemberEnrolments = filterByDateRange(
        enrolmentData,
        '01-09-2025',
        '30-09-2025'
    );

    return (
        <div className="p-6 space-y-6">
            <div className="gov-card">
                <div className="gov-card-header">
                    <h2 className="text-xl font-semibold">Data Service Example</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Demonstrating CSV data loading and analysis
                    </p>
                </div>

                <div className="gov-card-body space-y-4">
                    {/* Dataset Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-primary/5 rounded-md">
                            <p className="text-sm text-muted-foreground">Total Enrolment Records</p>
                            <p className="text-2xl font-bold text-primary">
                                {enrolmentData.length.toLocaleString()}
                            </p>
                        </div>

                        <div className="p-4 bg-secondary/5 rounded-md">
                            <p className="text-sm text-muted-foreground">Total Update Records</p>
                            <p className="text-2xl font-bold text-secondary">
                                {updateData.length.toLocaleString()}
                            </p>
                        </div>

                        <div className="p-4 bg-accent/5 rounded-md">
                            <p className="text-sm text-muted-foreground">Unique States</p>
                            <p className="text-2xl font-bold text-accent">
                                {states.length}
                            </p>
                        </div>
                    </div>

                    {/* September 2025 Data */}
                    <div className="p-4 border border-border rounded-md">
                        <h3 className="font-medium mb-2">September 2025 Enrolments</h3>
                        <p className="text-sm text-muted-foreground">
                            Filtered records: <span className="font-mono font-medium">{septemberEnrolments.length.toLocaleString()}</span>
                        </p>
                    </div>

                    {/* State-wise Aggregation (Top 5) */}
                    <div>
                        <h3 className="font-medium mb-3">Top 5 States by Enrolments</h3>
                        <div className="space-y-2">
                            {Array.from(enrolmentsByState.entries())
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 5)
                                .map(([state, count]) => {
                                    const updates = updatesByState.get(state) || 0;
                                    return (
                                        <div key={state} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                                            <span className="font-medium">{state}</span>
                                            <div className="flex gap-4 text-sm">
                                                <span className="text-primary">
                                                    Enrolments: <span className="font-mono font-semibold">{count.toLocaleString()}</span>
                                                </span>
                                                <span className="text-secondary">
                                                    Updates: <span className="font-mono font-semibold">{updates.toLocaleString()}</span>
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    {/* Sample Records */}
                    <div>
                        <h3 className="font-medium mb-3">Sample Enrolment Records (First 5)</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Date</th>
                                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">State</th>
                                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">District</th>
                                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Pincode</th>
                                        <th className="text-right py-2 px-3 font-medium text-muted-foreground">Age 0-5</th>
                                        <th className="text-right py-2 px-3 font-medium text-muted-foreground">Age 5-17</th>
                                        <th className="text-right py-2 px-3 font-medium text-muted-foreground">Age 18+</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enrolmentData.slice(0, 5).map((record, index) => (
                                        <tr key={index} className="border-b border-border/50">
                                            <td className="py-2 px-3 font-mono text-xs">{record.date}</td>
                                            <td className="py-2 px-3">{record.state}</td>
                                            <td className="py-2 px-3">{record.district}</td>
                                            <td className="py-2 px-3 font-mono text-xs">{record.pincode}</td>
                                            <td className="py-2 px-3 text-right font-mono">{record.age_0_5}</td>
                                            <td className="py-2 px-3 text-right font-mono">{record.age_5_17}</td>
                                            <td className="py-2 px-3 text-right font-mono">{record.age_18_greater}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
