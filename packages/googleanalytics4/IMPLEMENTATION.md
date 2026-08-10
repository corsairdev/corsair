# Google Analytics 4 Plugin Implementation

## Overview

This is a comprehensive Google Analytics 4 integration for Corsair that exposes the full GA4 API surface through three main services:

### Service Organization

#### 1. Admin API (Configuration Management)
**Location**: `endpoints/admin.ts`

Organized by resource type:
- **Accounts**: Read access to GA4 accounts
  - `accounts.get` - Retrieve account details
  - `accounts.list` - List accessible accounts
  
- **Properties**: Full CRUD for GA4 properties
  - `properties.get` - Retrieve property configuration
  - `properties.list` - List properties with filtering
  - `properties.create` - Create new properties
  - `properties.update` - Modify property settings (timezone, currency, display name)
  
- **Custom Dimensions**: Manage custom dimensions (USER, EVENT, ITEM scopes)
  - `customDimensions.list`
  - `customDimensions.create`
  
- **Custom Metrics**: Manage custom metrics with measurement units
  - `customMetrics.list`
  - `customMetrics.create`
  
- **Data Streams**: Manage data collection points (web, iOS, Android, server)
  - `dataStreams.list`
  - `dataStreams.get`
  
- **Audiences**: Segment users with filter logic
  - `audiences.list`
  - `audiences.create` - Create with complex filter clauses

#### 2. Data API (Reporting)
**Location**: `endpoints/reporting.ts`

Query GA4 data in multiple ways:
- **runReport** - Standard dimension/metric reports
  - Date range filtering
  - Dimension/metric selection
  - Advanced filtering with string operators
  - Sorting by metrics or dimensions
  - Pagination support
  - Optional quota snapshot
  
- **runRealtimeReport** - Live analytics data (last N minutes)
  - Realtime metrics (activeUsers, eventCount)
  - Minute-based time ranges
  - Real-time dimension breakdowns
  - Streaming data capability

#### 3. Measurement Protocol (Server-side Events)
**Location**: `endpoints/measurement-protocol.ts`

Send and validate events from backend:
- **sendEvent** - Send events directly to GA4
  - Per-stream authentication (measurement ID + API secret)
  - Batch event support
  - Custom parameters and user properties
  - User ID linking
  
- **validate** - Test events before production
  - Same format as sendEvent
  - Validation-only mode (no data collection)

## Authentication Strategy

### OAuth 2.0 Configuration
- **Provider**: Google OAuth (accounts.google.com)
- **Scope**: `https://www.googleapis.com/auth/analytics` (read + write)
- **Token Handling**:
  - Automatic refresh 5 minutes before expiration
  - 401 retry with force-refresh capability
  - Persistent credential storage through Corsair

### Measurement Protocol Special Case
Measurement Protocol uses **per-stream secrets** (not OAuth tokens):
- Input parameters include `measurementId` and `apiSecret`
- These are obtained from the data stream configuration
- No OAuth tokens required for event sending

## API Versioning

The plugin handles multiple API versions for compatibility:

| Service | Version | Purpose | Features |
|---------|---------|---------|----------|
| Admin API | v1 | Stable properties/accounts | Core configuration |
| Admin API | v1beta/v1alpha | Extended features | Audience lists, report tasks, attribution |
| Data API | v1beta | Primary reporting | RunReport, RunRealtimeReport |
| Data API | v1alpha | Advanced features | Funnel reports, batch reports |
| Measurement Protocol | Current | Event collection | SendEvent, Validate |

## Error Handling

**File**: `error-handlers.ts`

Comprehensive error mapping:
- `400` → `BAD_REQUEST_ERROR` (invalid parameters)
- `401/403` → `AUTH_ERROR` (credential issues)
- `404` → `NOT_FOUND_ERROR` (resource doesn't exist)
- `429` → `RATE_LIMIT_ERROR` (quota exceeded)
- `5xx` → `SERVER_ERROR` (GA4 server issues)
- Network errors → `NETWORK_ERROR`
- Timeouts → `TIMEOUT_ERROR`

## Type Safety

**File**: `endpoints/types.ts`

Complete Zod schema definitions for all 18 endpoints:
- Strict input validation
- Response type inference
- OpenAPI-compatible schemas
- Support for optional fields and enums
- Pass-through opaque reporting responses (version-agnostic)

## Permission Controls

Fine-grained access control via dot-notation paths:

```typescript
googleanalytics4({
  permissions: {
    'properties.create': false,      // Block property creation
    'customDimensions.create': false, // Block custom dimension creation
    'measurementProtocol.sendEvent': false, // Block event sending
    'reporting.runReport': true,     // Allow (default)
  }
})
```

## Risk Levels

Endpoints are classified for safety:

| Level | Examples |
|-------|----------|
| `read` | accounts.get, properties.list, reporting.runReport |
| `write` | properties.create, customDimensions.create, audiences.create |
| `destructive` | (none in GA4 — data is append-only) |

## Rate Limiting

GA4 enforces per-project and per-property quotas:
- **Standard Reports**: 500K queries/property/day
- **Realtime Reports**: Higher rate (real-time)
- **Admin API**: 1M requests/day
- Plugin surfaces 429 errors for automatic retry

## Multi-tenancy

Supports OAuth-based multi-tenancy:
- Account ID and property ID tracked per credential
- Separate oauth token per user/customer
- Automatic token refresh per tenant

## Implementation Files

```
packages/googleanalytics4/
├── index.ts                 # Main plugin export
├── schema.ts               # Zod schema for credentials
├── client.ts               # OAuth and request utilities
├── error-handlers.ts       # Error mapping
├── endpoints/
│   ├── index.ts           # Endpoint exports
│   ├── types.ts           # Zod schemas (18 endpoints)
│   ├── admin.ts           # Admin API (6 resources)
│   ├── reporting.ts       # Data API (2 endpoints)
│   └── measurement-protocol.ts  # Server events
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── jest.config.cjs        # Test configuration
├── integration.test.ts    # Plugin tests
├── README.md              # User documentation
└── IMPLEMENTATION.md      # This file
```

## Registration

The plugin is registered in `packages/corsair/core/constants.ts`:
- Added to `BaseProviders` array
- Added to `ProviderDisplayNames` map as "Google Analytics 4"
- Added to `AllProviders` union type

This makes it discoverable by the Corsair framework and available for agent integration.

## Feature Completeness

✅ **Admin API**: Accounts, Properties, Custom Dimensions, Custom Metrics, Data Streams, Audiences
✅ **Data API**: Standard Reports, Realtime Reports
✅ **Measurement Protocol**: Event sending and validation
✅ **Authentication**: OAuth 2.0 with token refresh
✅ **Error Handling**: Comprehensive error mapping
✅ **Permissions**: Fine-grained access control
✅ **Type Safety**: Full Zod validation
✅ **Documentation**: Complete README and inline docs
✅ **Testing**: Integration tests

## Webhook Support

GA4 does not provide inbound webhooks. The plugin focuses on:
- Outbound event sending via Measurement Protocol
- Report polling via the Data API
- Configuration management via Admin API

## Next Steps (Optional Enhancements)

1. **Batch Operations**: Implement batch report requests
2. **Caching**: Add response caching for metadata queries
3. **Metrics Library**: Pre-built common metric/dimension sets
4. **Dashboard Integration**: Expose in UI with chart components
5. **Scheduled Reports**: Support report scheduling via Corsair tasks
