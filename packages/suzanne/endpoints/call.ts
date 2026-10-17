import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SuzanneRequestOptions } from '../client';
import { makeSuzanneDownloadRequest, makeSuzanneRequest } from '../client';
import type { SuzanneContext } from '../index';
import { knownStatus } from '../schema/database';
import { rememberJob } from './persist';

type Schema<T> = z.ZodType<T>;
type BuiltRequest = SuzanneRequestOptions & { url: string };

export async function callSuzanne<TInput, TOutput>(
	ctx: SuzanneContext,
	operation: string,
	inputSchema: Schema<TInput>,
	outputSchema: Schema<TOutput>,
	// Caller input is untyped until inputSchema.parse. The schema is the boundary.
	input: unknown,
	build: (validated: TInput) => BuiltRequest,
	logFields: (
		validated: TInput,
		response: TOutput,
	) => Record<string, unknown> | Promise<Record<string, unknown>>,
): Promise<TOutput> {
	if (!ctx.key) throw new AuthMissingError('suzanne', 'api_key');
	const validated = inputSchema.parse(input);
	const { url, ...request } = build(validated);
	// The HTTP body is untyped until outputSchema.parse below.
	const raw = await makeSuzanneRequest<unknown>(url, ctx.key, {
		...request,
		baseUrl: ctx.options.baseUrl,
	});
	const response = outputSchema.parse(raw);
	await logEventFromContext(
		ctx,
		operation,
		await logFields(validated, response),
		'completed',
	);
	return response;
}

export async function callSuzanneDownload<TInput, TOutput>(
	ctx: SuzanneContext,
	operation: string,
	inputSchema: Schema<TInput>,
	outputSchema: Schema<TOutput>,
	// Caller input is untyped until inputSchema.parse. The schema is the boundary.
	input: unknown,
	build: (validated: TInput) => { jobId: string; format: string },
	logFields: (validated: TInput, response: TOutput) => Record<string, unknown>,
): Promise<TOutput> {
	if (!ctx.key) throw new AuthMissingError('suzanne', 'api_key');
	const validated = inputSchema.parse(input);
	const built = build(validated);
	const raw = await makeSuzanneDownloadRequest(ctx.key, {
		baseUrl: ctx.options.baseUrl,
		jobId: built.jobId,
		format: built.format,
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
		if (fieldValue !== undefined) out[field] = fieldValue;
	}
	return out;
}

export async function rememberAccepted(
	ctx: SuzanneContext,
	job: {
		job_id: string;
		status: string;
		created_at: string;
		billable_amount_cents: number;
	},
	model: string,
): Promise<void> {
	await rememberJob(ctx, {
		jobId: job.job_id,
		status: knownStatus(job.status),
		providerCreatedAt: job.created_at,
		billableAmountCents: job.billable_amount_cents,
		model,
	});
}
