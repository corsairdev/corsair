import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { TeltelContext } from '..';
import type { TeltelRequest } from '../client';
import { makeTeltelRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * TelTEL expects every request body wrapped in `data`, and every response
 * payload wrapped the same way. `toBody` returns the inner object and the
 * wrapper is applied before the request. Inputs are not logged whole, because
 * messages and contacts carry phone numbers; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: TeltelContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	// unknown: the inner body values are already validated by the input schema
	// and are passed through as the provider's `data` value.
	toBody: ((parsed: z.output<Input>) => unknown) | undefined,
	toRequest: (parsed: z.output<Input>) => Omit<TeltelRequest, 'body'>,
	options: {
		// unknown: raw is the response body. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const request = toRequest(parsed);
	const raw = await makeTeltelRequest(ctx.key, {
		...request,
		body: toBody ? { data: toBody(parsed) } : undefined,
	});
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`teltel.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * The deletes and updates answer `{ meta: { deleted: true } }` or
 * `{ meta: { updated: true } }` and nothing else, so there is no record to
 * unwrap; the envelope is parsed as it arrives.
 */
export async function metaResultCall<
	Input extends z.ZodType,
	Output extends z.ZodType,
>(
	ctx: TeltelContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => Omit<TeltelRequest, 'body'>,
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeTeltelRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(raw);

	await logEventFromContext(ctx, `teltel.${operation.event}`, {}, 'completed');
	return result;
}
