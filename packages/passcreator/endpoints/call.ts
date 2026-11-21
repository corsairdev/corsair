import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PasscreatorContext } from '..';
import type { PasscreatorRequest } from '../client';
import { makePasscreatorRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs
 * the event. Inputs are not logged because pass properties carry personal
 * data; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: PasscreatorContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => PasscreatorRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makePasscreatorRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`passcreator.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Shapes a write the API answers with no body (or `{}`). Anything else is a
 * failure the caller must see; the body is left out of the message because
 * it can carry pass holder data.
 */
// unknown: raw is the untouched response body.
export function expectEmpty(raw: unknown, what: string): void {
	const empty =
		raw === undefined ||
		raw === null ||
		raw === '' ||
		(typeof raw === 'object' &&
			!Array.isArray(raw) &&
			Object.keys(raw as object).length === 0);
	if (!empty) {
		throw new Error(`Passcreator ${what}: unexpected response body`);
	}
}
