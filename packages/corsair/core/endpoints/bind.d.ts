import type { CorsairDatabase } from '../../db/kysely/database';
import type { CorsairErrorHandler } from '../errors';
import type { CorsairKeyBuilderBase, EndpointMetaEntry, PermissionMode, PermissionPolicy } from '../plugins';
/**
 * Checks if a value is an endpoint/function (has function signature).
 * @param value - The value to check
 * @returns True if the value is a function
 */
export declare function isEndpoint(value: unknown): value is Function;
/**
 * Recursively binds endpoints in a tree structure with context and hooks.
 * Handles both flat (key -> fn) and nested (key -> { key -> fn }) structures.
 * @param endpoints - The endpoint tree to bind
 * @param hooks - Optional hooks to apply to endpoint handlers
 * @param ctx - The context to bind to endpoint handlers
 * @param tree - The output tree to populate with bound endpoints
 * @param pluginId - The ID of the plugin for error context
 * @param errorHandler - The error handler for this plugin
 * @param currentPath - The current path for tracking nested endpoint operations
 * @param keyBuilder - Optional async callback to generate a key from the plugin context
 */
export declare function bindEndpointsRecursively({ endpoints, hooks, ctx, tree, pluginId, errorHandlers, currentPath, keyBuilder, permissionsConfig, endpointMeta, database, approvalConfig, tenantId, }: {
    endpoints: Record<string, unknown>;
    hooks: Record<string, unknown> | undefined;
    ctx: Record<string, unknown>;
    tree: Record<string, unknown>;
    pluginId: string;
    errorHandlers: CorsairErrorHandler;
    currentPath: string[];
    keyBuilder?: CorsairKeyBuilderBase;
    /** Permission mode + per-endpoint overrides from plugin options. When set, every call is gated. */
    permissionsConfig?: {
        mode: PermissionMode;
        overrides?: Record<string, PermissionPolicy>;
    };
    /** Risk level metadata per dot-notation endpoint path. Defaults riskLevel to 'write' when missing. */
    endpointMeta?: Record<string, EndpointMetaEntry>;
    /** Required for 'require_approval' to persist the approval record to the DB. */
    database?: CorsairDatabase;
    /** Approval timeout config from createCorsair({ approval: ... }). */
    approvalConfig?: {
        timeout: string;
        onTimeout: 'deny' | 'approve';
    };
    /** Tenant ID for multi-tenant instances. Forwarded to the permission record so executePermission can scope correctly. */
    tenantId?: string;
}): void;
//# sourceMappingURL=bind.d.ts.map