import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { GiteaContext } from '..';
import type { GiteaRequest } from '../client';
import { makeGiteaRequest, resolveGiteaInstance } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, resolves the account's instance URL, sends the request,
 * shapes and validates the response, then logs the event. Inputs are not
 * logged, because issue bodies and comments hold user content; `log` picks the
 * safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: GiteaContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown, // unknown: raw caller input, parsed below by the operation's input schema.
	toRequest: (parsed: z.output<Input>) => GiteaRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		// unknown: raw is the response body, undefined when there is none, and
		// the output schema validates whatever shape returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown; // unknown: see note above.
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const baseUrl = await resolveGiteaInstance(ctx);
	const raw = await makeGiteaRequest(ctx.key, baseUrl, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`gitea.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** Page echo for list outputs, from the effective values that were sent. */
export function pageEcho(parsed: { page?: number; limit?: number }) {
	return {
		page: parsed.page ?? 1,
		limit: parsed.limit ?? 50,
	};
}
