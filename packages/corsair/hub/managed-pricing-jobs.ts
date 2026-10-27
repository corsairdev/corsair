import { singleFlight } from '../core/auth/single-flight';
import { hubApiGet, hubApiPost } from './client/http';
import type { ManagedPricingCall } from './managed-pricing-auth';
import { managedPricingHubScope, readUsageUnits } from './managed-pricing-auth';
import type { HubConfig } from './types';

/**
 * One of Hub's provider operations that start a job and return before it ends,
 * or the operation that reads that job back (Hub's GET
 * /managed-pricing/job-kinds). On Corsair's own key a start has to say how far
 * it may go, a read is answered only for a job its caller started, and the job
 * is charged once, when a read sees it finish.
 */
export type ManagedJobKind =
	| {
			plugin: string;
			operation: string;
			role: 'start';
			/** Where the start's result has the provider's job id. */
			id_path: string;
			status_operation: string;
			/** The argument that bounds the job, when Hub requires one. */
			cap_path?: string;
			cap_max?: number;
	  }
	| {
			plugin: string;
			operation: string;
			role: 'status';
			/** The argument that takes the provider's job id. */
			id_arg: string;
			status_path: string;
			usage_path?: string;
	  };

/** Hub's table changes with a deploy, not per call. */
const KINDS_TTL_MS = 10 * 60_000;
/** A failed read is retried soon, but not on every call. Short, because while
 *  it lasts starts go out without their cap and reads without their job id,
 *  which Hub refuses; a start is still recorded from Hub's own answer. */
const KINDS_FAILURE_TTL_MS = 5_000;
/** Without its row a started job can't be read or settled, so the start report
 *  is retried; Hub answers a repeat as the same job. */
const START_REPORT_ATTEMPTS = 3;
const REPORT_TIMEOUT_MS = 3_000;
/** Every managed call waits on this read when the cache is cold, so a Hub
 *  that stalls must not hold the call up for long. */
const KINDS_TIMEOUT_MS = 2_000;

const kindsByCache = new WeakMap<
	object,
	Map<string, { kinds: ManagedJobKind[]; until: number }>
>();

// unknown: Hub's JSON, checked field by field.
function parseKinds(payload: unknown): ManagedJobKind[] {
	const rows = (payload as { kinds?: unknown })?.kinds;
	if (!Array.isArray(rows)) throw new Error('job-kinds: no kinds array');
	const str = (v: unknown) => typeof v === 'string' && v.length > 0;
	return rows.filter((r): r is ManagedJobKind => {
		const k = r as Record<string, unknown>;
		if (!str(k?.plugin) || !str(k?.operation)) return false;
		if (k.role === 'start') return str(k.id_path);
		if (k.role === 'status') return str(k.id_arg) && str(k.status_path);
		return false;
	});
}

/**
 * Hub's job kinds, cached beside the plugin's credentials. A Hub that cannot
 * answer reads as having none: starts then go uncapped and reads unscoped, as
 * before, and a Hub that requires either refuses the call itself.
 */
export async function getManagedJobKinds(
	hub: HubConfig,
	cache: object,
): Promise<ManagedJobKind[]> {
	const scope = managedPricingHubScope(hub);
	let byScope = kindsByCache.get(cache);
	if (!byScope) {
		byScope = new Map();
		kindsByCache.set(cache, byScope);
	}
	const cached = byScope.get(scope);
	if (cached && cached.until > Date.now()) return cached.kinds;

	return singleFlight(cache, `managed_pricing:job_kinds:${scope}`, async () => {
		try {
			const kinds = await hubApiGet({
				hub,
				path: '/managed-pricing/job-kinds',
				parseResponse: parseKinds,
				signal: AbortSignal.timeout(KINDS_TIMEOUT_MS),
			});
			byScope.set(scope, { kinds, until: Date.now() + KINDS_TTL_MS });
			return kinds;
		} catch {
			byScope.set(scope, {
				kinds: [],
				until: Date.now() + KINDS_FAILURE_TTL_MS,
			});
			return [];
		}
	});
}

export function managedJobKindFor(
	kinds: ManagedJobKind[],
	plugin: string,
	operation: string,
): ManagedJobKind | undefined {
	const id = plugin.toLowerCase();
	return kinds.find((k) => k.plugin === id && k.operation === operation);
}

/** The value at a dot path, or undefined where the path leads nowhere. */
// unknown: arguments and results differ per plugin; only the path is known.
export function readAtPath(value: unknown, path: string): unknown {
	let node: unknown = value;
	for (const key of path.split('.')) {
		if (!node || typeof node !== 'object') return undefined;
		node = (node as Record<string, unknown>)[key];
	}
	return node;
}

// unknown: as readAtPath.
function readString(value: unknown, path: string): string | undefined {
	const found = readAtPath(value, path);
	return typeof found === 'string' && found.length > 0 ? found : undefined;
}

/** What the key request for a job operation carries: the cap a start was
 *  called with, or the job id a read asks about. */
export function managedJobRequestFields(
	kind: ManagedJobKind | undefined,
	// unknown: the endpoint's own arguments.
	args: unknown,
): { cap?: number; jobId?: string } {
	if (kind?.role === 'start' && kind.cap_path) {
		const cap = readAtPath(args, kind.cap_path);
		return typeof cap === 'number' ? { cap } : {};
	}
	if (kind?.role === 'status') {
		const jobId = readString(args, kind.id_arg);
		return jobId ? { jobId } : {};
	}
	return {};
}

// Best effort and bounded, like the outcome reports in managed-pricing-auth.ts:
// a report that does not arrive leaves the hold standing.
async function post(
	hub: HubConfig,
	path: string,
	body: Record<string, unknown>,
	attempts = 1,
): Promise<boolean> {
	for (let attempt = 1; attempt <= attempts; attempt++) {
		try {
			await hubApiPost({
				hub,
				path,
				body,
				parseResponse: (payload) => payload,
				signal: AbortSignal.timeout(REPORT_TIMEOUT_MS),
			});
			return true;
		} catch {
			if (attempt < attempts) {
				await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
			}
		}
	}
	// Unreported: the hold stands. A read reports again; a start has no row.
	return false;
}

/**
 * Tells Hub what a job operation that succeeded returned: a start's job id, so
 * Hub ties the job to its charge, or what a read saw, so Hub settles the job
 * the first time a read sees it end. `startedJob` says a running job was
 * reported, whose charge must not then be given back as a failed call.
 */
export async function reportManagedJobCall(
	hub: HubConfig,
	kind: ManagedJobKind,
	call: Pick<ManagedPricingCall, 'plugin' | 'tenantId' | 'operation'> &
		Partial<Pick<ManagedPricingCall, 'idempotencyKey'>>,
	// unknown: the endpoint's own arguments and result.
	args: unknown,
	result: unknown,
): Promise<{ startedJob: boolean }> {
	if (kind.role === 'start') {
		const providerJobId = readString(result, kind.id_path);
		if (!providerJobId || !call.idempotencyKey) return { startedJob: false };
		await post(
			hub,
			'/managed-pricing/jobs',
			{ ...call, providerJobId },
			START_REPORT_ATTEMPTS,
		);
		// Started whether or not the report landed: the provider is running it,
		// so its hold must not be given back as a failed call.
		return { startedJob: true };
	}
	const providerJobId = readString(args, kind.id_arg);
	const providerStatus = readString(result, kind.status_path);
	if (!providerJobId || !providerStatus) return { startedJob: false };
	const units = kind.usage_path
		? readUsageUnits(result, kind.usage_path)
		: undefined;
	await post(hub, '/managed-pricing/jobs/report', {
		plugin: call.plugin,
		tenantId: call.tenantId,
		operation: call.operation,
		providerJobId,
		providerStatus,
		...(units !== undefined && { units }),
	});
	return { startedJob: false };
}
