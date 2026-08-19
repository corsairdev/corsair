# Issue #835 Architecture Analysis

## Issue Summary

Issue #835 identifies a security bypass in the MCP `run_script` tool. The tool allows AI agents to execute arbitrary JavaScript with the internal `corsair` client object in scope. While the standard API endpoints (`corsair.<plugin>.api.*`) correctly enforce both permission checks and the `readonly` execution mode, the `corsair` client also exposes raw data access and management namespaces (`keys`, `db`, and `manage`). Because these surfaces bypass the standard endpoint binding logic, they do not trigger the security guards, allowing agents to arbitrarily extract credentials, manipulate database records, or modify tenant state even when explicitly constrained to `readonly` mode or strict permission policies.

## Current Architecture

The `run_script` tool is defined in `packages/mcp/src/core/tools.ts` (line 77). It receives an async JS script and invokes it via `new Function('corsair', ...)`, passing the fully constructed `corsair` client directly into the script's scope. 

When `runOptions?.readonly` is true, it executes the script inside `runReadonly(invoke)`. `runReadonly` (from `packages/corsair/core/permissions/index.ts`) uses `AsyncLocalStorage` to set an ambient readonly flag.

Currently, the guards (`assertReadonlyAllowed` and `enforcePermission`) are only wired into the core API endpoints via `bindEndpointsRecursively` in `packages/corsair/core/endpoints/bind.ts`. When `run_script` invokes a standard API endpoint, these guards intercept the call. However, since the `corsair` instance also contains un-bound namespaces attached directly during client construction (in `packages/corsair/core/client/index.ts` and `packages/corsair/core/index.ts`), calls to those namespaces bypass the interceptors entirely.

## The Bypass Surfaces

The following surfaces on the `corsair` instance are currently unguarded:

1. **`corsair.<plugin>.keys.*`**: Exposed via `packages/corsair/core/client/index.ts` (line 479) for account-level keys and `packages/corsair/core/index.ts` (line 80) for integration-level keys. This provides direct access to `AccountKeyManager` and `IntegrationKeyManager`, allowing an agent to extract raw credentials (like API keys or OAuth tokens) or overwrite them.
2. **`corsair.<plugin>.db.*`**: Exposed via `packages/corsair/core/client/index.ts` (line 455). This provides direct access to `PluginEntityClient` instances for Kysely database entities, allowing direct database reads, inserts, and updates bypassing all API-layer logic.
3. **`corsair.manage.*`**: Exposed via `packages/corsair/core/index.ts` (line 128) on the multi-tenant wrapper and single-tenant client. This namespace (`CorsairManageNamespace`) allows listing plugins, listing tenants, and checking connection statuses.

## Where Guards Are Wired

The security guards are currently applied exclusively in one location:
- `packages/corsair/core/endpoints/bind.ts` inside the `bindEndpointsRecursively` function:
  - Line 118: `assertReadonlyAllowed(operationPath, endpointMetaEntry?.riskLevel ?? 'write');`
  - Line 134: `enforcePermission(...)`

Because `keys`, `db`, and `manage` are not recursively bound using `bindEndpointsRecursively`, they completely bypass these checks.

## Guard Implementation Details

The enforcement logic lives in `packages/corsair/core/permissions/index.ts`:

- **Readonly Mode**: Implemented via an `AsyncLocalStorage<true>` singleton named `readonlyScope`. The `runReadonly` function enters this scope. `assertReadonlyAllowed` checks `isReadonlyScopeActive()` and throws a `ReadonlyForbiddenError` if the requested operation's risk level is anything other than `'read'`.
- **Permissions**: Evaluated in `enforcePermission`. It checks the requested `riskLevel` against the configured `PermissionMode` (e.g., open, cautious, strict, readonly) and any overrides. If approval is required, it either polls synchronously against the `corsair_permissions` database table or creates a pending record and returns blocked status asynchronously.

## Test Coverage Status

There are currently **no tests** covering the `run_script` tool's interaction with permissions or readonly mode. 
- The `packages/mcp/src/core/tools.ts` implementation itself lacks direct testing.
- The `assertReadonlyAllowed` behavior is tested indirectly in `packages/corsair/tests/probe.test.ts` (testing `runReadonlyProbe`), but this strictly validates the `api` layer because the probe operates over the API schema.
- **Gap:** There are zero tests asserting that `keys`, `db`, or `manage` operations are appropriately blocked by readonly constraints or permission boundaries.

## Acceptance Criteria

To resolve Issue #835, the architecture must be updated so that:
- Readonly mode correctly gates access to `keys`, `db`, and `manage`.
- Permissions correctly gate `keys`, `db`, and `manage` in a manner consistent with `corsair.<plugin>.api.*`.

## Key Files

- `packages/mcp/src/core/tools.ts` - Defines the `run_script` handler that passes the `corsair` object into the script.
- `packages/corsair/core/endpoints/bind.ts` - The exclusive location where `assertReadonlyAllowed` and `enforcePermission` are currently applied.
- `packages/corsair/core/permissions/index.ts` - Implements the readonly scoping and permission policy logic.
- `packages/corsair/core/client/index.ts` - Constructs the plugin namespace, injecting `db` and `keys` without binding guards.
- `packages/corsair/core/index.ts` - Constructs the root client, injecting `manage` and `keys` without binding guards.
- `packages/corsair/tests/probe.test.ts` - Demonstrates existing readonly tests which are limited to the `api` layer.

---

### Sources

Files opened and reviewed to produce this document:
- `packages/mcp/src/core/tools.ts`
- `packages/corsair/core/endpoints/bind.ts`
- `packages/corsair/core/permissions/index.ts`
- `packages/corsair/core/client/index.ts`
- `packages/corsair/core/index.ts`
- `packages/corsair/tests/probe.test.ts` (viewed via grep output)
