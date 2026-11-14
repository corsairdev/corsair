import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { KrakenContext } from '..';
import type { KrakenCredentials, KrakenRequest } from '../client';
import { makeKrakenRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Kraken needs a key and a secret, and both travel in the JSON body. The key is
 * `ctx.key`, which the key builder already resolved (inline option first, then
 * storage). The secret follows the same order: the `apiSecret` option, then the
 * stored account field.
 */
export async function resolveCredentials(
	ctx: KrakenContext,
): Promise<KrakenCredentials> {
	const apiKey = ctx.key;
	// ctx.keys is absent when Corsair runs without a database, so an inline
	// pair must not need it.
	const apiSecret =
		ctx.options.apiSecret ??
		(typeof ctx.keys?.get_api_secret === 'function'
			? await ctx.keys.get_api_secret()
			: undefined);
	if (!apiKey || !apiSecret) {
		throw new AuthMissingError('krakenio', 'api_key');
	}
	return { apiKey, apiSecret };
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event.
 *
 * `log` names sizes and counts only: a source URL can carry a token in its
 * query, and the credentials are in the body.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: KrakenContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => KrakenRequest,
	options: {
		// unknown: raw is the response body. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const credentials = await resolveCredentials(ctx);
	const raw = await makeKrakenRequest(credentials, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`krakenio.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
