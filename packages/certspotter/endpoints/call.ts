import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { CertSpotterContext } from '..';
import type { CertSpotterRequest } from '../client';
import { makeCertSpotterRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs the
 * event. The domain is logged; the returned certificates are not.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: CertSpotterContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => CertSpotterRequest,
	options: {
		// unknown: raw is the response body; the output schema validates it.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeCertSpotterRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`certspotter.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
