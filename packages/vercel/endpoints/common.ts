import type { EndpointMetaEntry } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { VercelQuery } from '../client';
import type { VercelContext } from '../index';

/**
 * Wraps one endpoint: parses the input with its schema, runs the call, parses
 * the response with its (lenient) output schema and logs a
 * `vercel.<group>.<name>` event. `logInput` decides what of the input goes in
 * the event; endpoints that take secrets (env values, passwords, webhook
 * secrets) drop them there.
 */
export function defineEndpoint<
	I extends z.ZodTypeAny,
	O extends z.ZodTypeAny,
>(config: {
	event: string;
	input: I;
	output: O;
	// Raw Vercel response: `output` parses it as soon as run returns.
	run: (ctx: VercelContext, input: z.output<I>) => Promise<unknown>;
	// The event log takes mixed JSON values that differ per endpoint.
	logInput?: (input: z.output<I>) => Record<string, unknown>;
}): (ctx: VercelContext, input: z.input<I>) => Promise<z.output<O>> {
	return async (ctx, rawInput) => {
		const input = config.input.parse(rawInput ?? {}) as z.output<I>;
		const result = config.output.parse(await config.run(ctx, input));
		await logEventFromContext(
			ctx,
			config.event,
			// z.output<I> is generic, so TS can't see it is an object; every input
			// schema parses to one, with mixed values for the event log.
			config.logInput
				? config.logInput(input)
				: { ...(input as Record<string, unknown>) },
			'completed',
		);
		return result as z.output<O>;
	};
}

/**
 * Every call can target a team. Leave it out to use the team an OAuth install
 * was made for, else the plugin's `teamId` option, else the token's own scope.
 */
export const teamIdInput = z
	.string()
	.min(1)
	.optional()
	.describe(
		'Team id (team_…) or team slug to run against. Defaults to the connected team.',
	);

/** Timestamp-cursor pagination used by most Vercel list endpoints. */
export const paginationInput = {
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Maximum number of results to return.'),
	since: z
		.number()
		.optional()
		.describe('Only results created after this timestamp (ms).'),
	until: z
		.number()
		.optional()
		.describe(
			'Only results created before this timestamp (ms). Pass the previous page’s pagination.next to get the next page.',
		),
};

/** `pagination` block on list responses; `next` is the next page's `until`. */
export const PaginationSchema = z
	.object({
		count: z.number().optional(),
		next: z.number().nullable().optional(),
		prev: z.number().nullable().optional(),
	})
	.passthrough();

/**
 * Copies the defined values of `input` for `keys` into a query object. Inputs
 * mix value types per endpoint; only scalars and arrays are copied.
 */
export function pickQuery<T extends Record<string, unknown>>(
	input: T,
	keys: readonly (keyof T)[],
): VercelQuery {
	const query: VercelQuery = {};
	for (const key of keys) {
		const value = input[key];
		if (value === undefined || value === null) continue;
		if (Array.isArray(value)) {
			query[key as string] = value.map(String);
		} else if (
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean'
		) {
			query[key as string] = value;
		}
	}
	return query;
}

/**
 * Drops `undefined` entries so they aren't sent in a JSON body. Bodies mix
 * value types per endpoint.
 */
export function compactBody<T extends Record<string, unknown>>(
	body: T,
): Partial<T> {
	const out: Partial<T> = {};
	for (const [key, value] of Object.entries(body)) {
		// Object.entries drops T's key types, so write through a plain record.
		if (value !== undefined) (out as Record<string, unknown>)[key] = value;
	}
	return out;
}

/**
 * Shell commands (buildCommand, installCommand, devCommand,
 * commandForIgnoringBuildStep) can carry registry tokens or other secrets
 * (`npm config set //registry/:_authToken=…`). For the event log, any string
 * field whose name contains "command" becomes a marker that it was set.
 */
const COMMAND_FIELD = /command/i;

// Settings objects mix strings, booleans, nulls and nested objects per
// endpoint; only command strings are rewritten, everything else passes as is.
export function maskCommands<T extends Record<string, unknown>>(
	settings: T | undefined,
): Record<string, unknown> | undefined {
	if (!settings) return settings;
	// Same mixed values as the input, with command strings swapped out.
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(settings)) {
		out[key] =
			COMMAND_FIELD.test(key) && typeof value === 'string'
				? '[redacted]'
				: value;
	}
	return out;
}

/** One endpoint's entry in the plugin's endpointMeta. */
export type EndpointMeta = EndpointMetaEntry & { description: string };

/** Lenient id/timestamp helpers for response schemas. */
export const optStr = () => z.string().nullable().optional();
export const optNum = () => z.number().nullable().optional();
export const optBool = () => z.boolean().nullable().optional();
