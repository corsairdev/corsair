# @corsair-dev/googleads

A Corsair plugin for integrating with Google Ads. This plugin provides OAuth authentication with developer-token support and exposes operations for managing campaigns and customer lists (offline user data).

## Authentication Setup

The Google Ads API requires an OAuth 2.0 access token **and** a Developer Token. You must also optionally specify a `loginCustomerId` if operating on behalf of a managed account.

```typescript
import { corsair } from 'corsair';
import { googleads } from '@corsair-dev/googleads';

const myCorsair = corsair({
  plugins: [
    googleads({
      // Required: Obtain this from the Google Ads API Center
      developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
      
      // Optional: Manager account ID (digits and optional dashes, e.g., "123-456-7890")
      loginCustomerId: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
    }),
  ],
});
```

### Endpoints Implemented

1. **`campaigns.getById`**: Fetches a single campaign by ID using GAQL.
2. **`campaigns.getByName`**: Fetches a campaign by name using GAQL.
3. **`customerLists.getMany`**: Lists available customer lists.
4. **`customerLists.create`**: Creates a new customer list.
5. **`customerLists.addOrRemove`**: An orchestration endpoint that creates an offline user data job, adds/removes hashed identifiers, and runs the job.

### Caching Quirks
Since Google Ads manages entities per customer account, the local DB caches for `campaigns` and `customerLists` use composite keys prefixed with the `customerId` to prevent cross-account collisions (e.g. `1234567890:12345`).
