import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ParsioContext } from '..';
import type { ParsioRequest } from '../client';
import { makeParsioRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs
 * the event. Inputs are not logged because parsed documents and collected
 * emails carry personal data; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: ParsioContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => ParsioRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeParsioRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`parsio.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Shapes a 204-with-no-body success. Parsio documents an empty body for
 * these routes, so anything else is a failure the caller must see rather
 * than a fabricated success.
 */
// unknown: raw is the untouched response body; any shape is possible until
// the caller decides it is a failure.
export function expectEmptyBody(raw: unknown, what: string): void {
	// skip answers true (sent as text/html, so the text "true") or {} (live).
	const emptyObject =
		typeof raw === 'object' &&
		raw !== null &&
		!Array.isArray(raw) &&
		Object.keys(raw).length === 0;
	if (
		raw !== undefined &&
		raw !== null &&
		raw !== '' &&
		raw !== true &&
		raw !== 'true' &&
		!emptyObject
	) {
		throw new Error(`Parsio ${what}: unexpected answer (not an empty success)`);
	}
}
