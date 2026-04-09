import { logEventFromContext } from 'corsair/core';
import type { YoutubeEndpoints } from '..';
import { makeYoutubeRequest } from '../client';
import type { YoutubeEndpointOutputs } from './types';

export const listLanguages: YoutubeEndpoints['i18nListLanguages'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['i18nListLanguages']
	>('/i18nLanguages', ctx.key, {
		method: 'GET',
		query: {
			part: input.part ?? 'snippet',
			...(input.hl && { hl: input.hl }),
		},
	});

	await logEventFromContext(ctx, 'youtube.i18n.listLanguages', {}, 'completed');
	return response;
};

export const listRegions: YoutubeEndpoints['i18nListRegions'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['i18nListRegions']
	>('/i18nRegions', ctx.key, {
		method: 'GET',
		query: {
			part: input.part ?? 'snippet',
			...(input.hl && { hl: input.hl }),
		},
	});

	await logEventFromContext(ctx, 'youtube.i18n.listRegions', {}, 'completed');
	return response;
};

export const videoCategoriesList: YoutubeEndpoints['videoCategoriesList'] =
	async (ctx, input) => {
		const response = await makeYoutubeRequest<
			YoutubeEndpointOutputs['videoCategoriesList']
		>('/videoCategories', ctx.key, {
			method: 'GET',
			query: {
				part: input.part ?? 'snippet',
				...(input.hl && { hl: input.hl }),
				...(input.id && { id: input.id }),
				...(input.regionCode && { regionCode: input.regionCode }),
			},
		});

		await logEventFromContext(
			ctx,
			'youtube.videoCategories.list',
			{},
			'completed',
		);
		return response;
	};
