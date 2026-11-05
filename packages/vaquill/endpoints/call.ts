import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { VaquillContext } from '../index';

type Schema<T> = z.ZodType<T>;

export async function callVaquill<TInput, TOutput>(
	ctx: VaquillContext,
	operation: string,
	inputSchema: Schema<TInput>,
	outputSchema: Schema<TOutput>,
	// Tool-call arguments arrive unparsed from the agent; the zod parse below
	// is the validation boundary.
	input: unknown,
	// Each endpoint resolves its own vendor response shape; the caller's
	// outputSchema parses whatever this resolves to.
	exec: (validated: TInput) => Promise<unknown>,
	// Log values are arbitrary scalars chosen per operation.
	logFields: (validated: TInput, response: TOutput) => Record<string, unknown>,
): Promise<TOutput> {
	const validated = inputSchema.parse(input);
	const response = outputSchema.parse(await exec(validated));
	await logEventFromContext(
		ctx,
		operation,
		logFields(validated, response),
		'completed',
	);
	return response;
}
