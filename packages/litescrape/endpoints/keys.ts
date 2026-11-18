import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { makeLitescrapeRequest } from '../client';
import type { LitescrapeContext } from '../index';

// Key operations, documented at https://litescrape.com/docs/key-status. The
// OpenAPI spec leaves both response bodies untyped, so these two schemas are
// written from the docs and a live response (11-19); unlisted fields pass through.

export const KeysStatusInputSchema = z.object({}).strict();

export const KeysStatusResponseSchema = z
	.object({
		remaining_calls: z.number(),
		concurrency_limit: z.number(),
		status: z.string(),
		zdr_enabled: z.boolean().optional(),
		zdr_available: z.boolean().optional(),
		credit_expiry_months: z.number().nullish(),
		credits_expire_at: z.string().nullish(),
		expiring_calls: z.number().nullish(),
		cents_per_1000_calls: z.number().nullish(),
	})
	.passthrough();

export const KeysUsageInputSchema = z
	.object({
		range: z
			.enum(['24h', '7d', '30d', '90d'])
			.optional()
			.describe('Reporting window ending now. Defaults to 30d.'),
		tz: z
			.string()
			.min(1)
			.max(64)
			.optional()
			.describe(
				'IANA timezone for the buckets, such as UTC or America/Chicago.',
			),
	})
	.strict();

const UsageCountsSchema = z
	.object({
		requests: z.number().nullish(),
		succeeded: z.number().nullish(),
		failed: z.number().nullish(),
		pending: z.number().nullish(),
		success_rate: z.number().nullish(),
		p50_ms: z.number().nullish(),
		p95_ms: z.number().nullish(),
	})
	.passthrough();

export const KeysUsageResponseSchema = z
	.object({
		range: z.string().nullish(),
		bucket: z.string().nullish(),
		timezone: z.string().nullish(),
		since: z.string().nullish(),
		until: z.string().nullish(),
		totals: UsageCountsSchema.nullish(),
		previous: UsageCountsSchema.nullish(),
		series: z
			.array(UsageCountsSchema.extend({ bucket: z.string().nullish() }))
			.nullish(),
		// Per-API, provider, channel and error breakdowns; their item shape is not documented.
		// `unknown` is necessary because Litescrape doesn't document the shape of these breakdown rows.
		apis: z.array(z.unknown()).nullish(),
		providers: z.array(z.unknown()).nullish(),
		channels: z.array(z.unknown()).nullish(),
		errors: z.array(z.unknown()).nullish(),
	})
	.passthrough();

export type KeysStatusInput = z.infer<typeof KeysStatusInputSchema>;
export type KeysStatusResponse = z.infer<typeof KeysStatusResponseSchema>;
export type KeysUsageInput = z.infer<typeof KeysUsageInputSchema>;
export type KeysUsageResponse = z.infer<typeof KeysUsageResponseSchema>;

export const status: CorsairEndpoint<
	LitescrapeContext,
	KeysStatusInput,
	KeysStatusResponse
> = async (ctx, input) => {
	KeysStatusInputSchema.parse(input ?? {});
	// `unknown` is necessary because the response is untrusted JSON until KeysStatusResponseSchema parses it.
	const response = await makeLitescrapeRequest<unknown>(
		'/api/keys/status',
		ctx.key,
		{ method: 'GET' },
	);
	const parsed = KeysStatusResponseSchema.parse(response);
	// Account-scoped billing data, not request content: nothing from it is logged.
	await logEventFromContext(ctx, 'litescrape.keys.status', {}, 'completed');
	return parsed;
};

export const usage: CorsairEndpoint<
	LitescrapeContext,
	KeysUsageInput,
	KeysUsageResponse
> = async (ctx, input) => {
	const parsedInput = KeysUsageInputSchema.parse(input ?? {});
	// `unknown` is necessary because the response is untrusted JSON until KeysUsageResponseSchema parses it.
	const response = await makeLitescrapeRequest<unknown>('/api/usage', ctx.key, {
		method: 'GET',
		query: { range: parsedInput.range, tz: parsedInput.tz },
	});
	const parsed = KeysUsageResponseSchema.parse(response);
	await logEventFromContext(ctx, 'litescrape.keys.usage', {}, 'completed');
	return parsed;
};
