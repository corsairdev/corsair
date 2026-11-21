import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PandadocContext } from '..';
import type { PandadocRequest } from '../client';
import { makePandadocRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs
 * the event. Inputs are not logged because document and contact records
 * carry personal data; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: PandadocContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => PandadocRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makePandadocRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`pandadoc.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Shapes a 204-with-no-body success. PandaDoc documents an empty body for
 * these routes, so anything else is a failure the caller must see rather
 * than a fabricated success.
 */
// unknown: raw is the untouched response body; any shape is possible until
// the caller decides it is a failure.
export function expectEmptyBody(raw: unknown, what: string): void {
	if (raw !== undefined && raw !== null && raw !== '') {
		// The body is left out: it could carry document or contact data.
		throw new Error(`PandaDoc ${what}: unexpected response body`);
	}
}
