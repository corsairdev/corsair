import { logEventFromContext } from 'corsair/core';
import type { ListennotesEndpoints } from '..';
import { makeListennotesRequest } from '../client';
import type {
	EpisodesGetRecommendationsResponse,
	EpisodesGetResponse,
} from './types';
import {
	ListennotesEndpointInputSchemas,
	ListennotesEndpointOutputSchemas,
} from './types';

export const get: ListennotesEndpoints['episodes.get'] = async (ctx, input) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['episodes.get'].parse(input);
	const { id, ...query } = parsedInput;

	const response = await makeListennotesRequest<EpisodesGetResponse>(
		`/episodes/${encodeURIComponent(id)}`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const parsed =
		ListennotesEndpointOutputSchemas['episodes.get'].parse(response);

	await logEventFromContext(
		ctx,
		'listennotes.episodes.get',
		{ id },
		'completed',
	);

	return parsed;
};

export const getRecommendations: ListennotesEndpoints['episodes.getRecommendations'] =
	async (ctx, input) => {
		const parsedInput =
			ListennotesEndpointInputSchemas['episodes.getRecommendations'].parse(
				input,
			);
		const { id, ...query } = parsedInput;

		const response =
			await makeListennotesRequest<EpisodesGetRecommendationsResponse>(
				`/episodes/${encodeURIComponent(id)}/recommendations`,
				ctx.key,
				{
					method: 'GET',
					query,
				},
			);

		const parsed =
			ListennotesEndpointOutputSchemas['episodes.getRecommendations'].parse(
				response,
			);

		await logEventFromContext(
			ctx,
			'listennotes.episodes.getRecommendations',
			{ id },
			'completed',
		);

		return parsed;
	};
