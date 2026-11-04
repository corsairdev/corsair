import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SurfRequestOptions } from '../client';
import { makeSurfRequest } from '../client';
import type { SurfContext } from '../index';

type Schema<T> = z.ZodType<T>;
type Built = Omit<SurfRequestOptions, 'baseUrl'>;

export async function callSurf<TInput, TOutput>(
	ctx: SurfContext,
	operation: string,
	inputSchema: Schema<TInput>,
	outputSchema: Schema<TOutput>,
	// Caller input is untyped until inputSchema.parse.
	input: unknown,
	build: (validated: TInput) => Built & { url: string },
	logFields: (validated: TInput) => Record<string, string>,
): Promise<TOutput> {
	if (!ctx.key) throw new AuthMissingError('surf', 'api_key');
	const validated = inputSchema.parse(input);
	const { url, ...request } = build(validated);
	// The HTTP body is untyped until outputSchema.parse below.
	const raw = await makeSurfRequest<unknown>(url, ctx.key, {
		...request,
		baseUrl: ctx.options.baseUrl,
	});
	const response = outputSchema.parse(raw);
	await logEventFromContext(ctx, operation, logFields(validated), 'completed');
	return response;
}
