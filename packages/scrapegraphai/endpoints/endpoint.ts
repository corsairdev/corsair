import { logEventFromContext } from 'corsair/core';
import { makeScrapegraphAiRequest } from '../client';
import type { ScrapegraphAiEndpoints } from '../index';
import type {
	EndpointGetSuggestionsResponse,
	EndpointSaveResponse,
} from './types';

export const getSuggestions: ScrapegraphAiEndpoints['endpointGetSuggestions'] =
	async (ctx, input) => {
		const response =
			await makeScrapegraphAiRequest<EndpointGetSuggestionsResponse>(
				'v1/endpoint/get-suggestions',
				ctx.key,
				{ method: 'POST', body: input },
			);

		await logEventFromContext(
			ctx,
			'scrapegraphai.endpoint.getSuggestions',
			{ ...input },
			'completed',
		);
		return response;
	};

export const save: ScrapegraphAiEndpoints['endpointSave'] = async (
	ctx,
	input,
) => {
	const response = await makeScrapegraphAiRequest<EndpointSaveResponse>(
		'v1/endpoint/save-endpoint',
		ctx.key,
		{ method: 'POST', body: input },
	);

	await logEventFromContext(
		ctx,
		'scrapegraphai.endpoint.save',
		{ ...input },
		'completed',
	);
	return response;
};
