import { logEventFromContext } from 'corsair/core';
import { makeListennotesRequest, serializeFormBody } from '../client';
import type { ListennotesEndpoints } from '../index';
import type {
	PodcastsAudienceResponse,
	PodcastsBatchResponse,
	PodcastsByDomainResponse,
	PodcastsDeleteResponse,
	PodcastsGetBestResponse,
	PodcastsGetEpisodesResponse,
	PodcastsGetRecommendationsResponse,
	PodcastsGetResponse,
	PodcastsRefreshRssResponse,
	PodcastsSubmitResponse,
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
		`/podcasts/${encodeURIComponent(id)}`,
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

export const getBatch: ListennotesEndpoints['podcasts.getBatch'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['podcasts.getBatch'].parse(input);
	const body = serializeFormBody(parsedInput);
	const response = await makeListennotesRequest<PodcastsBatchResponse>(
		'/podcasts',
		ctx.key,
		{
			method: 'POST',
			body,
			mediaType: 'application/x-www-form-urlencoded',
		},
	);
	const parsed =
		ListennotesEndpointOutputSchemas['podcasts.getBatch'].parse(response);
	await logEventFromContext(
		ctx,
		'listennotes.podcasts.getBatch',
		{ count: parsed.podcasts.length },
		'completed',
	);
	return parsed;
};

export const deletePodcast: ListennotesEndpoints['podcasts.delete'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['podcasts.delete'].parse(input);
	const { id, reason } = parsedInput;
	const response = await makeListennotesRequest<PodcastsDeleteResponse>(
		`/podcasts/${encodeURIComponent(id)}`,
		ctx.key,
		{ method: 'DELETE', query: { reason } },
	);
	const parsed =
		ListennotesEndpointOutputSchemas['podcasts.delete'].parse(response);
	await logEventFromContext(
		ctx,
		'listennotes.podcasts.delete',
		{ status: parsed.status },
		'completed',
	);
	return parsed;
};

export const submit: ListennotesEndpoints['podcasts.submit'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['podcasts.submit'].parse(input);
	const body = serializeFormBody(parsedInput);
	const response = await makeListennotesRequest<PodcastsSubmitResponse>(
		'/podcasts/submit',
		ctx.key,
		{
			method: 'POST',
			body,
			mediaType: 'application/x-www-form-urlencoded',
		},
	);
	const parsed =
		ListennotesEndpointOutputSchemas['podcasts.submit'].parse(response);
	await logEventFromContext(
		ctx,
		'listennotes.podcasts.submit',
		{ status: parsed.status },
		'completed',
	);
	return parsed;
};

export const refreshRss: ListennotesEndpoints['podcasts.refreshRss'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['podcasts.refreshRss'].parse(input);
	const response = await makeListennotesRequest<PodcastsRefreshRssResponse>(
		`/podcasts/${encodeURIComponent(parsedInput.id)}/rss`,
		ctx.key,
		{ method: 'POST' },
	);
	const parsed =
		ListennotesEndpointOutputSchemas['podcasts.refreshRss'].parse(response);
	await logEventFromContext(
		ctx,
		'listennotes.podcasts.refreshRss',
		{ status: parsed.status },
		'completed',
	);
	return parsed;
};

export const getAudience: ListennotesEndpoints['podcasts.getAudience'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['podcasts.getAudience'].parse(input);
	const response = await makeListennotesRequest<PodcastsAudienceResponse>(
		`/podcasts/${encodeURIComponent(parsedInput.id)}/audience`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed =
		ListennotesEndpointOutputSchemas['podcasts.getAudience'].parse(response);
	await logEventFromContext(
		ctx,
		'listennotes.podcasts.getAudience',
		{ count: parsed.by_regions?.length ?? 0 },
		'completed',
	);
	return parsed;
};

export const getByDomain: ListennotesEndpoints['podcasts.getByDomain'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['podcasts.getByDomain'].parse(input);
	const { domain_name, ...query } = parsedInput;
	const response = await makeListennotesRequest<PodcastsByDomainResponse>(
		`/podcasts/domains/${encodeURIComponent(domain_name)}`,
		ctx.key,
		{ method: 'GET', query },
	);
	const parsed =
		ListennotesEndpointOutputSchemas['podcasts.getByDomain'].parse(response);
	await logEventFromContext(
		ctx,
		'listennotes.podcasts.getByDomain',
		{ count: parsed.podcasts.length },
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
