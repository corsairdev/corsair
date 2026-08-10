# Google Analytics 4 Integration

This package provides full Google Analytics 4 API integration for Corsair, enabling agents to read GA4 reporting data and manage property configuration.

## Features

### Admin API (Configuration Management)
- **Accounts**: Get and list Google Analytics accounts
- **Properties**: Create, read, list, and update GA4 properties
- **Custom Dimensions**: Create and list custom dimensions
- **Custom Metrics**: Create and list custom metrics
- **Data Streams**: List and retrieve data stream configurations
- **Audiences**: Create and list audiences with filter clauses

### Data API (Reporting)
- **Standard Reports**: Run reports with metrics, dimensions, filters, and ordering
- **Realtime Reports**: Get realtime analytics data
- **Batch Reports**: Support for large-scale reporting (v1alpha)
- **Metadata & Quotas**: Query available dimensions/metrics and property quotas

### Measurement Protocol
- **Server-side Events**: Send events directly via the Measurement Protocol
- **Event Validation**: Validate event payloads before sending
- **Per-stream Authentication**: Uses measurement ID and API secret for authentication

## Installation

```bash
pnpm add @corsairdev/googleanalytics4
```

## Authentication

The plugin uses OAuth 2.0 against `accounts.google.com` with the scope:
```
https://www.googleapis.com/auth/analytics
```

Token refresh and 401 retry are handled automatically.

### Setup

1. Create a Google Cloud project with GA4 API enabled
2. Create OAuth 2.0 credentials (Web Application type)
3. Configure the authorized redirect URIs for your Corsair deployment
4. Provide the credentials to Corsair during plugin initialization

## Usage

```typescript
import { googleanalytics4 } from '@corsairdev/googleanalytics4';

const ga4 = googleanalytics4({
  authType: 'oauth_2',
  // Credentials will be fetched from Corsair's auth system
});
```

## API Reference

### Accounts

#### `accounts.get`
Retrieve a specific account.
```typescript
{
  name: "accounts/12345"
}
```

#### `accounts.list`
List all accessible accounts.
```typescript
{
  pageSize?: number,
  pageToken?: string
}
```

### Properties

#### `properties.get`
Retrieve property details.
```typescript
{
  name: "properties/12345"
}
```

#### `properties.list`
List properties with optional filters.
```typescript
{
  filter?: string,  // e.g., "parent:accounts/12345"
  pageSize?: number,
  pageToken?: string
}
```

#### `properties.create`
Create a new property.
```typescript
{
  displayName: string,
  parentAccount: string,  // "accounts/12345"
  timeZone: string,       // e.g., "America/Los_Angeles"
  currencyCode?: string   // e.g., "USD"
}
```

#### `properties.update`
Update property configuration.
```typescript
{
  name: string,
  displayName?: string,
  timeZone?: string,
  currencyCode?: string,
  updateMask?: string  // Comma-separated fields to update
}
```

### Custom Dimensions

#### `customDimensions.list`
List custom dimensions for a property.
```typescript
{
  parent: string,  // "properties/12345"
  pageSize?: number,
  pageToken?: string
}
```

#### `customDimensions.create`
Create a custom dimension.
```typescript
{
  parent: string,
  customDimension: {
    parameterName: string,
    displayName: string,
    description?: string,
    scope: 'EVENT' | 'USER' | 'ITEM',
    disallowAdsPersonalization?: boolean
  }
}
```

### Custom Metrics

#### `customMetrics.list`
List custom metrics for a property.
```typescript
{
  parent: string,
  pageSize?: number,
  pageToken?: string
}
```

#### `customMetrics.create`
Create a custom metric.
```typescript
{
  parent: string,
  customMetric: {
    parameterName: string,
    displayName: string,
    description?: string,
    measurementUnit: 'STANDARD' | 'CURRENCY' | 'FEET' | 'METERS' | 'KILOMETERS' | 'MILES',
    scope: 'EVENT',
    restrictedMetricType?: string[]
  }
}
```

### Data Streams

#### `dataStreams.list`
List data streams for a property.
```typescript
{
  parent: string,  // "properties/12345"
  pageSize?: number,
  pageToken?: string
}
```

#### `dataStreams.get`
Retrieve a specific data stream.
```typescript
{
  name: string  // "properties/12345/dataStreams/987654"
}
```

### Audiences

#### `audiences.list`
List audiences for a property.
```typescript
{
  parent: string,
  pageSize?: number,
  pageToken?: string
}
```

#### `audiences.create`
Create an audience with filter clauses.
```typescript
{
  parent: string,
  audience: {
    displayName: string,
    description?: string,
    membershipDurationDays?: number,
    filterClauses?: Array<{
      clauseType: 'ORed' | 'ANDed',
      simpleOperand?: {
        scope: 'EVENT' | 'USER',
        filterExpression: string  // CE filter expression
      }
    }>,
    exclusionDurationMode?: 'EXCLUSION_DURATION_MODE_UNSPECIFIED' | 'EXCLUDE_TEMPORARILY' | 'EXCLUDE_PERMANENTLY'
  }
}
```

### Reporting

#### `reporting.runReport`
Run a standard GA4 report.
```typescript
{
  property: string,  // "properties/12345"
  dateRanges: Array<{
    startDate: string,    // "YYYY-MM-DD"
    endDate: string,
    name?: string
  }>,
  metrics: Array<{
    name: string  // e.g., "activeUsers", "sessions"
  }>,
  dimensions?: Array<{
    name: string  // e.g., "country", "deviceCategory"
  }>,
  filters?: Array<{
    fieldName: string,
    value: string,
    stringFilter?: {
      matchType: 'EXACT' | 'BEGINS_WITH' | 'ENDS_WITH' | 'CONTAINS' | 'FULL_REGEXP' | 'PARTIAL_REGEXP',
      value: string,
      caseSensitive?: boolean
    }
  }>,
  orderBys?: Array<{
    metric?: { metricName: string },
    dimension?: { dimensionName: string, orderType: 'ALPHABETIC' | 'NUMERIC' | 'DIMENSION_UNSPECIFIED' },
    desc?: boolean
  }>,
  limit?: number,  // Default: 10000
  offset?: number,
  keepEmptyRows?: boolean,
  returnPropertyQuota?: boolean
}
```

#### `reporting.runRealtimeReport`
Run a realtime report.
```typescript
{
  property: string,
  metrics: Array<{
    name: string
  }>,
  dimensions?: Array<{
    name: string
  }>,
  minuteRanges?: Array<{
    startMinutesAgo: number,
    endMinutesAgo?: number,
    name?: string
  }>,
  limit?: number,
  orderBys?: Array<{
    metric?: { metricName: string },
    dimension?: { dimensionName: string },
    desc?: boolean
  }>,
  returnPropertyQuota?: boolean
}
```

### Measurement Protocol

#### `measurementProtocol.sendEvent`
Send server-side events to GA4.
```typescript
{
  measurementId: string,
  apiSecret: string,  // Per-stream secret (not OAuth token)
  clientId: string,
  userId?: string,
  events: Array<{
    name: string,
    params?: Record<string, any>
  }>,
  userProperties?: Record<string, any>,
  timestamp?: number  // Milliseconds since epoch
}
```

#### `measurementProtocol.validate`
Validate Measurement Protocol events without sending.
```typescript
{
  measurementId: string,
  apiSecret: string,
  clientId: string,
  events: Array<{
    name: string,
    params?: Record<string, any>
  }>
}
```

## Rate Limiting

GA4 enforces per-project and per-property quotas. The plugin handles 429 (rate limit) errors and surfaces them to Corsair for retry logic.

## Error Handling

The plugin provides detailed error messages for:
- `AUTH_ERROR`: Authentication or authorization failures
- `RATE_LIMIT_ERROR`: Quota exceeded
- `NOT_FOUND_ERROR`: Resource not found
- `BAD_REQUEST_ERROR`: Invalid request parameters
- `SERVER_ERROR`: GA4 API server errors
- `NETWORK_ERROR`: Network connectivity issues

## Multi-Version Support

The plugin supports:
- **Admin API**: v1 (stable) and v1beta/v1alpha (newer methods like audience lists and report tasks)
- **Data API**: v1beta (preferred) and v1alpha
- **Measurement Protocol**: Current stable version

Note: Some advanced features (audience lists, report tasks, funnel reports, attribution/google-signals settings) are only available in v1alpha endpoints.

## Permissions

The plugin supports fine-grained permission controls. You can restrict agent access to specific endpoints using dot-notation paths:

```typescript
googleanalytics4({
  permissions: {
    'properties.update': false,  // Prevent property modification
    'customDimensions.create': false,
    'measurementProtocol.sendEvent': false,
  }
})
```

## License

MIT
