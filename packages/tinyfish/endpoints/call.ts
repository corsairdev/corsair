import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { TinyFishContext } from '../index';

type Schema<T> = z.ZodType<T>;

/**
 * Nothing reaches the wire without passing the input schema, and nothing
 * reaches the caller without passing the output schema. `persist` runs after
 * validation and before logging, so the stored row matches the response.
 * TInput and TOutput stay caller-chosen: each endpoint schema owns its shape,
 * so a stricter shared generic is not practical.
 */
export async function callTinyFish<TInput, TOutput>(
	ctx: TinyFishContext,
	operation: string,
	inputSchema: Schema<TInput>,
	outputSchema: Schema<TOutput>,
	// Raw caller input. The input schema is the boundary, so a stricter
	// argument type here is not practical.
	input: unknown,
	// Provider JSON is untrusted until the output schema parses it, so a
	// stricter exec return is not practical.
	exec: (validated: TInput) => Promise<unknown>,
	// Log payloads are free-form key/value bags, so a stricter record is not
	// practical.
	logFields: (validated: TInput, response: TOutput) => Record<string, unknown>,
	persist?: (validated: TInput, response: TOutput) => Promise<void>,
): Promise<TOutput> {
	const validated = inputSchema.parse(input);
	const response = outputSchema.parse(await exec(validated));
	if (persist) {
		try {
			await persist(validated, response);
		} catch (error) {
			// The provider call already succeeded and may have been billed.
			// The stored row is a cache, so a database error must not hide
			// the response or trigger a retry.
			const detail = error instanceof Error ? error.message : String(error);
			console.error(
				`[TINYFISH:${operation}] persistence failed after a successful provider call: ${detail}`,
			);
		}
	}
	await logEventFromContext(
		ctx,
		operation,
		logFields(validated, response),
		'completed',
	);
	return response;
}
