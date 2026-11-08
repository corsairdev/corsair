import { createHash } from 'node:crypto';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { TimelyContext } from '..';
import type { TimelyQueryValue, TimelyRequestOptions } from '../client';
import {
	makeTimelyRequest,
	TimelyAccountIdMissingError,
	validateTimelyId,
} from '../client';

type TimelyId = string | number;

// Workspace ids discovered from GET /accounts, keyed by a hash of the token so
// a long-lived client does not repeat the lookup on every call.
const discoveredAccountIds = new Map<string, string>();

function tokenFingerprint(token: string): string {
	return createHash('sha256').update(token).digest('hex');
}

/**
 * Resolves the workspace (`account_id`) every Timely path is scoped to:
 * the call's `accountId`, then timely({ accountId }), then the account's
 * stored `account_id`, then — when the token reaches exactly one workspace —
 * that workspace. Never builds a path from an unresolved id.
 */
export async function resolveTimelyAccountId(
	ctx: Pick<TimelyContext, 'key' | 'options' | 'keys'>,
	explicit?: TimelyId,
): Promise<string> {
	if (explicit !== undefined) return validateTimelyId(explicit, 'accountId');
	if (ctx.options?.accountId !== undefined) {
		return validateTimelyId(ctx.options.accountId, 'accountId');
	}
	// Necessity: ctx.keys is the generic account key manager; the extra
	// `account_id` field declared in timelyAuthConfig is not in its static type.
	const keys = ctx.keys as unknown as
		| { get_account_id?: () => Promise<string | null | undefined> }
		| undefined;
	const stored = await keys?.get_account_id?.();
	if (stored) return validateTimelyId(stored, 'account_id');

	if (!ctx.key) throw new TimelyAccountIdMissingError(0);
	const fingerprint = tokenFingerprint(ctx.key);
	const cached = discoveredAccountIds.get(fingerprint);
	if (cached) return cached;

	const accounts = await makeTimelyRequest<Array<{ id?: TimelyId }>>(
		'/accounts',
		ctx.key,
	);
	const ids = (Array.isArray(accounts) ? accounts : [])
		.map((account) => account?.id)
		.filter((id): id is TimelyId => id !== undefined && id !== null);
	if (ids.length !== 1) throw new TimelyAccountIdMissingError(ids.length);
	const resolved = validateTimelyId(ids[0] as TimelyId, 'account id');
	discoveredAccountIds.set(fingerprint, resolved);
	return resolved;
}

/** Test hook: forget workspace ids discovered from GET /accounts. */
export function clearDiscoveredTimelyAccountIds(): void {
	discoveredAccountIds.clear();
}

export function idPath(value: TimelyId, label = 'id'): string {
	return encodeURIComponent(validateTimelyId(value, label));
}

/** Comma-joins id lists the way Timely's filter parameters expect. */
export function joinIds(values?: readonly TimelyId[]): string | undefined {
	if (!values || values.length === 0) return undefined;
	return values.map((value) => validateTimelyId(value)).join(',');
}

const SECRET_KEYS = new Set(['secret_token']);

/** Copies a value with signing secrets replaced, for event logs and outputs. */
export function redactSecrets<T>(value: T): T {
	if (Array.isArray(value)) {
		return value.map((item) => redactSecrets(item)) as T;
	}
	if (value && typeof value === 'object') {
		const copy: Record<string, unknown> = {};
		for (const [key, entry] of Object.entries(value)) {
			copy[key] =
				SECRET_KEYS.has(key) && typeof entry === 'string' && entry.length > 0
					? '[redacted]'
					: redactSecrets(entry);
		}
		return copy as T;
	}
	return value;
}

export type TimelyCallSpec<TOut> = {
	/** Event name for the Corsair event log, e.g. `timely.clients.list`. */
	event: string;
	/** Parsed input, logged with secrets redacted. */
	input: Record<string, unknown>;
	path: string;
	method?: TimelyRequestOptions['method'];
	query?: Record<string, TimelyQueryValue>;
	// unknown: bodies are assembled from zod-validated inputs by each endpoint.
	body?: Record<string, unknown>;
	output: z.ZodType<TOut>;
	/** Replace the provider body (e.g. Timely's `{}` on delete) before parsing. */
	transform?: (response: unknown) => unknown;
};

export async function timelyCall<TOut>(
	ctx: TimelyContext,
	spec: TimelyCallSpec<TOut>,
): Promise<TOut> {
	// unknown: the raw provider response is validated by spec.output below.
	const response = await makeTimelyRequest<unknown>(spec.path, ctx.key, {
		method: spec.method ?? 'GET',
		query: spec.query,
		body: spec.body,
	});
	const shaped = spec.transform ? spec.transform(response) : response;
	const parsed = spec.output.parse(redactSecrets(shaped));
	await logEventFromContext(
		ctx,
		spec.event,
		redactSecrets({ ...spec.input }),
		'completed',
	);
	return parsed;
}

/** Drops `accountId` and `id` so the rest of an input can become a request body. */
export function bodyFields<T extends Record<string, unknown>>(
	input: T,
): Record<string, unknown> {
	const { accountId: _accountId, id: _id, ...rest } = input;
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(rest)) {
		if (value !== undefined) out[key] = value;
	}
	return out;
}
