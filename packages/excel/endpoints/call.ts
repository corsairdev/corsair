import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ExcelRequestOptions } from '../client';
import { makeExcelRequest } from '../client';
import type { ExcelContext } from '../index';

type Schema<T> = z.ZodType<T>;

export async function callExcel<TInput, TOutput>(
	ctx: ExcelContext,
	operation: string,
	inputSchema: Schema<TInput>,
	outputSchema: Schema<TOutput>,
	// unknown: endpoint input is raw until inputSchema.parse.
	input: unknown,
	build: (validated: TInput) => ExcelRequestOptions & { url: string },
	logFields: (
		validated: TInput,
		response: TOutput,
	) => Record<string, string | number | boolean | null>,
): Promise<TOutput> {
	const validated = inputSchema.parse(input);
	const { url, ...request } = build(validated);
	// unknown: the HTTP body is untyped until outputSchema.parse below.
	const raw = await makeExcelRequest<unknown>(url, ctx.key, request);
	const response = outputSchema.parse(raw);
	await logEventFromContext(
		ctx,
		operation,
		logFields(validated, response),
		'completed',
	);
	return response;
}
