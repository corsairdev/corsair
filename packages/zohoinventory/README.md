# Zoho Inventory Plugin for Corsair

Production-quality integration plugin for [Zoho Inventory](https://www.zoho.com/inventory/), providing agentic access to organizations, items, contacts, and users with OAuth 2 authentication and multi-tenant organization routing.

## Features

- **Authentication**: Standard OAuth 2.0 with automatic token refresh and managed auth compatibility.
- **Multi-Tenant Routing**: Automatic `tenant_external_id` mapping to Zoho Inventory `organization_id` post-OAuth via `GET /organizations`.
- **Regional Datacenters**: Support for US (`com`), EU (`eu`), India (`in`), Australia (`com.au`), Japan (`jp`), Canada (`ca`), China (`com.cn`), and Saudi Arabia (`sa`), plus custom API domain overrides.
- **Endpoints**:
  - `organizations.list`: Discover Zoho Inventory organizations.
  - `items.list`: List inventory items with pagination and search.
  - `contacts.list`: List contacts (customers & vendors) with filtering.
  - `users.list`: List users associated with an organization.
- **Error Handling**: Typed mapping for rate limits, authentication failures, insufficient permissions, and invalid organization IDs.

## OAuth Scopes

The plugin requests the minimum required read scopes:
- `ZohoInventory.settings.READ`: Access organization and user settings.
- `ZohoInventory.items.READ`: Access inventory items.
- `ZohoInventory.contacts.READ`: Access contacts and customer/vendor details.

## Quick Start

```typescript
import { createCorsair } from 'corsair/core';
import { zohoinventory } from '@corsair-dev/zohoinventory';

const corsair = createCorsair({
  plugins: [
    zohoinventory({
      region: 'us', // 'us' | 'eu' | 'in' | 'au' | 'jp' | 'ca' | 'cn' | 'sa'
    }),
  ],
});

// List organizations
const orgs = await corsair.zohoinventory.api.organizations.list({});

// List items for an organization
const items = await corsair.zohoinventory.api.items.list({
  organization_id: '102345678',
  per_page: 50,
});
```
