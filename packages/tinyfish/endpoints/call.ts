import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { TinyFishContext } from '../index';

type Schema<T> = z.ZodType<T>;

/**
 * Nothing reaches the wire without passing the input schema, and nothing
 * reaches the caller without passing the output schema. `persist` runs after
 * validation and before logging, so the stored row matches the response.
 */
export async function callTinyFish<TInput, TOutput>(
	ctx: TinyFishContext,
	operation: string,
	inputSchema: Schema<TInput>,
	outputSchema: Schema<TOutput>,
	input: unknown,
	exec: (validated: TInput) => Promise<unknown>,
	logFields: (validated: TInput, response: TOutput) => Record<string, unknown>,
	persist?: (validated: TInput, response: TOutput) => Promise<void>,
): Promise<TOutput> {
	const validated = inputSchema.parse(input);
	const response = outputSchema.parse(await exec(validated));
	if (persist) {
		await persist(validated, response);
	}
	await logEventFromContext(
		ctx,
		operation,
		logFields(validated, response),
		'completed',
	);
	return response;
}
