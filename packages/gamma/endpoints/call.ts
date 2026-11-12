import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { GammaContext } from '..';
import type { GammaRequest } from '../client';
import { makeGammaRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event.
 *
 * `log` never touches `exportUrl`: it is a download link that works for anyone
 * holding it, and Gamma's own docs say to treat it as a secret. A prompt is not
 * logged either, because it can carry the material a customer pasted in.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: GammaContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => GammaRequest,
	options: {
		// unknown: raw is the response body. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeGammaRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`gamma.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * A status read is not final until Gamma says `completed` or `failed`, so the
 * answer says which it is rather than leaving a caller to compare strings.
 */
export function isTerminal(status: string | null | undefined): boolean {
	return status === 'completed' || status === 'failed';
}
