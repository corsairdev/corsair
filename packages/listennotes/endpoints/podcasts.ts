import { logEventFromContext } from 'corsair/core';
import type { ListennotesEndpoints } from '..';
import { makeListennotesRequest } from '../client';
import type {
	PodcastsGetBestResponse,
	PodcastsGetEpisodesResponse,
	PodcastsGetRecommendationsResponse,
	PodcastsGetResponse,
} from './types';
import {
	ListennotesEndpointInputSchemas,
	ListennotesEndpointOutputSchemas,
} from './types';

export const get: ListennotesEndpoints['podcasts.get'] = async (ctx, input) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['podcasts.get'].parse(input);
	const { id, ...query } = parsedInput;

	const response = await makeListennotesRequest<PodcastsGetResponse>(
		`/podcasts/${encodeURIComponent(id)}`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const parsed =
		ListennotesEndpointOutputSchemas['podcasts.get'].parse(response);

	await logEventFromContext(
		ctx,
		'listennotes.podcasts.get',
		{ id },
		'completed',
	);

	return parsed;
};

export const getEpisodes: ListennotesEndpoints['podcasts.getEpisodes'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['podcasts.getEpisodes'].parse(input);
	const { id, ...query } = parsedInput;

	const response = await makeListennotesRequest<PodcastsGetEpisodesResponse>(
		`/podcasts/${encodeURIComponent(id)}/episodes`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const parsed =
		ListennotesEndpointOutputSchemas['podcasts.getEpisodes'].parse(response);

	await logEventFromContext(
		ctx,
		'listennotes.podcasts.getEpisodes',
		{ id },
		'completed',
	);

	return parsed;
};

export const getRecommendations: ListennotesEndpoints['podcasts.getRecommendations'] =
	async (ctx, input) => {
		const parsedInput =
			ListennotesEndpointInputSchemas['podcasts.getRecommendations'].parse(
				input,
			);
		const { id, ...query } = parsedInput;

		const response =
			await makeListennotesRequest<PodcastsGetRecommendationsResponse>(
				`/podcasts/${encodeURIComponent(id)}/recommendations`,
				ctx.key,
				{
					method: 'GET',
					query,
				},
			);

		const parsed =
			ListennotesEndpointOutputSchemas['podcasts.getRecommendations'].parse(
				response,
			);

		await logEventFromContext(
			ctx,
			'listennotes.podcasts.getRecommendations',
			{ id },
			'completed',
		);

		return parsed;
	};

export const getBest: ListennotesEndpoints['podcasts.getBest'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['podcasts.getBest'].parse(input);

	const response = await makeListennotesRequest<PodcastsGetBestResponse>(
		'/best_podcasts',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
		},
	);

	const parsed =
		ListennotesEndpointOutputSchemas['podcasts.getBest'].parse(response);

	await logEventFromContext(
		ctx,
		'listennotes.podcasts.getBest',
		{ count: parsed.podcasts.length },
		'completed',
	);

	return parsed;
};
