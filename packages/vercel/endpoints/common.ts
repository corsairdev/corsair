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
	run: (ctx: VercelContext, input: z.output<I>) => Promise<unknown>;
	logInput?: (input: z.output<I>) => Record<string, unknown>;
}): (ctx: VercelContext, input: z.input<I>) => Promise<z.output<O>> {
	return async (ctx, rawInput) => {
		const input = config.input.parse(rawInput ?? {}) as z.output<I>;
		const result = config.output.parse(await config.run(ctx, input));
		await logEventFromContext(
			ctx,
			config.event,
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

/** Copies the defined values of `input` for `keys` into a query object. */
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

/** Drops `undefined` entries so they aren't sent in a JSON body. */
export function compactBody<T extends Record<string, unknown>>(
	body: T,
): Partial<T> {
	const out: Partial<T> = {};
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined) (out as Record<string, unknown>)[key] = value;
	}
	return out;
}

/**
 * Build, install and dev commands can carry registry tokens or other secrets
 * (`npm config set //registry/:_authToken=…`). For the event log, each
 * `*Command` string becomes a marker that it was set.
 */
export function maskCommands<T extends Record<string, unknown>>(
	settings: T | undefined,
): Record<string, unknown> | undefined {
	if (!settings) return settings;
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(settings)) {
		out[key] =
			key.endsWith('Command') && typeof value === 'string'
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
