import { logEventFromContext } from 'corsair/core';
import { makeScrapegraphAiRequest } from '../client';
import type { ScrapegraphAiEndpoints } from '../index';
import type {
	AccountCreditsResponse,
	AccountUsageTimelineResponse,
	AccountValidateApiKeyResponse,
} from './types';

export const credits: ScrapegraphAiEndpoints['accountCredits'] = async (
	ctx,
) => {
	const response = await makeScrapegraphAiRequest<AccountCreditsResponse>(
		'v1/credits',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'scrapegraphai.account.credits',
		{},
		'completed',
	);
	return response;
};

export const validateApiKey: ScrapegraphAiEndpoints['accountValidateApiKey'] =
	async (ctx) => {
		const response =
			await makeScrapegraphAiRequest<AccountValidateApiKeyResponse>(
				'v1/validate',
				ctx.key,
				{ method: 'GET' },
			);

		await logEventFromContext(
			ctx,
			'scrapegraphai.account.validateApiKey',
			{},
			'completed',
		);
		return response;
	};

export const usageTimeline: ScrapegraphAiEndpoints['accountUsageTimeline'] =
	async (ctx, input) => {
		const response =
			await makeScrapegraphAiRequest<AccountUsageTimelineResponse>(
				'v1/usage/timeline',
				ctx.key,
				{ method: 'GET', query: { ...input } },
			);

		await logEventFromContext(
			ctx,
			'scrapegraphai.account.usageTimeline',
			{ ...input },
			'completed',
		);
		return response;
	};
