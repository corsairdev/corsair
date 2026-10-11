import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { CeligoQueryValue } from '../client';
import { makeCeligoRequest } from '../client';
import type { CeligoContext } from '../index';

export type CeligoRoute = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	// Each segment is URL-encoded on its own, so an id can never add a path level.
	path: string[];
	query?: Record<string, CeligoQueryValue>;
	body?: unknown;
	// Celigo answers 204 with no body for deletes, patches and empty lists.
	// This value stands in for the missing body.
	empty?: unknown;
	// Text responses (debug logs, state writes) are wrapped under this key.
	wrap?: string;
};

export async function callCeligo<TInput, TOutput>(
	ctx: CeligoContext,
	operation: string,
	inputSchema: z.ZodType<TInput>,
	outputSchema: z.ZodType<TOutput>,
	// unknown: endpoint input is raw until inputSchema.parse.
	input: unknown,
	route: (input: TInput) => CeligoRoute,
): Promise<TOutput> {
	const validated = inputSchema.parse(input);
	const { method, path, query, body, empty, wrap } = route(validated);
	const raw = await makeCeligoRequest(
		path.map(encodeURIComponent).join('/'),
		ctx.key,
		{ method, query, body, region: ctx.options.region },
	);
	const filled = raw === undefined || raw === '' ? empty : raw;
	const response = outputSchema.parse(wrap ? { [wrap]: filled ?? '' } : filled);
	await logEventFromContext(ctx, `celigo.${operation}`, {}, 'completed');
	return response;
}
