import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedLinkedInRequest } from '../client';
import type { LinkedInEndpoints } from '../index';
import type { LinkedInEndpointOutputs } from './types';

type Query = Record<string, string | number | boolean | undefined>;

export const getAdTargetingFacets: LinkedInEndpoints['GetAdTargetingFacets'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedLinkedInRequest<
			LinkedInEndpointOutputs['GetAdTargetingFacets']
		>('/v2/adTargetingFacets', ctx, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'linkedin.ads.getTargetingFacets',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getAudienceCounts: LinkedInEndpoints['GetAudienceCounts'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedLinkedInRequest<
		LinkedInEndpointOutputs['GetAudienceCounts']
	>('/v2/audienceCounts', ctx, {
		method: 'POST',
		body: { target: input.target },
	});

	await logEventFromContext(
		ctx,
		'linkedin.ads.getAudienceCounts',
		{ ...input },
		'completed',
	);
	return result;
};

export const searchAdTargetingEntities: LinkedInEndpoints['SearchAdTargetingEntities'] =
	async (ctx, input) => {
		const query: Query = {
			q: 'TYPEAHEAD',
			'typeahead.query.text': input.query,
		};
		if (input.type) {
			query['typeahead.type'] = input.type;
		}

		const result = await makeAuthenticatedLinkedInRequest<
			LinkedInEndpointOutputs['SearchAdTargetingEntities']
		>('/v2/adTargetingEntities', ctx, { method: 'GET', query });

		await logEventFromContext(
			ctx,
			'linkedin.ads.searchTargetingEntities',
			{ ...input },
			'completed',
		);
		return result;
	};
