import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { OpenseaContext } from '..';
import type { OpenseaRequest } from '../client';
import { makeOpenseaRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

export type ShapeOptions<Input extends z.ZodType, Output extends z.ZodType> = {
	// unknown: `raw` is the response body. Whatever this returns is validated by
	// the output schema.
	shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
	log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
};

/**
 * Validates the input, sends one request, shapes and validates the response,
 * then logs. Inputs are not logged wholesale: `log` picks what identifies the
 * call in the tenant's own event log (a slug, a chain, the search text, a
 * public wallet address) plus result counts. The API key is never logged.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: OpenseaContext,
	operation: {
		event: string;
		input: Input;
		output: Output;
		toRequest: (parsed: z.output<Input>) => OpenseaRequest;
	},
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	options: ShapeOptions<Input, Output> = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeOpenseaRequest(ctx.key, operation.toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`opensea.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
