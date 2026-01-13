/**
 * Centralized Data Service for Aadhaar CSV Datasets
 * 
 * This service provides TypeScript interfaces and data loading utilities
 * for the official Government of India Aadhaar datasets.
 * 
 * Data is treated as static and read-only.
 */

// ============================================================================
// TypeScript Interfaces (Based on Actual CSV Column Structure)
// ============================================================================

/**
 * Aadhaar Enrolment Monthly Data
 * 
 * CSV Columns: date,state,district,pincode,age_0_5,age_5_17,age_18_greater
 * 
 * Represents monthly enrolment data aggregated by location and age groups.
 */
export interface AadhaarEnrolmentRecord {
    /** Date in DD-MM-YYYY format (e.g., "01-09-2025") */
    date: string;

    /** State name (e.g., "Maharashtra") */
    state: string;

    /** District name (e.g., "Ahmadnagar", "Mumbai") */
    district: string;

    /** 6-digit pincode (e.g., "413701") */
    pincode: string;

    /** Number of enrolments for age group 0-5 years */
    age_0_5: number;

    /** Number of enrolments for age group 5-17 years */
    age_5_17: number;

    /** Number of enrolments for age group 18+ years */
    age_18_greater: number;
}

/**
 * Aadhaar Demographic Updates Monthly Data
 * 
 * CSV Columns: date,state,district,pincode,demo_age_5_17,demo_age_17_
 * 
 * Represents monthly demographic update data aggregated by location and age groups.
 * Note: The second age column appears to be "demo_age_17_" (likely 17+)
 */
export interface AadhaarDemographicUpdateRecord {
    /** Date in DD-MM-YYYY format (e.g., "01-03-2025") */
    date: string;

    /** State name (e.g., "Maharashtra") */
    state: string;

    /** District name (e.g., "Ratnagiri", "Mumbai") */
    district: string;

    /** 6-digit pincode (e.g., "415620") */
    pincode: string;

    /** Number of demographic updates for age group 5-17 years */
    demo_age_5_17: number;

    /** Number of demographic updates for age group 17+ years */
    demo_age_17_: number;
}

/**
 * Aadhaar Biometric Updates Monthly Data
 * 
 * CSV Columns: date,state,district,pincode,bio_age_5_17,bio_age_17_
 * 
 * Represents monthly biometric update data (fingerprint, iris, photo) aggregated by location and age groups.
 * Dataset split across 4 files: ~1.86 million total records
 */
export interface AadhaarBiometricUpdateRecord {
    /** Date in DD-MM-YYYY format (e.g., "01-03-2025") */
    date: string;

    /** State name (e.g., "Maharashtra") */
    state: string;

    /** District name (e.g., "Ratnagiri", "Mumbai") */
    district: string;

    /** 6-digit pincode (e.g., "415620") */
    pincode: string;

    /** Number of biometric updates for age group 5-17 years */
    bio_age_5_17: number;

    /** Number of biometric updates for age group 17+ years */
    bio_age_17_: number;
}

// ============================================================================
// Data Loading Functions
// ============================================================================

/**
 * Parse CSV text into an array of objects
 * 
 * @param csvText - Raw CSV file content as string
 * @returns Array of parsed records as key-value objects
 */
function parseCSV<T>(csvText: string): T[] {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) return [];

    // Extract headers from first line
    const headers = lines[0].split(',').map(h => h.trim());

    // Parse data rows
    const records: T[] = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());

        // Skip empty lines
        if (values.length !== headers.length) continue;

        // Create record object
        const record: any = {};
        headers.forEach((header, index) => {
            const value = values[index];

            // Convert numeric columns to numbers
            if (header.startsWith('age_') || header.startsWith('demo_age_') || header.startsWith('bio_age_')) {
                record[header] = parseInt(value, 10) || 0;
            } else {
                record[header] = value;
            }
        });

        records.push(record as T);
    }

    return records;
}

/**
 * Load Aadhaar Enrolment Monthly Data
 * 
 * @returns Promise resolving to array of enrolment records
 */
export async function loadEnrolmentData(): Promise<AadhaarEnrolmentRecord[]> {
    try {
        const response = await fetch('/src/data/aadhaar_enrolment_monthly.csv');
        if (!response.ok) {
            throw new Error(`Failed to load enrolment data: ${response.statusText}`);
        }

        const csvText = await response.text();
        return parseCSV<AadhaarEnrolmentRecord>(csvText);
    } catch (error) {
        console.error('Error loading enrolment data:', error);
        return [];
    }
}

/**
 * Load Aadhaar Demographic Updates Monthly Data
 * 
 * @returns Promise resolving to array of demographic update records
 */
export async function loadDemographicUpdateData(): Promise<AadhaarDemographicUpdateRecord[]> {
    try {
        const response = await fetch('/src/data/aadhaar_demographic_updates_monthly.csv');
        if (!response.ok) {
            throw new Error(`Failed to load demographic update data: ${response.statusText}`);
        }

        const csvText = await response.text();
        return parseCSV<AadhaarDemographicUpdateRecord>(csvText);
    } catch (error) {
        console.error('Error loading demographic update data:', error);
        return [];
    }
}

/**
 * Load Aadhaar Biometric Updates Monthly Data
 * 
 * Loads data from 4 CSV files in parallel for optimal performance.
 * Total dataset: ~1.86 million records across 4 files.
 * 
 * @returns Promise resolving to array of biometric update records
 */
export async function loadBiometricUpdateData(): Promise<AadhaarBiometricUpdateRecord[]> {
    try {
        // Load all 4 CSV files in parallel
        const filePromises = [
            fetch('/src/data/api_data_aadhar_biometric/api_data_aadhar_biometric_0_500000.csv'),
            fetch('/src/data/api_data_aadhar_biometric/api_data_aadhar_biometric_500000_1000000.csv'),
            fetch('/src/data/api_data_aadhar_biometric/api_data_aadhar_biometric_1000000_1500000.csv'),
            fetch('/src/data/api_data_aadhar_biometric/api_data_aadhar_biometric_1500000_1861108.csv'),
        ];

        const responses = await Promise.all(filePromises);

        // Check all responses are OK
        for (const response of responses) {
            if (!response.ok) {
                throw new Error(`Failed to load biometric data: ${response.statusText}`);
            }
        }

        // Parse all CSV files in parallel
        const textPromises = responses.map(r => r.text());
        const csvTexts = await Promise.all(textPromises);

        // Parse and merge all data
        const allRecords: AadhaarBiometricUpdateRecord[] = [];
        csvTexts.forEach(csvText => {
            const records = parseCSV<AadhaarBiometricUpdateRecord>(csvText);
            allRecords.push(...records);
        });

        console.log(`Loaded ${allRecords.length.toLocaleString()} biometric update records`);
        return allRecords;
    } catch (error) {
        console.error('Error loading biometric update data:', error);
        return [];
    }
}

// ============================================================================
// Utility Functions for Data Analysis
// ============================================================================

/**
 * Get unique states from enrolment data
 * 
 * @param data - Array of enrolment records
 * @returns Array of unique state names, sorted alphabetically
 */
export function getUniqueStates(data: AadhaarEnrolmentRecord[] | AadhaarDemographicUpdateRecord[]): string[] {
    const states = new Set(data.map(record => record.state));
    return Array.from(states).sort();
}

/**
 * Get unique districts for a specific state
 * 
 * @param data - Array of enrolment or update records
 * @param state - State name to filter by
 * @returns Array of unique district names for the state, sorted alphabetically
 */
export function getDistrictsByState(
    data: AadhaarEnrolmentRecord[] | AadhaarDemographicUpdateRecord[],
    state: string
): string[] {
    const districts = new Set(
        data
            .filter(record => record.state === state)
            .map(record => record.district)
    );
    return Array.from(districts).sort();
}

/**
 * Filter enrolment data by date range
 * 
 * @param data - Array of enrolment records
 * @param startDate - Start date in DD-MM-YYYY format
 * @param endDate - End date in DD-MM-YYYY format
 * @returns Filtered array of records within the date range
 */
export function filterByDateRange<T extends { date: string }>(
    data: T[],
    startDate: string,
    endDate: string
): T[] {
    // Convert DD-MM-YYYY to comparable format YYYYMMDD
    const toComparable = (dateStr: string): number => {
        const [day, month, year] = dateStr.split('-');
        return parseInt(`${year}${month}${day}`, 10);
    };

    const start = toComparable(startDate);
    const end = toComparable(endDate);

    return data.filter(record => {
        const recordDate = toComparable(record.date);
        return recordDate >= start && recordDate <= end;
    });
}

/**
 * Aggregate enrolment data by state
 * 
 * @param data - Array of enrolment records
 * @returns Map of state names to total enrolments
 */
export function aggregateEnrolmentsByState(data: AadhaarEnrolmentRecord[]): Map<string, number> {
    const aggregated = new Map<string, number>();

    data.forEach(record => {
        const total = record.age_0_5 + record.age_5_17 + record.age_18_greater;
        const current = aggregated.get(record.state) || 0;
        aggregated.set(record.state, current + total);
    });

    return aggregated;
}

/**
 * Aggregate demographic updates by state
 * 
 * @param data - Array of demographic update records
 * @returns Map of state names to total updates
 */
export function aggregateUpdatesByState(data: AadhaarDemographicUpdateRecord[]): Map<string, number> {
    const aggregated = new Map<string, number>();

    data.forEach(record => {
        const total = record.demo_age_5_17 + record.demo_age_17_;
        const current = aggregated.get(record.state) || 0;
        aggregated.set(record.state, current + total);
    });

    return aggregated;
}

/**
 * Aggregate biometric updates by state
 * 
 * @param data - Array of biometric update records
 * @returns Map of state names to total biometric updates
 */
export function aggregateBiometricUpdatesByState(data: AadhaarBiometricUpdateRecord[]): Map<string, number> {
    const aggregated = new Map<string, number>();

    data.forEach(record => {
        const total = record.bio_age_5_17 + record.bio_age_17_;
        const current = aggregated.get(record.state) || 0;
        aggregated.set(record.state, current + total);
    });

    return aggregated;
}
