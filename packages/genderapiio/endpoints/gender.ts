import { logEventFromContext } from 'corsair/core';
import type { GenderApiIoContext, GenderApiIoEndpoints } from '..';
import type { GenderApiIoCredentials } from '../client';
import { makeGenderApiIoRequest } from '../client';
import {
	GenderApiIoEndpointInputSchemas,
	GenderApiIoEndpointOutputSchemas,
} from './types';

/**
 * The key comes from the key builder (`ctx.key`), so a key set by a before hook
 * or the plugin option is the one sent. An empty key is deliberate here:
 * GenderAPI.io falls back to an IP-scoped trial instead of refusing, and the
 * response says which mode was used.
 */
function resolveCredentials(ctx: GenderApiIoContext): GenderApiIoCredentials {
	return { apiKey: ctx.key || undefined };
}

/**
 * The single lookup works as a GET with query parameters and as a POST with a
 * JSON body. The plugin uses POST, where the v2 schema takes `ai_mode` only
 * under `options` and refuses unknown top-level fields with a 422.
 */
function aiOptions(aiMode: string | undefined) {
	return aiMode === undefined ? undefined : { ai_mode: aiMode };
}

export const gender: GenderApiIoEndpoints['gender']['infer'] = async (
	ctx,
	input,
) => {
	const parsed = GenderApiIoEndpointInputSchemas.gender.parse(input ?? {});

	const raw = await makeGenderApiIoRequest(resolveCredentials(ctx), {
		method: 'POST',
		path: '/api/v2/gender',
		body: {
			type: parsed.type,
			value: parsed.value,
			country: parsed.country,
			forceToGenderize: parsed.forceToGenderize,
			options: aiOptions(parsed.ai_mode),
		},
	});

	const result = GenderApiIoEndpointOutputSchemas.gender.parse(raw);

	await logEventFromContext(
		ctx,
		'genderapiio.gender.infer',
		{
			// The value is personal data, so the log keeps the outcome and the cost.
			type: parsed.type,
			gender: result.data.gender ?? 'unknown',
			source: result.data.source,
			confidence: result.data.confidence,
			charged_credits: result.meta.usage?.charged_credits,
			// `ip_trial` is worth knowing: it means no key was configured.
			access_mode: result.meta.access?.mode,
		},
		'completed',
	);
	return result;
};

export const genderBatch: GenderApiIoEndpoints['gender']['batch'] = async (
	ctx,
	input,
) => {
	const parsed = GenderApiIoEndpointInputSchemas.genderBatch.parse(input ?? {});

	const raw = await makeGenderApiIoRequest(resolveCredentials(ctx), {
		method: 'POST',
		path: '/api/v2/gender/batch',
		body: {
			// The batch schema has no top-level `ai_mode`: each item carries its own
			// under `options`. An item's own mode wins over the batch-wide one.
			items: parsed.items.map(({ ai_mode, ...item }) => ({
				...item,
				options: aiOptions(ai_mode ?? parsed.ai_mode),
			})),
		},
	});

	const result = GenderApiIoEndpointOutputSchemas.genderBatch.parse(raw);

	await logEventFromContext(
		ctx,
		'genderapiio.gender.batch',
		{
			// Only successful items are billed, so the summary is the useful record.
			total: result.meta.summary?.total ?? result.data.length,
			succeeded: result.meta.summary?.succeeded,
			failed: result.meta.summary?.failed,
			unknown: result.meta.summary?.unknown,
			charged_credits: result.meta.usage?.charged_credits,
		},
		'completed',
	);
	return result;
};

export const phoneValidate: GenderApiIoEndpoints['phone']['validate'] = async (
	ctx,
	input,
) => {
	const parsed = GenderApiIoEndpointInputSchemas.phoneValidate.parse(
		input ?? {},
	);

	const raw = await makeGenderApiIoRequest(resolveCredentials(ctx), {
		method: 'POST',
		path: '/api/v2/phone/validate',
		body: { number: parsed.number, country: parsed.country },
	});

	const result = GenderApiIoEndpointOutputSchemas.phoneValidate.parse(raw);

	await logEventFromContext(
		ctx,
		'genderapiio.phone.validate',
		{
			// The number itself is personal data, so only the verdict is logged.
			valid: result.data.valid,
			possible: result.data.possible,
			country: result.data.country,
			charged_credits: result.meta.usage?.charged_credits,
		},
		'completed',
	);
	return result;
};

/**
 * The balance is free to read, so it is safe to poll. A trial and a paid
 * account answer the same shape, and `meta.access.mode` says which one this is.
 */
export const usage: GenderApiIoEndpoints['account']['usage'] = async (
	ctx,
	input,
) => {
	GenderApiIoEndpointInputSchemas.usage.parse(input ?? {});

	const raw = await makeGenderApiIoRequest(resolveCredentials(ctx), {
		method: 'GET',
		path: '/api/v2/usage',
	});

	const result = GenderApiIoEndpointOutputSchemas.usage.parse(raw);

	await logEventFromContext(
		ctx,
		'genderapiio.account.usage',
		{
			remaining_credits: result.data.remaining_credits,
			limit: result.data.limit,
			access_mode: result.meta.access?.mode,
		},
		'completed',
	);
	return result;
};

/** Free: the deployment version, its limits and whether AI is available. */
export const capabilities: GenderApiIoEndpoints['account']['capabilities'] =
	async (ctx, input) => {
		GenderApiIoEndpointInputSchemas.capabilities.parse(input ?? {});

		const raw = await makeGenderApiIoRequest(resolveCredentials(ctx), {
			method: 'GET',
			path: '/api/v2',
		});

		const result = GenderApiIoEndpointOutputSchemas.capabilities.parse(raw);

		await logEventFromContext(
			ctx,
			'genderapiio.account.capabilities',
			{
				version: result.version,
				ai: result.capabilities?.ai,
				max_batch_items: result.capabilities?.max_batch_items,
			},
			'completed',
		);
		return result;
	};

/** Free: every error code with its statuses and what a caller should do. */
export const errorCatalog: GenderApiIoEndpoints['account']['errorCatalog'] =
	async (ctx, input) => {
		GenderApiIoEndpointInputSchemas.errorCatalog.parse(input ?? {});

		const raw = await makeGenderApiIoRequest(resolveCredentials(ctx), {
			method: 'GET',
			path: '/api/v2/errors',
		});

		const result = GenderApiIoEndpointOutputSchemas.errorCatalog.parse(raw);

		await logEventFromContext(
			ctx,
			'genderapiio.account.errorCatalog',
			{ codes: Object.keys(result.errors).length },
			'completed',
		);
		return result;
	};
