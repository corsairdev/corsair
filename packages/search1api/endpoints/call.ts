import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { Search1APIContext } from '../index';

type Schema<T> = z.ZodType<T>;

export async function callSearch1API<TInput, TOutput>(
	ctx: Search1APIContext,
	operation: string,
	inputSchema: Schema<TInput>,
	outputSchema: Schema<TOutput>,
	// agent input arrives unvalidated; the input schema parse below gates it
	input: unknown,
	// the transport hands back an unparsed body; outputSchema owns its shape
	exec: (validated: TInput) => Promise<unknown>,
	// log payloads mix endpoint-specific fields, so the value type stays open
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
