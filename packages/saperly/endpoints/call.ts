import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SaperlyRequestOptions } from '../client';
import { makeSaperlyRecordingRequest, makeSaperlyRequest } from '../client';
import type { SaperlyContext } from '../index';

type Schema<T> = z.ZodType<T>;

type BuiltRequest = SaperlyRequestOptions & { url: string };

export async function callSaperly<TInput, TOutput>(
	ctx: SaperlyContext,
	operation: string,
	inputSchema: Schema<TInput>,
	outputSchema: Schema<TOutput>,
	// Caller input is untyped until inputSchema.parse. The schema is the boundary.
	input: unknown,
	build: (validated: TInput) => BuiltRequest,
	// Each endpoint logs a different subset, so the field bag stays open.
	logFields: (validated: TInput, response: TOutput) => Record<string, unknown>,
): Promise<TOutput> {
	if (!ctx.key) {
		throw new AuthMissingError('saperly', 'api_key');
	}
	const validated = inputSchema.parse(input);
	const { url, ...request } = build(validated);
	// The HTTP body is untyped until outputSchema.parse below.
	const raw = await makeSaperlyRequest<unknown>(url, ctx.key, {
		...request,
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

export async function callSaperlyRecording<TInput, TOutput>(
	ctx: SaperlyContext,
	operation: string,
	inputSchema: Schema<TInput>,
	outputSchema: Schema<TOutput>,
	// Caller input is untyped until inputSchema.parse. The schema is the boundary.
	input: unknown,
	build: (validated: TInput) => { url: string; path: Record<string, string> },
	// Each endpoint logs a different subset, so the field bag stays open.
	logFields: (validated: TInput, response: TOutput) => Record<string, unknown>,
): Promise<TOutput> {
	if (!ctx.key) {
		throw new AuthMissingError('saperly', 'api_key');
	}
	const validated = inputSchema.parse(input);
	const built = build(validated);
	const raw = await makeSaperlyRecordingRequest(built.url, ctx.key, {
		baseUrl: ctx.options.baseUrl,
		path: built.path,
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

export function idempotencyHeaders(
	key: string | undefined,
): Record<string, string> | undefined {
	if (!key) return undefined;
	return { 'Idempotency-Key': key };
}

// Undefined optional fields are omitted. The shared client accepts an open object.
export function omitUndefined<T extends Record<string, unknown>>(
	value: T,
): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [field, fieldValue] of Object.entries(value)) {
		if (fieldValue !== undefined) {
			out[field] = fieldValue;
		}
	}
	return out;
}
