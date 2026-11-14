import { AuthMissingError, asRecord, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { GatherupContext } from '..';
import type { GatherupCredentials, GatherupRequest } from '../client';
import { makeGatherupRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * GatherUp needs a bearer token and a client ID, and every call carries both.
 * The client ID is the key, because it names which account the call is about,
 * and it is read from `ctx.key` so a before hook can pick the account. The
 * token is the `apiKey` option or the account's stored `api_secret`, and a
 * missing token is never replaced by the client ID.
 */
export async function resolveCredentials(
	ctx: GatherupContext,
): Promise<GatherupCredentials> {
	// ctx.key is what the key builder resolved (the clientId option first),
	// after any before hook, so it names the account this call is about.
	const clientId = ctx.key;
	const apiKey = ctx.options.apiKey ?? (await ctx.keys.get_api_secret());
	if (!clientId || !apiKey) {
		throw new AuthMissingError('gatherup', 'api_key');
	}
	return { apiKey, clientId, agent: ctx.options.agent };
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event.
 *
 * A customer carries a name, email and phone, and a feedback carries what a
 * reviewer wrote, so `log` names records by ID and never by their contents.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: GatherupContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => GatherupRequest,
	options: {
		// unknown: raw is the response body. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const credentials = await resolveCredentials(ctx);
	const raw = await makeGatherupRequest(credentials, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`gatherup.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * A list answers `page`, `pages`, `count` and `perPage`. `next_page` is derived
 * here rather than through a transform, because the docs generator reads a
 * transform's input side and would never show the field.
 */
// unknown: the raw body is an untyped envelope until the output schema runs.
export function listShape(
	raw: unknown,
	parsed: { page?: number | undefined; perPage?: number | undefined },
	defaultPageSize = 500,
) {
	const record = asRecord(raw) ?? {};
	const rows = record.data;
	const count = Array.isArray(rows) ? rows.length : 0;
	const page = parsed.page ?? Math.max(1, Number(record.page) || 1);
	const pages = typeof record.pages === 'number' ? record.pages : undefined;

	return {
		...record,
		data: rows,
		next_page:
			pages !== undefined
				? page < pages
					? page + 1
					: null
				: count > 0 && count >= (parsed.perPage ?? defaultPageSize)
					? page + 1
					: null,
	};
}
