import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { TaxJarContext } from '..';
import type { TaxJarRequest } from '../client';
import { makeTaxJarRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the result, then logs the
 * event. Inputs are not logged whole, because transaction and customer records
 * hold addresses and names; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: TaxJarContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => TaxJarRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeTaxJarRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`taxjar.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * The deletes answer 204 with no body, so there is nothing to parse and the
 * endpoint reports what it did. Returning the raw body would turn an empty
 * answer into a fake record.
 */
export async function callDelete<Input extends z.ZodType>(
	ctx: TaxJarContext,
	operation: { event: string; input: Input },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => TaxJarRequest,
): Promise<{ success: true }> {
	const parsed = operation.input.parse(rawInput ?? {});
	await makeTaxJarRequest(ctx.key, toRequest(parsed));

	await logEventFromContext(ctx, `taxjar.${operation.event}`, {}, 'completed');
	return { success: true };
}
