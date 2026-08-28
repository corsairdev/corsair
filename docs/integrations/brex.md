---
title: Brex
description: Connect Corsair to Brex financial APIs for corporate cards, spend management, budgets, vendors, and expense tracking.
---

# Brex Integration

The **Brex** plugin integrates Corsair directly with Brex's enterprise financial APIs, enabling seamless programmatic control over corporate cards, real-time expense and receipt tracking, budget enforcement, vendor management, and event-driven webhook ingestion.

---

## 🔐 Authentication

The Brex plugin supports multiple authentication schemes depending on your deployment architecture and security requirements:

### 1. OAuth 2.0
- **Authorization Code Flow**: Ideal for multi-tenant SaaS applications allowing users to authorize Corsair to act on behalf of their Brex organization.
- **Client Credentials**: Suited for machine-to-machine integrations with service account access.

```typescript
// OAuth 2.0 configuration
await corsair.withTenant('tenant_123').brex.auth.setOAuth({
  clientId: process.env.BREX_CLIENT_ID!,
  clientSecret: process.env.BREX_CLIENT_SECRET!,
  accessToken: process.env.BREX_ACCESS_TOKEN!,
  refreshToken: process.env.BREX_REFRESH_TOKEN,
});
```

### 2. User API Key / User Token
Direct token authentication for custom scripts, internal tools, and dedicated workspaces.

```typescript
// User Token / API Key configuration
await corsair.withTenant('tenant_123').brex.auth.setApiKey(
  process.env.BREX_API_TOKEN!
);
```

---

## 🚀 Key Features & Operations

The Brex plugin provides high-level typed actions and sync engines across several core domains:

### 💳 Card Management
Provision and retrieve virtual and physical corporate card details securely with PCI-compliant token handling.
- `BREX_CREATE_CARD` — Issue new virtual or physical cards with designated spending rules.
- `BREX_GET_CARD_DETAILS` — Retrieve metadata, status, limits, and cardholder information.
- `BREX_GET_CARD_NUMBER` — Securely fetch encrypted card credentials and PAN data.
- `BREX_LOCK_CARD` / `BREX_TERMINATE_CARD` — Instantly suspend or cancel cards.

### 🧾 Expense & Receipt Management
Automate expense reconciliation, receipt capture, and matching workflows.
- `BREX_CREATE_EXPENSE` — Log and categorize expenses directly into the ledger.
- `BREX_RECEIPT_UPLOAD` — Upload raw receipt files and images for OCR and bookkeeping.
- `BREX_RECEIPT_MATCH` — Attach and reconcile uploaded receipts with corresponding card transactions.
- `BREX_LIST_EXPENSES` — Query and filter settled and pending card transactions.

### 📊 Budgets & Spend Limits
Enforce real-time corporate spend policies across teams and departments.
- `BREX_CREATE_BUDGET` — Allocate programmatic spending allowances to entities or cost centers.
- `BREX_CREATE_SPEND_LIMIT` — Define automated thresholds and auto-declining rules.
- `BREX_ARCHIVE_BUDGET` — Deactivate expired or obsolete budget lines.
- `BREX_GET_BUDGET_USAGE` — Monitor real-time balance utilization against budget caps.

### 🏢 Vendors & Webhooks
Manage accounts payable vendors and subscribe to real-time financial events.
- `BREX_CREATE_VENDOR` — Register verified merchant and vendor profiles.
- `BREX_CREATE_WEBHOOK_SUBSCRIPTION` — Register endpoints to receive instant event notifications (transfers, card swipes, expense updates).
- `BREX_DELETE_WEBHOOK_SUBSCRIPTION` — Tear down obsolete event webhook subscriptions.

---

## 💻 Quick Usage Example

```typescript
import { createCorsair } from 'corsair';
import { brex } from '@corsair-dev/brex';

const corsair = createCorsair({
  plugins: [brex()],
  kek: process.env.CORSAIR_KEK!,
});

// Example: Create a new virtual card for an employee
const newCard = await corsair.withTenant('org_corp_01').brex.api.cards.create({
  cardholder_id: 'user_98765',
  card_type: 'VIRTUAL',
  limit: {
    amount: 50000, // $500.00 in cents
    currency: 'USD',
    period: 'MONTHLY',
  },
});

console.log('Issued virtual card:', newCard.id);
```

---

## 📚 Official API Reference

For detailed schema definitions, request/response models, and full endpoint capabilities, refer to the official documentation:
- 🔗 **[Brex Developer API Documentation (OpenAPI)](https://developer.brex.com/openapi/)**
