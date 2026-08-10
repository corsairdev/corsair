# Google Analytics 4 Plugin - File Structure

## Directory Layout

```
packages/googleanalytics4/
│
├── Core Files
│   ├── index.ts                     # Main plugin export & configuration
│   ├── schema.ts                    # Zod schema for GA4 credentials
│   ├── client.ts                    # OAuth token management & HTTP utilities
│   └── error-handlers.ts            # GA4 error mapping
│
├── Endpoints
│   └── endpoints/
│       ├── index.ts                 # Endpoint exports
│       ├── types.ts                 # 18 Zod schemas for all endpoints
│       ├── admin.ts                 # 6 Admin API services (accounts, properties, etc)
│       ├── reporting.ts             # 2 Data API endpoints (reports)
│       └── measurement-protocol.ts  # 2 Measurement Protocol endpoints
│
├── Configuration
│   ├── package.json                 # Dependencies & build scripts
│   ├── tsconfig.json                # TypeScript configuration
│   ├── tsup.config.ts               # Build tool config
│   ├── jest.config.cjs              # Test runner config
│   └── .gitignore                   # Git ignore patterns
│
├── Documentation
│   ├── README.md                    # Complete API reference
│   ├── EXAMPLES.md                  # Usage examples & workflows
│   ├── IMPLEMENTATION.md            # Architecture decisions
│   ├── SETUP.md                     # Deployment & setup guide
│   └── PLUGIN_STRUCTURE.md          # This file
│
└── Tests
    └── integration.test.ts          # Plugin initialization tests
```

## File Responsibilities

### Core Layer

#### `index.ts` (450+ lines)
**Primary plugin definition and configuration**
- Exports `googleanalytics4()` factory function
- Defines plugin types and interfaces
  - `GA4PluginOptions` - Configuration options
  - `GA4Endpoints` - Typed endpoint definitions
  - `GA4Context` - Plugin execution context
- Implements OAuth configuration
- Implements token refresh lifecycle
- Implements permission controls
- Registers all 18 endpoints
- Defines endpoint metadata (risk levels, descriptions)
- Handles auth errors and retry logic

#### `schema.ts` (15 lines)
**GA4 credential schema**
- Zod schema for required credentials
  - `account_id` - GA4 account identifier
  - `property_id` - GA4 property identifier
  - `measurement_id` - Optional, for Measurement Protocol
  - `api_secret` - Optional, per-stream secret

#### `client.ts` (90+ lines)
**HTTP client and token management**
- `GA4APIError` class - Custom error type
- `getValidGA4AccessToken()` - OAuth refresh logic
  - 5-minute expiration buffer
  - Force-refresh on 401
  - Token persistence hooks
- `makeGA4Request()` - Standardized HTTP requests
  - Bearer token injection
  - Error handling

#### `error-handlers.ts` (50+ lines)
**Error mapping and formatting**
- Maps HTTP status codes to Corsair error types
- Handles network/timeout errors
- Provides meaningful error messages
- Supports error recovery suggestions

### Endpoints Layer

#### `endpoints/types.ts` (400+ lines)
**Zod validation schemas**
- 18 input schemas (request validation)
- 18 output schemas (response typing)
- Type inference for TypeScript
- Enums for constrained values
  - Dimension/metric scopes (EVENT, USER, ITEM)
  - Measurement units (CURRENCY, METERS, etc)
  - Filter operators (EXACT, CONTAINS, REGEXP)
  - Filter clause types (ORed, ANDed)

**Endpoint coverage**:
- Admin API: Accounts (2), Properties (4), Custom Dimensions (2), Custom Metrics (2), Data Streams (2), Audiences (2)
- Data API: Reports (2)
- Measurement Protocol: Events (2)

#### `endpoints/admin.ts` (200+ lines)
**Admin API implementations**
- `Accounts` service
  - `get()` - Retrieve account
  - `list()` - List accessible accounts
- `Properties` service
  - `get()` - Retrieve property
  - `list()` - List properties with filtering
  - `create()` - Create new property
  - `update()` - Modify property settings (timezone, currency, name)
- `CustomDimensions` service
  - `list()` - List custom dimensions
  - `create()` - Create custom dimension (USER/EVENT/ITEM scopes)
- `CustomMetrics` service
  - `list()` - List custom metrics
  - `create()` - Create custom metric
- `DataStreams` service
  - `list()` - List data streams
  - `get()` - Retrieve stream (includes measurement ID)
- `Audiences` service
  - `list()` - List audiences
  - `create()` - Create audience with filter logic

#### `endpoints/reporting.ts` (50+ lines)
**Data API implementations**
- `Reporting` service
  - `runReport()` - Standard reports
    - Date ranges, metrics, dimensions
    - Filtering, sorting, pagination
    - Optional quota snapshots
  - `runRealtimeReport()` - Live data
    - Minute-based time ranges
    - Realtime metrics (activeUsers, eventCount)
    - Instant data delivery

#### `endpoints/measurement-protocol.ts` (60+ lines)
**Measurement Protocol implementations**
- `MeasurementProtocol` service
  - `sendEvent()` - Send events to GA4
    - Per-stream authentication (measurement ID + API secret)
    - Batch events support
    - User ID linking
    - Custom parameters
  - `validate()` - Validate without sending
    - Same format as sendEvent
    - Returns validation messages

### Configuration Files

#### `package.json`
```json
{
  "name": "@corsairdev/googleanalytics4",
  "version": "0.0.1",
  "main": "./dist/index.js",
  "exports": {
    ".": { "types": "./dist/index.d.ts", ... }
  },
  "dependencies": {
    "corsair": "workspace:*",
    "zod": "^3.22.4"
  }
}
```

#### `tsconfig.json`
Extends root tsconfig with:
- `outDir: "./dist"` - Build output
- `declaration: true` - Generate .d.ts files
- Excludes dist, node_modules, tests

#### `tsup.config.ts`
Build configuration:
- Formats: CommonJS + ESM
- Declaration maps enabled
- Source maps enabled
- Automatic cleanup

#### `jest.config.cjs`
Test configuration:
- TypeScript support (ts-jest)
- Node environment
- Pattern matching for test files

### Documentation

#### `README.md`
- Feature overview
- Installation
- Auth setup
- Complete API reference (18 endpoints)
- Rate limiting notes
- Error handling guide
- Permission controls
- Multi-version support

#### `EXAMPLES.md`
- Initialization patterns
- Admin API examples (6 services)
- Data API examples (reports + realtime)
- Measurement Protocol examples
- Real-world agent workflows
- Error handling examples

#### `IMPLEMENTATION.md`
- Architecture overview
- Service organization (3 layers)
- Authentication strategy
- API versioning matrix
- Error mapping strategy
- Type safety approach
- Permission controls
- Rate limiting handling
- Multi-tenancy support
- Feature completeness checklist

#### `SETUP.md`
- Quick start (4 steps)
- Google Cloud project setup
- Corsair configuration
- OAuth setup details
- Troubleshooting guide
- Architecture diagram
- Development guide

#### `PLUGIN_STRUCTURE.md`
- This file
- Directory layout
- File responsibilities
- Lines of code per file
- Key functions/classes

### Testing

#### `integration.test.ts`
Tests plugin initialization:
- Plugin ID and registration
- OAuth configuration
- Endpoint availability
- Endpoint metadata
- Permission configuration

## Lines of Code Summary

| File | Lines | Purpose |
|------|-------|---------|
| index.ts | 450+ | Main plugin export |
| endpoints/admin.ts | 200+ | Admin API |
| endpoints/types.ts | 400+ | Schemas |
| endpoints/reporting.ts | 50+ | Data API |
| endpoints/measurement-protocol.ts | 60+ | Measurement Protocol |
| client.ts | 90+ | OAuth & HTTP |
| error-handlers.ts | 50+ | Error mapping |
| integration.test.ts | 80+ | Tests |
| README.md | 350+ | API docs |
| EXAMPLES.md | 300+ | Usage examples |
| IMPLEMENTATION.md | 300+ | Architecture |
| SETUP.md | 250+ | Setup guide |
| **Total** | **~2,600** | **Complete plugin** |

## Data Flow

```
┌─────────────────┐
│ Agent Request   │
└────────┬────────┘
         │
    ┌────▼──────────────┐
    │ Endpoint Handler  │
    │ (admin.ts, etc)   │
    └────┬──────────────┘
         │
    ┌────▼──────────────┐
    │ Auth Check        │
    │ (keyBuilder)      │
    └────┬──────────────┘
         │
    ┌────▼────────────────┐
    │ Token Validation    │
    │ (client.ts)         │
    │ - Check expiry      │
    │ - Refresh if needed │
    └────┬───────────────┘
         │
    ┌────▼──────────────────┐
    │ makeGA4Request()      │
    │ - Add Bearer token    │
    │ - Set Content-Type    │
    │ - Encode body         │
    └────┬─────────────────┘
         │
    ┌────▼──────────────────┐
    │ Google Analytics API  │
    └────┬─────────────────┘
         │
    ┌────▼──────────────────┐
    │ Response Processing   │
    │ - Check status        │
    │ - Parse JSON          │
    │ - Cast to type        │
    └────┬─────────────────┘
         │
    ┌────▼──────────────────┐
    │ Error Mapping         │
    │ (error-handlers.ts)   │
    └────┬─────────────────┘
         │
    ┌────▼──────────────┐
    │ Return to Agent   │
    └───────────────────┘
```

## Extensibility Points

### Adding New Admin Endpoints
1. Add schema to `endpoints/types.ts`
2. Add function to appropriate service in `endpoints/admin.ts`
3. Register in `index.ts` nested structure
4. Add to schema map and metadata

### Custom Error Handling
- Extend `error-handlers.ts` with custom logic
- Return custom error types via `CorsairErrorHandler`

### Permission Controls
- Use `permissions` option in `googleanalytics4({})`
- Dot-notation paths automatically validated

### Token Lifecycle Customization
- Override `keyBuilder` in plugin options
- Access credential storage via `ctx.keys`

## Integration Points

### With Corsair Core
- Plugin registration in `packages/corsair/core/constants.ts`
- Type integration via `CorsairPlugin<>`
- OAuth flow integration
- Permission framework
- Error handling framework

### With Google APIs
- Admin API v1 / v1beta / v1alpha
- Data API v1beta / v1alpha
- Measurement Protocol (stable)
- OAuth 2.0 (accounts.google.com)
