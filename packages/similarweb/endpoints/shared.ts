import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SimilarwebContext } from '..';
import type { SimilarwebRequest } from '../client';
import { makeSimilarwebRequest } from '../client';
import type { UnknownJson } from '../json';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Only the domain and the date range are logged: the
 * answer itself is rank data a caller already has.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: SimilarwebContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: UnknownJson, // unknown: raw caller input, parsed by the input schema
	toRequest: (parsed: z.output<Input>) => SimilarwebRequest,
	options: {
		shape?: (
			raw: UnknownJson, // unknown: the response body, absent when empty
			parsed: z.output<Input>,
		) => UnknownJson; // unknown: the output schema validates what this returns
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeSimilarwebRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`similarweb.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Similarweb answers a 2xx with a body, but a bare object where an array is
 * expected (or the reverse) means the contract moved. Failing here is better
 * than mapping the wrong shape to a page of blank rows.
 */
export function expectArray(
	raw: UnknownJson, // unknown: the response body, checked below
	operation: string,
): readonly UnknownJson[] {
	if (!Array.isArray(raw)) {
		throw new Error(`${operation} expected an array from Similarweb.`);
	}
	return raw;
}
