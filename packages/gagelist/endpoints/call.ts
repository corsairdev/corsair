import {
	AuthMissingError,
	asRecord,
	logEventFromContext,
} from 'corsair/core';
import type { z } from 'zod';
import type { GagelistContext } from '..';
import type { GagelistCredentials, GagelistRequest } from '../client';
import { makeGagelistRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * GageList needs a client id and a secret, and the pair mints a bearer token.
 * Each half resolves on its own: the id from the `clientId` option, then the
 * key the key builder chose (the `key` option or the stored `api_key`); the
 * secret from the `clientSecret` option, then the stored `api_secret`. A missing
 * half raises AuthMissingError here, before a token request goes out with an
 * empty value.
 */
export async function resolveCredentials(
	ctx: GagelistContext,
): Promise<GagelistCredentials> {
	const clientId =
		ctx.options.clientId || ctx.key || (await ctx.keys.get_api_key());
	const clientSecret =
		ctx.options.clientSecret || (await ctx.keys.get_api_secret());
	if (!clientId || !clientSecret) {
		throw new AuthMissingError('gagelist', 'api_key');
	}
	return { clientId, clientSecret };
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event.
 *
 * `log` names a record by ID and never by its contents: a gage carries a serial
 * number, its location and the user responsible for it.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: GagelistContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => GagelistRequest,
	options: {
		// unknown: raw is the response body. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const credentials = await resolveCredentials(ctx);
	const raw = await makeGagelistRequest(credentials, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`gagelist.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * A list route pages by `start` and `record_number` and reports `total` and
 * `count`. `next_start` is derived here rather than through a transform, because
 * the docs generator reads a transform's input side and would never show it.
 */
// unknown: the raw body is an untyped envelope until the output schema runs.
export function listShape(
	raw: unknown,
	parsed: { start?: number | undefined; record_number?: number | undefined },
	defaultSize: number,
) {
	const record = asRecord(raw) ?? {};
	const rows = record.data;
	const count = Array.isArray(rows) ? rows.length : 0;
	const start = parsed.start ?? 0;
	const total = typeof record.total === 'number' ? record.total : undefined;
	const pageSize = parsed.record_number ?? defaultSize;

	// The total is authoritative when it is there; a full page without one is
	// worth following.
	const hasMore =
		total !== undefined ? start + count < total : count >= pageSize;
	return {
		...record,
		data: rows,
		next_start: hasMore && count > 0 ? start + count : null,
	};
}
