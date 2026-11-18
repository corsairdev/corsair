import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ServicenowContext } from '..';
import type { ServicenowRequest } from '../client';
import { makeServicenowRequest, normalizeServicenowHost } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Resolves the instance host from the plugin option first, then the stored
 * `host` key, so a single-tenant setup can configure it once. ServiceNow has no
 * shared API host, so this has to be present before any request.
 */
export async function resolveHost(ctx: ServicenowContext): Promise<string> {
	const fromOptions = ctx.options?.host?.trim();
	if (fromOptions) return normalizeServicenowHost(fromOptions);

	// unknown: `get_host` exists only when the plugin declares it in authConfig,
	// and `ctx.keys` itself is absent on a context built without a key manager
	// (as the live tests and a bare `key` option both do).
	const keys = ctx.keys as unknown as
		| { get_host?: () => Promise<string | null | undefined> }
		| undefined;
	const fromKeys = (await keys?.get_host?.())?.trim();
	if (fromKeys) return normalizeServicenowHost(fromKeys);

	throw new Error(
		'[servicenow] instance host is required, e.g. acme.service-now.com. Pass servicenow({ host }) or store it with keys.set_host(host)',
	);
}

/**
 * Validates the input, resolves the host, sends the request, shapes and
 * validates the response, then logs the event.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: ServicenowContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => ServicenowRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const host = await resolveHost(ctx);
	const raw = await makeServicenowRequest(host, ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`servicenow.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Unwraps ServiceNow's `{ result }` envelope. A 2xx body without `result` is a
 * failure the API reported without an error status, so it throws rather than
 * becoming an empty record.
 * unknown: the body is untyped until this reads it.
 */
export function unwrapResult(raw: unknown, label: string): unknown {
	if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
		throw new Error(`ServiceNow returned an unexpected ${label} body`);
	}
	const record = raw as Record<string, unknown>;
	if (!('result' in record)) {
		throw new Error(`ServiceNow returned no result for ${label}`);
	}
	return record.result;
}

/**
 * Joins a `fields` selection, always keeping the identifiers the output schema
 * requires.
 *
 * ServiceNow returns **only** the fields asked for, so `sysparm_fields=sys_id`
 * answers a record with no `name`, which would fail the output parse. Verified
 * against a live instance. Adding the required field back means a caller's
 * selection still yields a usable object, rather than the plugin weakening its
 * schema to accept an unusable one.
 */
export function fieldsWith(
	values: string | undefined,
	required: readonly string[],
): string | undefined {
	if (values === undefined) return undefined;
	const kept = values
		.split(',')
		.map((field) => field.trim())
		.filter((field) => field.length > 0);
	for (const field of required) {
		if (!kept.includes(field)) kept.push(field);
	}
	return kept.join(',');
}
/** Drops unset query values so nothing empty is sent. */
export function queryOf(
	values: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	return Object.fromEntries(
		Object.entries(values).filter(([, value]) => value !== undefined),
	);
}
