import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { RevoltContext, RevoltCredential } from '..';
import type { RevoltRequest } from '../client';
import { makeRevoltRequest, REVOLT_API_BASE } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Resolves which header carries the token, and the host to use. A plugin created
 * with `credential: 'user'` sends `X-Session-Token`; the default is a bot's
 * `X-Bot-Token`. `base_url` lets a self-hosted Stoat instance be targeted.
 */
export function resolveCredential(ctx: RevoltContext): {
	credential: RevoltCredential;
	base: string;
} {
	const options = ctx.options as {
		credential?: RevoltCredential;
		base_url?: string;
	};
	return {
		credential: options.credential ?? 'bot',
		base: options.base_url ?? REVOLT_API_BASE,
	};
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Message content is the caller's own text, so `log`
 * records ids and counts rather than the body.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: RevoltContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => RevoltRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const { credential, base } = resolveCredential(ctx);
	const raw = await makeRevoltRequest(
		ctx.key,
		credential,
		base,
		toRequest(parsed),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`revolt.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** One entry in a message's reply list. */
export type RevoltReplyRef = { id: string; mention?: boolean };

/** A body member: a scalar, or a list such as a message's replies. */
export type RevoltValue =
	| string
	| number
	| boolean
	| string[]
	| RevoltReplyRef[];

/**
 * Drops unset values so an absent filter is not serialised. Revolt reads `limit`
 * and its `before`/`after` cursors strictly enough that an empty value is a
 * different query. The same helper builds a message body, whose replies are a
 * list of objects.
 */
export function queryOf(
	values: Record<string, RevoltValue | undefined>,
): Record<string, RevoltValue> {
	const kept = Object.entries(values).filter(
		(entry): entry is [string, RevoltValue] => entry[1] !== undefined,
	);
	return Object.fromEntries(kept);
}
