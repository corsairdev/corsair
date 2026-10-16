import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PloidRequestOptions } from '../client';
import { makePloidRequest } from '../client';
import type { PloidContext } from '../index';

type Schema<T> = z.ZodType<T>;

export async function callPloid<TInput, TOutput>(
	ctx: PloidContext,
	operation: string,
	inputSchema: Schema<TInput>,
	outputSchema: Schema<TOutput>,
	// unknown: endpoint input is raw until inputSchema.parse.
	input: unknown,
	build: (validated: TInput) => PloidRequestOptions & { url: string },
	logFields: (validated: TInput, response: TOutput) => Record<string, unknown>,
	remember?: (validated: TInput, response: TOutput) => Promise<void>,
): Promise<TOutput> {
	const validated = inputSchema.parse(input);
	const { url, ...request } = build(validated);
	// unknown: the HTTP body is untyped until outputSchema.parse below.
	const raw = await makePloidRequest<unknown>(url, ctx.key, {
		...request,
		baseUrl: ctx.options.baseUrl,
	});
	const response = outputSchema.parse(raw);
	if (remember !== undefined) await remember(validated, response);
	await logEventFromContext(
		ctx,
		operation,
		logFields(validated, response),
		'completed',
	);
	return response;
}
