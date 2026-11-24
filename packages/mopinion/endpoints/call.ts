import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { MopinionContext } from '..';
import type { MopinionRequest } from '../client';
import { makeMopinionRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. The whole v3 data API is read-only.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: MopinionContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (
		parsed: z.output<Input>,
	) => MopinionRequest | Promise<MopinionRequest>,
	options: {
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeMopinionRequest(ctx, await toRequest(parsed));
	// The output schema is loose: it validates the documented `_meta` block
	// and passes the undocumented resource fields through untouched.
	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`mopinion.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
