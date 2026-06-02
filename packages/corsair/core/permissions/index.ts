import { randomBytes } from 'node:crypto';
import { v4 as uuidv4 } from 'uuid';
import type { CorsairPermission } from '../../db';
import type { CorsairDatabase } from '../../db/kysely/database';
import type {
	EndpointMetaEntry,
	EndpointRiskLevel,
	PermissionMode,
	PermissionPolicy,
} from '../plugins';

// ─────────────────────────────────────────────────────────────────────────────
// Permission Matrix
// ─────────────────────────────────────────────────────────────────────────────

const PERMISSION_MATRIX: Record<
	PermissionMode,
	Record<EndpointRiskLevel, PermissionPolicy>
> = {
	open: { read: 'allow', write: 'allow', destructive: 'allow' },
	cautious: { read: 'allow', write: 'allow', destructive: 'require_approval' },
	strict: { read: 'allow', write: 'require_approval', destructive: 'deny' },
	readonly: { read: 'allow', write: 'deny', destructive: 'deny' },
};

/** Resolves the effective permission policy for an endpoint. The override (from permissions.overrides) takes precedence. */
export function evaluatePermission(
	riskLevel: EndpointRiskLevel,
	mode: PermissionMode,
	override?: PermissionPolicy,
): PermissionPolicy {
	if (override !== undefined) return override;
	return PERMISSION_MATRIX[mode][riskLevel];
}

// ─────────────────────────────────────────────────────────────────────────────
// Duration Parsing
// ─────────────────────────────────────────────────────────────────────────────

/** Parses a duration string ('30s', '10m', '1h', '2h30m', '1d') into milliseconds. */
export function parseDurationMs(duration: string): number {
	const regex = /(\d+)(d|h|m|s)/g;
	let total = 0;
	let match: RegExpExecArray | null;
	while ((match = regex.exec(duration)) !== null) {
		const value = parseInt(match[1]!, 10);
		switch (match[2]) {
			case 'd':
				total += value * 86_400_000;
				break;
			case 'h':
				total += value * 3_600_000;
				break;
			case 'm':
				total += value * 60_000;
				break;
			case 's':
				total += value * 1_000;
				break;
		}
	}
	return total > 0 ? total : 10 * 60 * 1_000;
}

// ─────────────────────────────────────────────────────────────────────────────
// Permissions Namespace
// ─────────────────────────────────────────────────────────────────────────────

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
export function buildPermissionsNamespace(
	db: CorsairDatabase | undefined,
): CorsairPermissionsNamespace {
	return {
		async find_by_permission_id(id: string) {
			if (!db) return undefined;
			return db.db
				.selectFrom('corsair_permissions')
				.selectAll()
				.where('id', '=', id)
				.executeTakeFirst();
		},
		async find_by_token(token: string) {
			if (!db) return undefined;
			return db.db
				.selectFrom('corsair_permissions')
				.selectAll()
				.where('token', '=', token)
				.executeTakeFirst();
		},
		async set_executing(id: string) {
			if (!db) return;
			await db.db
				.updateTable('corsair_permissions')
				.set({ status: 'executing', updated_at: new Date() })
				.where('id', '=', id)
				.execute();
		},
		async set_completed(id: string) {
			if (!db) return;
			await db.db
				.updateTable('corsair_permissions')
				.set({ status: 'completed', updated_at: new Date() })
				.where('id', '=', id)
				.execute();
		},
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Permission Guard
// ─────────────────────────────────────────────────────────────────────────────

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
	/**
	 * Controls whether the call blocks until the user approves or denies.
	 * - `'synchronous'`  → polls the DB every 500 ms; returns 'allow' on approval, 'blocked' on denial/timeout.
	 * - `'asynchronous'` → returns 'blocked' immediately after creating the pending record.
	 * - A no-arg function → called per-request, return value selects the mode dynamically.
	 * Defaults to `'asynchronous'`.
	 */
	approvalMode?:
		| 'synchronous'
		| 'asynchronous'
		| (() => 'synchronous' | 'asynchronous');
};

export type EnforcePermissionResult = {
	result: 'allow' | 'blocked';
	/** Why the call was blocked. Only present when result === 'blocked'. */
	reason?: 'denied' | 'policy' | 'timeout' | 'pending';
	/** Permission record ID. Present when a pending approval record exists. */
	id?: string;
	/** Permission token (the value embedded in review URLs). Present when a pending approval record exists. */
	token?: string;
	/**
	 * Called by the endpoint binding layer after the endpoint executes successfully.
	 * Marks the permission record as 'completed' (single-use approval consumed).
	 * Only present when an 'approved' record was found and the call is allowed through.
	 */
	onComplete?: () => Promise<void>;
};

/**
 * Polls a corsair_permissions row every 500 ms until it reaches a terminal state or the
 * deadline is exceeded. Used by synchronous approval mode so the MCP tool call blocks
 * transparently until the user acts in the UI.
 */
async function pollUntilResolved(
	db: CorsairDatabase,
	permissionId: string,
	timeoutMs: number,
): Promise<EnforcePermissionResult> {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		const record = await db.db
			.selectFrom('corsair_permissions')
			.select(['id', 'status'])
			.where('id', '=', permissionId)
			.executeTakeFirst();

		if (!record) return { result: 'blocked', reason: 'pending' };

		if (record.status === 'approved') {
			return {
				result: 'allow',
				onComplete: async () => {
					await db.db
						.updateTable('corsair_permissions')
						.set({ status: 'completed', updated_at: new Date() })
						.where('id', '=', permissionId)
						.execute();
				},
			};
		}

		if (record.status === 'denied') {
			return { result: 'blocked', reason: 'denied' };
		}

		if (record.status === 'expired' || record.status === 'failed') {
			return { result: 'blocked', reason: 'timeout' };
		}

		await new Promise<void>((resolve) => setTimeout(resolve, 500));
	}
	return { result: 'blocked', reason: 'timeout' };
}

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
 * When `approvalMode` is `'synchronous'`, pending records are polled until resolved rather
 * than returning 'blocked' immediately.
 */
export async function enforcePermission(
	opts: EnforcePermissionOptions,
): Promise<EnforcePermissionResult> {
	const policy = evaluatePermission(opts.riskLevel, opts.mode, opts.override);
	if (policy === 'allow') return { result: 'allow' };

	const irreversibleNote = opts.meta?.irreversible ? ' (irreversible)' : '';
	const description = opts.meta?.description
		? `${opts.meta.description}${irreversibleNote}`
		: `${opts.pluginId}.${opts.endpointPath}${irreversibleNote}`;

	if (policy === 'deny' || !opts.db) {
		console.log(
			`[corsair/${opts.pluginId}] '${opts.endpointPath}' blocked — denied by permission mode '${opts.mode}'.`,
			`\n  Action: ${description}`,
			`\n  To allow this, update the permission mode or add an override in your corsair config.`,
		);
		return { result: 'blocked', reason: 'policy' };
	}

	const argsJson = JSON.stringify(opts.args);
	const now = new Date().toISOString();
	const tenantId = opts.tenantId ?? 'default';

	// Check for an existing, non-expired permission record for this plugin + endpoint + args + tenant
	const existing = await opts.db.db
		.selectFrom('corsair_permissions')
		.selectAll()
		.where('plugin', '=', opts.pluginId)
		.where('endpoint', '=', opts.endpointPath)
		.where('args', '=', argsJson)
		.where('tenant_id', '=', tenantId)
		.where('expires_at', '>', now)
		.where('status', 'in', ['pending', 'approved', 'executing'])
		.orderBy('created_at', 'desc')
		.limit(1)
		.executeTakeFirst();

	if (existing) {
		if (existing.status === 'approved') {
			// Single-use: let the call through; onComplete will mark it 'completed'
			const db = opts.db;
			const permissionId = existing.id;
			return {
				result: 'allow',
				onComplete: async () => {
					await db.db
						.updateTable('corsair_permissions')
						.set({ status: 'completed', updated_at: new Date() })
						.where('id', '=', permissionId)
						.execute();
				},
			};
		}

		if (existing.status === 'executing') {
			// executePermission is actively running this — let the endpoint body proceed.
			// Completion is handled by executePermission itself, not via onComplete here.
			return { result: 'allow' };
		}

		// status === 'pending': already waiting for approval, don't create a duplicate
		console.log(
			`[corsair/${opts.pluginId}] '${opts.endpointPath}' blocked — approval already pending.`,
			`\n  Action: ${description}`,
			`\n  Permission ID: ${existing.id}`,
			`\n  Use the token to approve or deny this request.`,
		);
		const resolvedMode =
			typeof opts.approvalMode === 'function'
				? opts.approvalMode()
				: opts.approvalMode;
		if (resolvedMode === 'synchronous') {
			return pollUntilResolved(
				opts.db,
				existing.id,
				opts.timeoutMs ?? 10 * 60 * 1_000,
			);
		}
		return {
			result: 'blocked',
			reason: 'pending',
			id: existing.id,
			token: existing.token,
		};
	}

	// No existing actionable record — create a new pending approval request
	const id = uuidv4();
	const token = randomBytes(32).toString('hex');
	const timeoutMs = opts.timeoutMs ?? 10 * 60 * 1_000;
	const expiresAt = new Date(Date.now() + timeoutMs).toISOString();

	await opts.db.db
		.insertInto('corsair_permissions')
		.values({
			id,
			created_at: new Date(),
			updated_at: new Date(),
			token,
			plugin: opts.pluginId,
			endpoint: opts.endpointPath,
			args: argsJson,
			tenant_id: tenantId,
			status: 'pending',
			expires_at: expiresAt,
		})
		.execute();

	console.log(
		`[corsair/${opts.pluginId}] '${opts.endpointPath}' blocked — approval required.`,
		`\n  Action: ${description}`,
		`\n  Permission ID:    ${id}`,
		`\n  Permission token: ${token}`,
		`\n  Expires at:       ${expiresAt}`,
		`\n  Use the token to approve or deny this request.`,
	);

	const resolvedMode =
		typeof opts.approvalMode === 'function'
			? opts.approvalMode()
			: opts.approvalMode;
	if (resolvedMode === 'synchronous') {
		return pollUntilResolved(opts.db, id, timeoutMs);
	}

	return { result: 'blocked', reason: 'pending', id, token };
}
