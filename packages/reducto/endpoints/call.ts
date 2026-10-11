import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ReductoRequestOptions } from '../client';
import { makeReductoRequest } from '../client';
import type { ReductoContext } from '../index';
import { rememberJob } from './cache';

type Schema<T> = z.ZodType<T>;

export async function callReducto<TInput, TOutput>(
	ctx: ReductoContext,
	operation: string,
	inputSchema: Schema<TInput>,
	outputSchema: Schema<TOutput>,
	// unknown: endpoint input is raw until inputSchema.parse.
	input: unknown,
	build: (validated: TInput) => ReductoRequestOptions & { url: string },
	logFields: (validated: TInput, response: TOutput) => Record<string, unknown>,
	remember = true,
): Promise<TOutput> {
	const validated = inputSchema.parse(input);
	const { url, ...request } = build(validated);
	// unknown: the HTTP body is untyped until outputSchema.parse below.
	const raw = await makeReductoRequest<unknown>(url, ctx.key, {
		...request,
		baseUrl: ctx.options.baseUrl,
	});
	const response = outputSchema.parse(raw);
	const requestedJobId =
		validated !== null &&
		typeof validated === 'object' &&
		'job_id' in validated &&
		typeof validated.job_id === 'string'
			? validated.job_id
			: undefined;
	if (remember) await rememberJob(ctx, response, requestedJobId);
	await logEventFromContext(
		ctx,
		operation,
		logFields(validated, response),
		'completed',
	);
	return response;
}
