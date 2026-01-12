# Aadhaar Data Service

This directory contains official Government of India Aadhaar datasets and the data service layer for loading and processing them.

## 📁 Dataset Files

### 1. `aadhaar_enrolment_monthly.csv`
**Columns:**
- `date` - Date in DD-MM-YYYY format
- `state` - State name
- `district` - District name
- `pincode` - 6-digit pincode
- `age_0_5` - Enrolments for age group 0-5 years
- `age_5_17` - Enrolments for age group 5-17 years
- `age_18_greater` - Enrolments for age group 18+ years

**Total Records:** ~93,186 rows  
**Data Type:** Anonymized, aggregate monthly enrolment data

### 2. `aadhaar_demographic_updates_monthly.csv`
**Columns:**
- `date` - Date in DD-MM-YYYY format
- `state` - State name
- `district` - District name
- `pincode` - 6-digit pincode
- `demo_age_5_17` - Demographic updates for age group 5-17 years
- `demo_age_17_` - Demographic updates for age group 17+ years

**Total Records:** ~183,247 rows  
**Data Type:** Anonymized, aggregate monthly demographic update data

## 🔧 Data Service API

### TypeScript Interfaces

```typescript
import { 
  AadhaarEnrolmentRecord, 
  AadhaarDemographicUpdateRecord 
} from '@/data/dataService';
```

### Loading Data

```typescript
import { loadEnrolmentData, loadDemographicUpdateData } from '@/data/dataService';

// Load enrolment data
const enrolments = await loadEnrolmentData();
console.log(`Loaded ${enrolments.length} enrolment records`);

// Load demographic update data
const updates = await loadDemographicUpdateData();
console.log(`Loaded ${updates.length} update records`);
```

### Utility Functions

#### Get Unique States
```typescript
import { getUniqueStates } from '@/data/dataService';

const states = getUniqueStates(enrolments);
// Returns: ["Maharashtra", ...]
```

#### Get Districts by State
```typescript
import { getDistrictsByState } from '@/data/dataService';

const districts = getDistrictsByState(enrolments, "Maharashtra");
// Returns: ["Ahmadnagar", "Mumbai", "Pune", ...]
```

#### Filter by Date Range
```typescript
import { filterByDateRange } from '@/data/dataService';

const filtered = filterByDateRange(
  enrolments,
  "01-09-2025",  // Start date
  "05-09-2025"   // End date
);
```

#### Aggregate by State
```typescript
import { 
  aggregateEnrolmentsByState, 
  aggregateUpdatesByState 
} from '@/data/dataService';

// Get total enrolments per state
const enrolmentsByState = aggregateEnrolmentsByState(enrolments);
console.log(enrolmentsByState.get("Maharashtra")); // Total count

// Get total updates per state
const updatesByState = aggregateUpdatesByState(updates);
console.log(updatesByState.get("Maharashtra")); // Total count
```

## 📊 Usage Example in Components

```typescript
import { useEffect, useState } from 'react';
import { 
  loadEnrolmentData, 
  AadhaarEnrolmentRecord,
  aggregateEnrolmentsByState 
} from '@/data/dataService';

function MyComponent() {
  const [data, setData] = useState<AadhaarEnrolmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const enrolments = await loadEnrolmentData();
      setData(enrolments);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  const stateAggregates = aggregateEnrolmentsByState(data);
  
  return (
    <div>
      <h2>Total Enrolments by State</h2>
      {Array.from(stateAggregates.entries()).map(([state, count]) => (
        <div key={state}>{state}: {count}</div>
      ))}
    </div>
  );
}
```

## ⚠️ Important Notes

1. **Static Data**: All CSV files are treated as static, read-only data sources
2. **No Backend**: Data is loaded directly from CSV files via HTTP fetch
3. **Column Names**: Interface properties match exact CSV column names
4. **Date Format**: All dates are in DD-MM-YYYY format
5. **Aggregation**: Data is pre-aggregated at pincode level
6. **Anonymized**: All data is anonymized and contains no personally identifiable information

## 🚀 Performance Considerations

- CSV files are loaded on-demand via async functions
- Consider caching loaded data in component state or global state management
- For large datasets, consider implementing pagination or virtual scrolling
- Use utility functions for filtering to avoid processing entire datasets repeatedly

## 📝 Data Integrity

- All numeric columns are parsed as integers
- Empty or invalid values default to 0
- Malformed CSV rows are skipped during parsing
- Error handling is built into all loading functions
