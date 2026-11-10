import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ReamazeContext } from '..';
import type { ReamazeRequest } from '../client';
import { makeReamazeRequest, normalizeReamazeHost } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Resolves the brand host from the plugin option first, then the stored `host`
 * key, so a single-brand setup can configure it once. Re:amaze has no shared
 * API host, so this has to be present before any request. Both sources go
 * through `normalizeReamazeHost`, which only ever returns `{brand}.reamaze.io`.
 */
export async function resolveHost(ctx: ReamazeContext): Promise<string> {
	const fromOptions = ctx.options?.host?.trim();
	if (fromOptions) return normalizeReamazeHost(fromOptions);

	// unknown: `get_host` exists only when the plugin declares it in authConfig,
	// and `ctx.keys` itself is absent on a context built without a key manager
	// (as the live tests and a bare `key` option both do).
	const keys = ctx.keys as unknown as
		| { get_host?: () => Promise<string | null | undefined> }
		| undefined;
	const fromKeys = (await keys?.get_host?.())?.trim();
	if (fromKeys) return normalizeReamazeHost(fromKeys);

	throw new Error(
		'[reamaze] brand host is required, e.g. acme.reamaze.io. Pass reamaze({ host }) or store it with keys.set_host(host)',
	);
}

/**
 * Validates the input, resolves the host, sends the request, shapes and
 * validates the response, then logs the event.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: ReamazeContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => ReamazeRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});

	/** Logging never decides the outcome: a log failure must not mask a result. */
	const logSafely = async (
		payload: LogFields,
		status: 'completed' | 'failed',
	): Promise<void> => {
		await logEventFromContext(
			ctx,
			`reamaze.${operation.event}`,
			payload,
			status,
		).catch(() => undefined);
	};

	let result: z.output<Output>;
	try {
		const host = await resolveHost(ctx);
		const raw = await makeReamazeRequest(host, ctx.key, toRequest(parsed));
		result = operation.output.parse(
			options.shape ? options.shape(raw, parsed) : raw,
		);
	} catch (error) {
		// Only the request and the response parse are inside this try. The success
		// log is outside it on purpose: `logEvent` throws when `encryptDataAtRest`
		// is configured without a kek, and if a *write* had already landed, a
		// rethrow from here would report success as failure and a retry would
		// duplicate it.
		await logSafely(
			{
				failed: true,
				error: error instanceof Error ? error.message : String(error),
			},
			'failed',
		);
		throw error;
	}

	await logSafely(options.log?.(parsed, result) ?? {}, 'completed');
	return result;
}

/**
 * Reads one wrapper key off a list response, throwing when it is missing or is
 * not an array. Re:amaze answers a route that does not exist with an HTML page,
 * so a caller that got a 200 with the wrong shape needs a named failure rather
 * than an empty list.
 * unknown: the body is untyped until this reads it.
 */
export function unwrapList(
	raw: unknown,
	key: string,
	label: string,
): unknown[] {
	if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
		throw new Error(`Re:amaze returned an unexpected ${label} body`);
	}
	const record = raw as Record<string, unknown>;
	const value = record[key];
	if (!Array.isArray(value)) {
		throw new Error(`Re:amaze returned no ${key} array for ${label}`);
	}
	return value;
}

/**
 * Reads a response the API documents as a bare array, such as `GET /incidents`.
 * unknown: the body is untyped until this checks it.
 */
export function unwrapArray(raw: unknown, label: string): unknown[] {
	if (!Array.isArray(raw)) {
		throw new Error(`Re:amaze returned a non-array ${label} body`);
	}
	return raw;
}

/**
 * Rejects a body that is not the single object a get or a write should answer,
 * and returns it as a record so a list can be merged onto its paging fields.
 * unknown: the body is untyped until this checks it.
 */
export function unwrapObject(
	raw: unknown,
	label: string,
): Record<string, unknown> {
	if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
		throw new Error(`Re:amaze returned an unexpected ${label} body`);
	}
	return raw as Record<string, unknown>;
}

/** Drops unset query values so nothing empty is sent. */
export function queryOf(
	values: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	return Object.fromEntries(
		Object.entries(values).filter(([, value]) => value !== undefined),
	);
}

/**
 * Expands an optional `data` record into `data[key]=value` query entries, which
 * is how Re:amaze filters on brand-defined data attributes. `unknown`: the
 * values come from a user-supplied record and are stringified here.
 */
export function dataParams(
	data: Record<string, unknown> | undefined,
): Record<string, string> {
	if (!data) return {};
	return Object.fromEntries(
		Object.entries(data).map(([key, value]) => [
			`data[${key}]`,
			typeof value === 'string' ? value : JSON.stringify(value),
		]),
	);
}
