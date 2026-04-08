import type { CorsairPermission } from '../../db';
import type { CorsairDatabase } from '../../db/kysely/database';
import type { EndpointMetaEntry, EndpointRiskLevel, PermissionMode, PermissionPolicy } from '../plugins';
/** Resolves the effective permission policy for an endpoint. The override (from permissions.overrides) takes precedence. */
export declare function evaluatePermission(riskLevel: EndpointRiskLevel, mode: PermissionMode, override?: PermissionPolicy): PermissionPolicy;
/** Parses a duration string ('30s', '10m', '1h', '2h30m', '1d') into milliseconds. */
export declare function parseDurationMs(duration: string): number;
/**
 * The `corsair.permissions` namespace available at the root of every corsair instance.
 * Provides methods for querying and transitioning permission records.
 *
 * Status transitions exposed here are intentionally limited to safe, non-escalating states.
 * Setting a record to 'approved' (which grants execution) is deliberately excluded —
 * that must happen through the out-of-band review flow.
 */
export type CorsairPermissionsNamespace = {
    /**
     * Fetches a single permission record by its ID.
     * Returns undefined if no record exists or if no database is configured.
     */
    find_by_permission_id(id: string): Promise<CorsairPermission | undefined>;
    /**
     * Fetches a single permission record by its token.
     * The token is the public-facing handle embedded in review URLs.
     * Returns undefined if no record exists or if no database is configured.
     */
    find_by_token(token: string): Promise<CorsairPermission | undefined>;
    /**
     * Marks the permission as 'executing'. Call this when executePermission picks up
     * an approved record and is about to run the endpoint.
     */
    set_executing(id: string): Promise<void>;
    /**
     * Marks the permission as 'completed'. Call this after the endpoint has finished
     * executing successfully.
     */
    set_completed(id: string): Promise<void>;
};
/**
 * Builds the `corsair.permissions` namespace for a given database instance.
 * Returns no-op stubs when no database is configured.
 */
export declare function buildPermissionsNamespace(db: CorsairDatabase | undefined): CorsairPermissionsNamespace;
export type EnforcePermissionOptions = {
    pluginId: string;
    endpointPath: string;
    /** unknown: caller-supplied args vary per endpoint — not statically knowable here */
    args: unknown;
    mode: PermissionMode;
    override?: PermissionPolicy;
    riskLevel: EndpointRiskLevel;
    meta?: EndpointMetaEntry;
    /** Required to create an approval record. Without a DB, 'require_approval' falls back to deny. */
    db?: CorsairDatabase;
    timeoutMs?: number;
    /** Tenant ID for multi-tenant instances. Stored on the record so executePermission can scope correctly. Defaults to 'default'. */
    tenantId?: string;
};
export type EnforcePermissionResult = {
    result: 'allow' | 'blocked';
    /**
     * Called by the endpoint binding layer after the endpoint executes successfully.
     * Marks the permission record as 'completed' (single-use approval consumed).
     * Only present when an 'approved' record was found and the call is allowed through.
     */
    onComplete?: () => Promise<void>;
};
/**
 * Evaluates the permission policy and returns whether the action is allowed.
 *
 * Lifecycle:
 * - `'allow'`            → policy permits, caller proceeds normally
 * - `'deny'`             → blocked by policy mode; no DB record created
 * - `'require_approval'` → checks for an existing matching permission record first:
 *     - `pending`  (not expired) → already waiting for approval, returns 'blocked'
 *     - `approved` (not expired) → approved and ready; returns 'allow' + onComplete callback
 *                                  that marks the record 'completed' after the endpoint runs
 *     - otherwise               → creates a new 'pending' record, returns 'blocked'
 *
 * Falls back to deny if no database is configured.
 */
export declare function enforcePermission(opts: EnforcePermissionOptions): Promise<EnforcePermissionResult>;
//# sourceMappingURL=index.d.ts.map