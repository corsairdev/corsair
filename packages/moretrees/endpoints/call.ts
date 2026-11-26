import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { MoreTreesContext } from '..';
import type { MoreTreesRequest } from '../client';
import { makeMoreTreesRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs
 * the event. The More Trees external API is reads, one CO2 calculation and
 * one planting POST.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: MoreTreesContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (
		parsed: z.output<Input>,
		ctx: MoreTreesContext,
	) => MoreTreesRequest | Promise<MoreTreesRequest>,
	options: {
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeMoreTreesRequest(ctx, await toRequest(parsed, ctx));
	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`moretrees.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
