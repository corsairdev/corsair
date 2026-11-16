import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { TemplatedContext } from '..';
import type { TemplatedRequest } from '../client';
import { makeTemplatedRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the result, then logs the
 * event. Inputs are not logged whole, because render payloads can hold client
 * data; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: TemplatedContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => TemplatedRequest,
	options: {
		// unknown: raw is the response body. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeTemplatedRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`templated.${operation.event}`,
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
	ctx: TemplatedContext,
	operation: {
		event: string;
		input: Input;
		output: z.ZodType<{ success: true }>;
	},
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => TemplatedRequest,
): Promise<{ success: true }> {
	const parsed = operation.input.parse(rawInput ?? {});
	await makeTemplatedRequest(ctx.key, toRequest(parsed));

	await logEventFromContext(
		ctx,
		`templated.${operation.event}`,
		{},
		'completed',
	);
	return operation.output.parse({ success: true });
}
