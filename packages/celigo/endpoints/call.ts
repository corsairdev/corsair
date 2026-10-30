import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { CeligoQueryValue } from '../client';
import { makeCeligoRequest } from '../client';
import type { CeligoContext } from '../index';
import type { CeligoEntity } from './db';
import { deleteEntity, saveEntities } from './db';

export type CeligoRoute = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	// Each segment is URL-encoded on its own, so an id can never add a path level.
	path: string[];
	query?: Record<string, CeligoQueryValue>;
	// Safe: the body is built from input the endpoint schema already validated.
	// A narrower type is not practical because the body shape differs per endpoint.
	body?: unknown;
	// Celigo answers 204 with no body for deletes, patches and empty lists.
	// This value stands in for the missing body and goes through the output schema.
	// Safe: the output schema parses it like a real response.
	// A narrower type is not practical because each endpoint has its own output shape.
	empty?: unknown;
	// Text responses (debug logs, state writes) are wrapped under this key.
	wrap?: string;
	// Entity table that receives the documents this call returns.
	save?: CeligoEntity;
	// Entity table whose row for path[1] is removed once the call succeeds.
	drop?: CeligoEntity;
};

export async function callCeligo<TInput, TOutput>(
	ctx: CeligoContext,
	operation: string,
	inputSchema: z.ZodType<TInput>,
	outputSchema: z.ZodType<TOutput>,
	// Safe: inputSchema.parse validates it on the next line.
	// A narrower type is not practical because callers pass raw, untrusted input.
	input: unknown,
	route: (input: TInput) => CeligoRoute,
): Promise<TOutput> {
	const validated = inputSchema.parse(input);
	const { method, path, query, body, empty, wrap, save, drop } =
		route(validated);
	const raw = await makeCeligoRequest(
		path.map(encodeURIComponent).join('/'),
		ctx.key,
		{ method, query, body, region: ctx.options.region },
	);
	const filled = raw === undefined || raw === '' ? empty : raw;
	const response = outputSchema.parse(wrap ? { [wrap]: filled ?? '' } : filled);
	// include and exclude return partial documents, and a partial row would
	// overwrite the stored full one.
	const projected =
		query?.include !== undefined || query?.exclude !== undefined;
	if (save && !projected) await saveEntities(ctx, save, response);
	if (drop && path[1]) await deleteEntity(ctx, drop, path[1]);
	await logEventFromContext(ctx, `celigo.${operation}`, {}, 'completed');
	return response;
}
