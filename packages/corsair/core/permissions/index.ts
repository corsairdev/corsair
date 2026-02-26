import { randomBytes } from 'node:crypto';
import { v4 as uuidv4 } from 'uuid';
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
};

/**
 * Evaluates the permission policy and returns whether the action is allowed.
 *
 * - `'allow'`            → returns 'allow', caller proceeds normally
 * - `'deny'`             → logs a blocked message, returns 'blocked'
 * - `'require_approval'` → creates a `corsair_permissions` record, logs the token, returns 'blocked'
 *                          (falls back to deny if no database is configured)
 */
export async function enforcePermission(
	opts: EnforcePermissionOptions,
): Promise<'allow' | 'blocked'> {
	const policy = evaluatePermission(opts.riskLevel, opts.mode, opts.override);
	if (policy === 'allow') return 'allow';

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
		return 'blocked';
	}

	// require_approval: create a pending record and log the token
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
			// unknown args serialized to JSON; available for inspection or re-execution
			args: JSON.stringify(opts.args),
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

	return 'blocked';
}
