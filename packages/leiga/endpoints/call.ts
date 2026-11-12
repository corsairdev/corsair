import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { LeigaContext } from '..';
import type { LeigaAuthContext } from '../auth';
import { resolveLeigaAccessToken } from '../auth';
import type { LeigaRequest } from '../client';
import { LeigaAPIError, makeLeigaRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. The envelope's `data` arrives here already unwrapped by
 * `makeLeigaRequest`, which throws on any non-zero `code`.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: LeigaContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => LeigaRequest,
	options: {
		// unknown: raw is the unwrapped `data` value. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await sendReplacingRejectedToken(
		ctx,
		toRequest(parsed),
		operation.event,
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`leiga.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Sends the request, and when Leiga refuses the token (`15 accessToken error`)
 * mints a new one from the account's client pair and sends it once more.
 *
 * The recorded expiry is only what Leiga said when it issued the token. If
 * Leiga stops accepting the token sooner, the saved one would otherwise be sent,
 * and refused, on every call until that expiry, with reconnecting the only way
 * out. Leiga refuses the token before it runs anything, so repeating the
 * request is safe for any operation.
 */
async function sendReplacingRejectedToken(
	ctx: LeigaContext,
	request: LeigaRequest,
	label: string,
): Promise<unknown> {
	try {
		return await makeLeigaRequest(ctx.key, request, label);
	} catch (error) {
		if (!(error instanceof LeigaAPIError) || error.code !== '15') throw error;
		// An explicit `key` is the caller's own token: there is no pair to mint
		// another from, and no account to save it to.
		if (ctx.options?.key) throw error;
		// Absent when Corsair runs without a database, so nothing is stored.
		const keys = (ctx as { keys?: LeigaAuthContext['keys'] }).keys;
		if (!keys) throw error;
		const token = await resolveLeigaAccessToken(
			{ keys },
			{ rejectedToken: ctx.key },
		);
		return makeLeigaRequest(token, request, label);
	}
}

/**
 * Wraps a bare array under a key. Leiga returns a top-level array for most
 * lists (`project/list`, `sprint/list-with-count`, `tag/list`) and an object
 * with `list` and `total` for `issue/page`, so both shapes have to be handled
 * and anything else has to fail rather than become an empty page.
 */
export function wrapList(
	raw: unknown,
	label: string,
): Record<string, unknown>[] {
	if (!Array.isArray(raw)) {
		throw new Error(`Leiga returned an unexpected ${label} body`);
	}
	for (const [index, entry] of raw.entries()) {
		if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) {
			throw new Error(
				`Leiga returned an unexpected ${label} body: entry ${index} is not an object`,
			);
		}
	}
	return raw as Record<string, unknown>[];
}
