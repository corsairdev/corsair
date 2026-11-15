import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { HappyScribeContext } from '..';
import type { HappyScribeRequest } from '../client';
import { makeHappyScribeRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

export async function safeLog(
	ctx: HappyScribeContext,
	event: string,
	fields: () => LogFields,
): Promise<void> {
	try {
		await logEventFromContext(ctx, event, fields(), 'completed');
	} catch (error) {
		console.warn(`Failed to log ${event}:`, error);
	}
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged, because transcripts carry
 * conversation content; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: HappyScribeContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => HappyScribeRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeHappyScribeRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await safeLog(
		ctx,
		`happyscribe.${operation.event}`,
		() => options.log?.(parsed, result) ?? {},
	);
	return result;
}
