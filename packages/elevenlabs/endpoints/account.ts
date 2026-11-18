import { elevenLabsJson, logQuietly, pathId } from '../client';
import type { ElevenLabsEndpoints } from '../index';
import {
	ElevenLabsEndpointInputSchemas,
	ElevenLabsEndpointOutputSchemas,
} from './types';

export const listModels: ElevenLabsEndpoints['modelsList'] = async (
	ctx,
	rawInput,
) => {
	ElevenLabsEndpointInputSchemas.modelsList.parse(rawInput ?? {});
	// unknown: the array before the schema parses it.
	const models = await elevenLabsJson<unknown[]>('/v1/models', ctx.key);
	const response = ElevenLabsEndpointOutputSchemas.modelsList.parse({ models });
	await logQuietly(ctx, 'elevenlabs.models.list', {
		count: response.models.length,
	});
	return response;
};

export const user: ElevenLabsEndpoints['accountUser'] = async (
	ctx,
	rawInput,
) => {
	ElevenLabsEndpointInputSchemas.accountUser.parse(rawInput ?? {});
	// The API reports the key itself here (or part of it). A result often ends up
	// in an agent's context and in logs, so it stops at this line.
	const {
		xi_api_key: _key,
		xi_api_key_preview: _preview,
		...rest
		// unknown: the body before the schema parses it; only the two key fields are named here.
	} = await elevenLabsJson<Record<string, unknown>>('/v1/user', ctx.key);
	const response = ElevenLabsEndpointOutputSchemas.accountUser.parse(rest);
	await logQuietly(ctx, 'elevenlabs.account.user', {});
	return response;
};

export const subscription: ElevenLabsEndpoints['accountSubscription'] = async (
	ctx,
	rawInput,
) => {
	ElevenLabsEndpointInputSchemas.accountSubscription.parse(rawInput ?? {});
	const response = ElevenLabsEndpointOutputSchemas.accountSubscription.parse(
		await elevenLabsJson('/v1/user/subscription', ctx.key),
	);
	await logQuietly(ctx, 'elevenlabs.account.subscription', {
		tier: response.tier,
	});
	return response;
};

/** The old /v1/usage/character-stats is deprecated in favour of this report. */
export const usageStats: ElevenLabsEndpoints['accountUsageStats'] = async (
	ctx,
	rawInput,
) => {
	const input =
		ElevenLabsEndpointInputSchemas.accountUsageStats.parse(rawInput);
	const response = ElevenLabsEndpointOutputSchemas.accountUsageStats.parse(
		await elevenLabsJson(
			'/v1/workspace/analytics/query/usage-by-product-over-time',
			ctx.key,
			{
				method: 'POST',
				json: {
					start_time: input.startTime,
					end_time: input.endTime,
					interval_seconds: input.intervalSeconds ?? 86400,
					group_by: input.groupBy,
					time_zone: input.timeZone,
				},
			},
		),
	);
	await logQuietly(ctx, 'elevenlabs.account.usageStats', {
		rows: response.rows?.length ?? 0,
	});
	return response;
};

export const createToken: ElevenLabsEndpoints['singleUseTokensCreate'] = async (
	ctx,
	rawInput,
) => {
	const input =
		ElevenLabsEndpointInputSchemas.singleUseTokensCreate.parse(rawInput);
	const response = ElevenLabsEndpointOutputSchemas.singleUseTokensCreate.parse(
		await elevenLabsJson(
			`/v1/single-use-token/${pathId(input.tokenType)}`,
			ctx.key,
			{ method: 'POST' },
		),
	);
	// The token is a credential, so only its type is logged.
	await logQuietly(ctx, 'elevenlabs.singleUseTokens.create', {
		tokenType: input.tokenType,
	});
	return response;
};
