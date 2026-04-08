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
// CorsairDatabase is now CorsairDatabaseAdapter — permission queries go through adapter.permissions

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
			return db.permissions.findById(id);
		},
		async find_by_token(token: string) {
			if (!db) return undefined;
			return db.permissions.findByToken(token);
		},
		async set_executing(id: string) {
			if (!db) return;
			await db.permissions.updateStatus(id, 'executing');
		},
		async set_completed(id: string) {
			if (!db) return;
			await db.permissions.updateStatus(id, 'completed');
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
		return { result: 'blocked' };
	}

	const argsJson = JSON.stringify(opts.args);
	const now = new Date().toISOString();
	const tenantId = opts.tenantId ?? 'default';

	const existing = await opts.db.permissions.findActiveForEndpoint({
		plugin: opts.pluginId,
		endpoint: opts.endpointPath,
		args: argsJson,
		tenantId,
		now,
	});

	if (existing) {
		if (existing.status === 'approved') {
			const db = opts.db;
			const permissionId = existing.id;
			return {
				result: 'allow',
				onComplete: async () => {
					await db.permissions.updateStatus(permissionId, 'completed');
				},
			};
		}

		if (existing.status === 'executing') {
			return { result: 'allow' };
		}

		console.log(
			`[corsair/${opts.pluginId}] '${opts.endpointPath}' blocked — approval already pending.`,
			`\n  Action: ${description}`,
			`\n  Permission ID: ${existing.id}`,
			`\n  Use the token to approve or deny this request.`,
		);
		return { result: 'blocked' };
	}

	const id = uuidv4();
	const token = randomBytes(32).toString('hex');
	const timeoutMs = opts.timeoutMs ?? 10 * 60 * 1_000;
	const expiresAt = new Date(Date.now() + timeoutMs).toISOString();

	await opts.db.permissions.create({
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
	});

	console.log(
		`[corsair/${opts.pluginId}] '${opts.endpointPath}' blocked — approval required.`,
		`\n  Action: ${description}`,
		`\n  Permission ID:    ${id}`,
		`\n  Permission token: ${token}`,
		`\n  Expires at:       ${expiresAt}`,
		`\n  Use the token to approve or deny this request.`,
	);

	return { result: 'blocked' };
}
