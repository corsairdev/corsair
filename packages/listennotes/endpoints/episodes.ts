import { logEventFromContext } from 'corsair/core';
import { makeListennotesRequest, serializeFormBody } from '../client';
import type { ListennotesEndpoints } from '../index';
import type {
	EpisodesBatchResponse,
	EpisodesGetRecommendationsResponse,
	EpisodesGetResponse,
	EpisodesJustListenResponse,
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

export const getBatch: ListennotesEndpoints['episodes.getBatch'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['episodes.getBatch'].parse(input);
	const response = await makeListennotesRequest<EpisodesBatchResponse>(
		'/episodes',
		ctx.key,
		{
			method: 'POST',
			body: serializeFormBody(parsedInput),
			mediaType: 'application/x-www-form-urlencoded',
		},
	);
	const parsed =
		ListennotesEndpointOutputSchemas['episodes.getBatch'].parse(response);
	await logEventFromContext(
		ctx,
		'listennotes.episodes.getBatch',
		{ count: parsed.episodes.length },
		'completed',
	);
	return parsed;
};

export const justListen: ListennotesEndpoints['episodes.justListen'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['episodes.justListen'].parse(input);
	const response = await makeListennotesRequest<EpisodesJustListenResponse>(
		'/just_listen',
		ctx.key,
		{ method: 'GET', query: parsedInput },
	);
	const parsed =
		ListennotesEndpointOutputSchemas['episodes.justListen'].parse(response);
	await logEventFromContext(
		ctx,
		'listennotes.episodes.justListen',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};
