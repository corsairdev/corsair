# Google Analytics 4 Plugin - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
# From workspace root
pnpm install
pnpm build
```

### 2. Google Cloud Project Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the following APIs:
   - Google Analytics Admin API (v1)
   - Google Analytics Data API (v1beta)
4. Create OAuth 2.0 credentials:
   - Application type: Web Application
   - Authorized redirect URIs: `https://your-corsair-domain/auth/callback`

### 3. Corsair Configuration

Configure the plugin in your Corsair setup:

```typescript
import { googleanalytics4 } from '@corsairdev/googleanalytics4';

// Use with default OAuth 2.0
const ga4Plugin = googleanalytics4();

// Or with custom permissions
const ga4Plugin = googleanalytics4({
  permissions: {
    'properties.create': true,
    'properties.update': false, // Block updates
    'customDimensions.create': false,
  },
});
```

### 4. Test the Connection

After setting up OAuth credentials:

```bash
# Run integration tests
pnpm test

# Build the plugin
pnpm build

# Verify registration in constants
grep -n "googleanalytics4" packages/corsair/core/constants.ts
```

## OAuth Setup Details

### Scopes

The plugin uses a single scope with read+write access:
```
https://www.googleapis.com/auth/analytics
```

This scope allows:
- Reading GA4 configuration (accounts, properties)
- Modifying property settings
- Creating custom dimensions/metrics
- Managing audiences
- Running reports
- Accessing realtime data

If you need read-only, a separate scope exists: `https://www.googleapis.com/auth/analytics.readonly`

### Token Lifecycle

- **Expiration**: 1 hour
- **Refresh**: Automatic 5 minutes before expiration
- **Retry**: 401 errors trigger force-refresh
- **Storage**: Managed by Corsair's credential system

### Multi-tenancy

Each user/customer gets their own OAuth token:
- Account ID and Property ID are tracked per credential
- Refresh tokens are securely stored
- No cross-tenant data leakage

## Common Issues

### "Authorization Required" Error

**Cause**: OAuth token is invalid or expired
**Solution**: 
1. Check that refresh token is stored correctly
2. Verify client_secret in Corsair configuration
3. Re-authorize the application

### "Property Not Found" Error

**Cause**: Using invalid property format or property ID
**Solution**:
1. List properties first: `properties.list`
2. Use full format: `properties/123456789`
3. Check account permissions

### Rate Limit (429) Errors

**Cause**: Exceeded quota (500K reports/day per property)
**Solution**:
1. Implement caching for repeated queries
2. Batch multiple reports into single requests
3. Wait before retrying (exponential backoff)
4. Check quota usage in GA4 admin

### "Invalid Measurement ID" Error

**Cause**: Measurement ID mismatch for Measurement Protocol
**Solution**:
1. Get measurement ID from data stream: `dataStreams.get`
2. Ensure you're using per-stream API secret (not OAuth token)
3. Verify client ID format

## Architecture Overview

```
┌─────────────────┐
│ Corsair Agent   │
└────────┬────────┘
         │
    ┌────▼────────────────────────────┐
    │ GA4 Plugin (googleanalytics4)   │
    ├────────────────────────────────┤
    │ ┌──────────────────────────────┤
    │ │ OAuth 2.0 Token Manager      │
    │ │ - Token refresh              │
    │ │ - Credential persistence     │
    │ └──────────────────────────────┤
    │ ┌──────────────────────────────┤
    │ │ Admin API (Config)           │
    │ │ - Accounts                   │
    │ │ - Properties                 │
    │ │ - Custom Dimensions/Metrics  │
    │ │ - Data Streams               │
    │ │ - Audiences                  │
    │ └──────────────────────────────┤
    │ ┌──────────────────────────────┤
    │ │ Data API (Reporting)         │
    │ │ - Standard Reports           │
    │ │ - Realtime Reports           │
    │ └──────────────────────────────┤
    │ ┌──────────────────────────────┤
    │ │ Measurement Protocol         │
    │ │ - Send Events                │
    │ │ - Validate Events            │
    │ └──────────────────────────────┤
    └────────┬────────────────────────┘
             │
    ┌────────▼──────────────────────┐
    │ Google Analytics 4 APIs       │
    ├──────────────────────────────┤
    │ • analyticsadmin.googleapis   │
    │ • analyticsdata.googleapis    │
    │ • www.google-analytics.com    │
    └──────────────────────────────┘
```

## Development

### Adding New Endpoints

1. Add Zod schema to `endpoints/types.ts`:
```typescript
export const YourEndpointInputSchema = z.object({
  // Define input
});
export const YourEndpointOutputSchema = z.object({
  // Define output
});
```

2. Implement endpoint in appropriate service file:
```typescript
export const YourService = {
  yourEndpoint: async (ctx: GA4Context, input: GA4EndpointInputs['yourEndpoint']) => {
    const accessToken = await ctx.auth();
    return await makeGA4Request({
      method: 'GET',
      endpoint: 'https://...',
      accessToken,
    });
  },
};
```

3. Register in `index.ts`:
- Add to endpoint type
- Add to nested structure
- Add to schema map
- Add metadata with risk level

### Testing

```bash
# Unit tests
pnpm test

# Type checking
pnpm typecheck

# Build
pnpm build

# Lint
pnpm lint
```

## Documentation Files

- **README.md** - User-facing API documentation
- **EXAMPLES.md** - Code examples and workflows
- **IMPLEMENTATION.md** - Architecture and design decisions
- **SETUP.md** - This file, deployment and setup

## Support

For issues:
1. Check error messages in error-handlers.ts
2. Verify OAuth credentials and scopes
3. Check GA4 API documentation
4. Review example usage in EXAMPLES.md

## API Documentation References

- [Admin API](https://developers.google.com/analytics/devguides/config/admin/v1)
- [Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference)
