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
 * The corsair instance type for permission execution — a record of plugin namespaces.
 * Mirrors the duck-typed shape used by processWebhook.
 */
type CorsairInstance = Record<string, PluginWithApi | undefined> & {
	withTenant?: (tenantId: string) => CorsairInstance;
};

export type PermissionExecuteResult = {
	plugin: string;
	endpoint: string;
	result: unknown;
	error?: string;
};

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
 * 1. Fetches the permission record from corsair_permissions
 * 2. Validates the record is pending and not expired
 * 3. Resolves the tenant-scoped corsair instance (via withTenant if multi-tenant)
 * 4. Sets status to 'approved' so the bound endpoint's permission guard allows it through
 * 5. Navigates corsair[plugin].api[...endpoint path] to find the bound function
 * 6. Calls the function with the stored args (JSON-parsed)
 * 7. The bound function's internal onComplete callback marks the record 'completed'
 * 8. Returns the result, or an error object if the endpoint throws
 *
 * @param corsair - The corsair instance (returned from createCorsair)
 * @param db - The corsair database instance
 * @param permissionId - The ID of the corsair_permissions record to execute
 */
export async function executePermission(
	corsair: CorsairInstance,
	db: CorsairDatabase,
	permissionId: string,
): Promise<PermissionExecuteResult> {
	const now = new Date().toISOString();

	const perm = await db.db
		.selectFrom('corsair_permissions')
		.selectAll()
		.where('id', '=', permissionId)
		.executeTakeFirst();

	if (!perm) {
		throw new Error(
			`executePermission: permission '${permissionId}' not found.`,
		);
	}

	if (perm.status !== 'pending') {
		throw new Error(
			`executePermission: permission '${permissionId}' is '${perm.status}', expected 'pending'.`,
		);
	}

	if (perm.expires_at < now) {
		await db.db
			.updateTable('corsair_permissions')
			.set({ status: 'expired', updated_at: new Date() })
			.where('id', '=', permissionId)
			.execute();
		throw new Error(
			`executePermission: permission '${permissionId}' has expired.`,
		);
	}

	// Resolve the tenant-scoped instance. The stored tenant_id ensures the correct
	// plugin context is used for multi-tenant corsair instances.
	const tenantId = perm.tenant_id ?? 'default';
	const scopedCorsair = corsair.withTenant
		? corsair.withTenant(tenantId)
		: corsair;

	const pluginNamespace = scopedCorsair[perm.plugin];
	if (!pluginNamespace?.api) {
		throw new Error(
			`executePermission: plugin '${perm.plugin}' not found or has no API on this corsair instance.`,
		);
	}

	const endpointFn = resolveEndpointFn(
		pluginNamespace.api,
		perm.endpoint.split('.'),
	);
	if (!endpointFn) {
		throw new Error(
			`executePermission: endpoint '${perm.endpoint}' not found in plugin '${perm.plugin}'.`,
		);
	}

	// Mark as approved — the bound function's enforcePermission will find this record,
	// allow the call through, then its onComplete callback marks it 'completed'.
	await db.db
		.updateTable('corsair_permissions')
		.set({ status: 'approved', updated_at: new Date() })
		.where('id', '=', permissionId)
		.execute();

	try {
		const result = await endpointFn(JSON.parse(perm.args));
		return { plugin: perm.plugin, endpoint: perm.endpoint, result };
	} catch (error) {
		// Reset to a terminal state so the approval cannot be silently retried.
		await db.db
			.updateTable('corsair_permissions')
			.set({ status: 'denied', updated_at: new Date() })
			.where('id', '=', permissionId)
			.execute();
		return {
			plugin: perm.plugin,
			endpoint: perm.endpoint,
			result: null,
			error: error instanceof Error ? error.message : String(error),
		};
	}
}
