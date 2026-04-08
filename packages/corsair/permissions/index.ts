import type { CorsairPermissionsNamespace } from '../core/permissions';
import type { CorsairDatabase } from '../db/kysely/database';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A plugin namespace on the corsair instance that may have API endpoints.
 */
type PluginWithApi = {
	api?: Record<string, unknown>;
};

/**
 * The corsair instance type for permission execution.
 * Must expose the `permissions` namespace and optionally a `withTenant` method.
 * The withTenant return type is intentionally broad — we only need to index into it
 * by plugin name, and we cast the result to PluginWithApi at the call site.
 */
type CorsairInstance = {
	permissions: CorsairPermissionsNamespace;
	withTenant?: (tenantId: string) => Record<string, unknown>;
	[key: string]: unknown;
};

export type PermissionExecuteResult = {
	plugin?: string;
	endpoint?: string;
	result?: unknown;
	error?: string;
};

// Internal symbol — mirrors the one exported from core/index.ts without importing it
// (avoids potential circular dependency) since Symbol.for() uses a global registry.
const CORSAIR_INTERNAL_SYMBOL = Symbol.for('corsair:internal');

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Traverses a bound API tree by dot-notation path parts and returns the
 * endpoint function, or null if the path does not resolve to a function.
 */
function resolveEndpointFn(
	api: Record<string, unknown>,
	pathParts: string[],
): ((args: unknown) => Promise<unknown>) | null {
	let current: unknown = api;
	for (const part of pathParts) {
		if (!current || typeof current !== 'object') return null;
		current = (current as Record<string, unknown>)[part];
	}
	return typeof current === 'function'
		? (current as (args: unknown) => Promise<unknown>)
		: null;
}

/**
 * Retrieves the internal database from a corsair instance via the CORSAIR_INTERNAL symbol.
 * Used for terminal status transitions (expired, denied) that are not part of the
 * public `corsair.permissions` API.
 */
function getInternalDb(corsair: CorsairInstance): CorsairDatabase | undefined {
	const internal = (corsair as unknown as Record<symbol, unknown>)[
		CORSAIR_INTERNAL_SYMBOL
	] as { database?: CorsairDatabase } | undefined;
	return internal?.database;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Deterministically executes a pending permission request by directly calling
 * the bound endpoint with the frozen args stored in the approval record.
 *
 * This is the approval-side counterpart to processWebhook. Instead of resuming
 * the LLM to re-derive the action, this function looks up the pending permission
 * record, navigates corsair[plugin].api[...endpoint path] to find the bound
 * function, and calls it with the exact args that were stored — no LLM
 * involvement required.
 *
 * Lifecycle:
 * 1. Fetches the permission record via corsair.permissions.find_by_permission_id
 * 2. Validates the record is approved (human has signed off) and not expired
 * 3. Resolves the tenant-scoped corsair instance (via withTenant if multi-tenant)
 * 4. Sets status to 'executing' via corsair.permissions.set_executing
 * 5. Navigates corsair[plugin].api[...endpoint path] to find the bound function
 * 6. Calls the function with the stored args (JSON-parsed)
 * 7. Sets status to 'completed' via corsair.permissions.set_completed
 * 8. Returns the result, or an error object if the endpoint gracefully exits
 *
 * @param corsair - The corsair instance (returned from createCorsair)
 * @param token - The token embedded in the review URL for the corsair_permissions record
 */
export async function executePermission(
	corsair: CorsairInstance,
	token: string,
): Promise<PermissionExecuteResult> {
	const now = new Date().toISOString();

	const permission = await corsair.permissions.find_by_token(token);

	if (!permission) {
		console.error(`executePermission: no permission found for token.`);

		return {
			error: `executePermission: no permission found for token.`,
		};
	}

	if (permission.status !== 'approved') {
		console.error(
			`executePermission: permission '${permission.id}' is '${permission.status}', expected 'approved'.`,
		);

		return {
			endpoint: permission.endpoint,
			plugin: permission.plugin,
			result: null,
			error: `executePermission: permission '${permission.id}' is '${permission.status}', expected 'approved'.`,
		};
	}

	if (permission.expires_at < now) {
		const db = getInternalDb(corsair);
		if (db) {
			await db.permissions.updateStatus(permission.id, 'expired');
		}
		console.error(
			`executePermission: permission '${permission.id}' has expired.`,
		);

		return {
			error: `executePermission: permission '${permission.id}' has expired.`,
			endpoint: permission.endpoint,
			plugin: permission.plugin,
			result: null,
		};
	}

	// Resolve the tenant-scoped instance. The stored tenant_id ensures the correct
	// plugin context is used for multi-tenant corsair instances.
	const tenantId = permission.tenant_id ?? 'default';
	const scopedCorsair: Record<string, unknown> = corsair.withTenant
		? corsair.withTenant(tenantId)
		: (corsair as Record<string, unknown>);

	const pluginNamespace = scopedCorsair[permission.plugin] as
		| PluginWithApi
		| undefined;
	if (!pluginNamespace?.api) {
		console.error(
			`executePermission: plugin '${permission.plugin}' not found or has no API on this corsair instance.`,
		);

		return {
			error: `executePermission: plugin '${permission.plugin}' not found or has no API on this corsair instance.`,
			plugin: permission.plugin,
			endpoint: permission.endpoint,
			result: null,
		};
	}

	const endpointFn = resolveEndpointFn(
		pluginNamespace.api,
		permission.endpoint.split('.'),
	);
	if (!endpointFn) {
		console.error(
			`executePermission: endpoint '${permission.endpoint}' not found in plugin '${permission.plugin}'.`,
		);

		return {
			endpoint: permission.endpoint,
			plugin: permission.plugin,
			result: null,
			error: `executePermission: endpoint '${permission.endpoint}' not found in plugin '${permission.plugin}'.`,
		};
	}

	// Mark as executing — the bound endpoint's enforcePermission recognises this status
	// and allows the call through. Completion is set explicitly below after the endpoint returns.
	await corsair.permissions.set_executing(permission.id);

	try {
		const parsedArgs =
			typeof permission.args === 'string'
				? JSON.parse(permission.args)
				: permission.args;
		const result = await endpointFn(parsedArgs);
		await corsair.permissions.set_completed(permission.id);
		return { plugin: permission.plugin, endpoint: permission.endpoint, result };
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		const db = getInternalDb(corsair);
		if (db) {
			await db.permissions.updateStatus(permission.id, 'failed', {
				error: errorMessage,
			});
		}
		return {
			plugin: permission.plugin,
			endpoint: permission.endpoint,
			result: null,
			error: errorMessage,
		};
	}
}
