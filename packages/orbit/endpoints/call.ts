import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { OrbitRequestOptions } from '../client';
import { makeOrbitRequest } from '../client';
import type { OrbitContext } from '../index';

type Schema<T> = z.ZodType<T>;
type Built = Omit<OrbitRequestOptions, 'baseUrl'> & {
	url: string;
	idempotencyKey?: string;
};

export async function callOrbit<TInput, TOutput>(
	ctx: OrbitContext,
	operation: string,
	inputSchema: Schema<TInput>,
	outputSchema: Schema<TOutput>,
	// Caller input is untyped until inputSchema.parse.
	input: unknown,
	build: (validated: TInput) => Built,
	logFields: (validated: TInput, response: TOutput) => Record<string, string>,
): Promise<TOutput> {
	if (!ctx.key) throw new AuthMissingError('orbit', 'api_key');
	const validated = inputSchema.parse(input);
	const { url, idempotencyKey, headers, ...request } = build(validated);
	// The HTTP body is untyped until outputSchema.parse below.
	const raw = await makeOrbitRequest<unknown>(url, ctx.key, {
		...request,
		headers: {
			...headers,
			...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
		},
		baseUrl: ctx.options.baseUrl,
	});
	const response = outputSchema.parse(raw);
	await logEventFromContext(
		ctx,
		operation,
		logFields(validated, response),
		'completed',
	);
	return response;
}

// Optional request fields are removed before the body is sent. The helper is generic over that object.
export function omitUndefined<T extends Record<string, unknown>>(value: T): T {
	const next = { ...value };
	for (const key of Object.keys(next)) {
		if (next[key] === undefined) delete next[key];
	}
	return next;
}
