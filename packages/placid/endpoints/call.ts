import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PlacidContext } from '..';
import type { PlacidRequest } from '../client';
import { makePlacidRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged, because layer text and image URLs
 * are the customer's content; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: PlacidContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => PlacidRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makePlacidRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`placid.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Placid answers a delete with 204 and no body, so the endpoint reports the id
 * it was given rather than parsing anything.
 */
export async function callDelete<
	Input extends z.ZodType,
	Output extends z.ZodType,
>(
	ctx: PlacidContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed by the input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => PlacidRequest,
	// unknown: the delete reply is built from the input, and the output schema
	// validates it, so the shape is only known after that parse.
	toResult: (parsed: z.output<Input>) => unknown,
	log: (parsed: z.output<Input>) => LogFields,
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	await makePlacidRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(toResult(parsed));

	await logEventFromContext(
		ctx,
		`placid.${operation.event}`,
		log(parsed),
		'completed',
	);
	return result;
}
