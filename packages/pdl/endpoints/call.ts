import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PdlContext } from '../index';

type Schema<T> = z.ZodType<T>;

export async function callPdl<TInput, TOutput>(
	ctx: PdlContext,
	operation: string,
	inputSchema: Schema<TInput>,
	outputSchema: Schema<TOutput>,
	// Untrusted until inputSchema.parse vouches for it below.
	input: unknown,
	// HTTP JSON is not TOutput until outputSchema.parse runs below.
	exec: (validated: TInput) => Promise<unknown>,
	// Free-form event metadata, not part of the endpoint contract.
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
