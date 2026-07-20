## Summary of changes

Here's everything addressed since the last review round:

### 1. Lockfile regenerated (aff21c73)
- Ran `pnpm install` to fix `ERR_PNPM_LOCKFILE_MISSING_DEPENDENCY` for `ts-jest@29.4.9`
- Includes `packages/confluence` entry + expected ts-jest resolution updates (esbuild peer dep from tsup)

### 2. Webhook signature verification (`webhooks/types.ts`)
- Replaced `// TODO: Implement… return { valid: true }` with real HMAC-SHA256 verification
- Reads `x-hub-signature` header (Atlassian standard, same as Jira)
- Uses `crypto.timingSafeEqual` for constant-time comparison
- Gracefully allows unsigned requests when no secret is configured

### 3. API base path — removed `../../` traversal hack (`client.ts`, `endpoints/pages.ts`)
- Added optional `base` parameter to `makeConfluenceRequest`
- Default stays `/wiki/rest/api` (v1) — `spaces.ts`, `search.ts` unchanged
- `pages.ts` now uses `base: '/wiki/api/v2'` with path `'pages'` instead of `'../../api/v2/pages'`
- Resolves to the same URL without relying on path traversal

### 4. API test env guard (`api.test.ts`)
- Removed `!` non-null assertions, added `beforeAll` that throws a clear message when `CONFLUENCE_API_KEY` / `CONFLUENCE_CLOUD_URL` are missing

### 5. Webhook unit tests (`webhooks.test.ts`)
- 12 tests covering: valid signature, wrong signature, missing header, array header, length mismatch, empty secret, rawBody priority, payload fallback, and `createConfluenceMatch` edge cases

### 6. Plugin webhook matcher (`index.ts`)
- Changed `x-confluence-signature` (fictional) → `x-atlassian-webhook-identifier` (real Atlassian webhook header, same as Jira)

### 7. Pages.get filter test (`api.test.ts`)
- Added `status: 'current'` test case to exercise the filtering path
