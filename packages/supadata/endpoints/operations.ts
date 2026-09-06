import { logEventFromContext } from 'corsair/core';
import type { SupadataEndpoints } from '..';
import { makeSupadataRequest } from '../client';
import type { SupadataEndpointOutputs } from './types';

export const getTranscript: SupadataEndpoints['transcriptGet'] = async (
	ctx,
	input,
) => {
	const response = await makeSupadataRequest<
		SupadataEndpointOutputs['transcriptGet']
	>('transcript', ctx.key, {
		method: 'GET',
		query: {
			url: input.url,
			lang: input.lang,
			text: input.text,
			chunkSize: input.chunkSize,
			mode: input.mode,
		},
	});

	await logEventFromContext(
		ctx,
		'supadata.transcript.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const getTranscriptJob: SupadataEndpoints['transcriptGetJob'] = async (
	ctx,
	input,
) => {
	const response = await makeSupadataRequest<
		SupadataEndpointOutputs['transcriptGetJob']
	>(`transcript/${input.jobId}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'supadata.transcript.getJob',
		{ ...input },
		'completed',
	);
	return response;
};

export const getMetadata: SupadataEndpoints['metadataGet'] = async (
	ctx,
	input,
) => {
	const response = await makeSupadataRequest<
		SupadataEndpointOutputs['metadataGet']
	>('metadata', ctx.key, {
		method: 'GET',
		query: {
			url: input.url,
		},
	});

	await logEventFromContext(
		ctx,
		'supadata.metadata.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const scrapeWeb: SupadataEndpoints['webScrape'] = async (ctx, input) => {
	const response = await makeSupadataRequest<
		SupadataEndpointOutputs['webScrape']
	>('web/scrape', ctx.key, {
		method: 'GET',
		query: {
			url: input.url,
			noLinks: input.noLinks,
		},
	});

	await logEventFromContext(
		ctx,
		'supadata.web.scrape',
		{ ...input },
		'completed',
	);
	return response;
};

export const mapWeb: SupadataEndpoints['webMap'] = async (ctx, input) => {
	const response = await makeSupadataRequest<SupadataEndpointOutputs['webMap']>(
		'web/map',
		ctx.key,
		{
			method: 'GET',
			query: {
				url: input.url,
				limit: input.limit,
			},
		},
	);

	await logEventFromContext(ctx, 'supadata.web.map', { ...input }, 'completed');
	return response;
};

export const searchYoutube: SupadataEndpoints['youtubeSearch'] = async (
	ctx,
	input,
) => {
	const response = await makeSupadataRequest<
		SupadataEndpointOutputs['youtubeSearch']
	>('youtube/search', ctx.key, {
		method: 'GET',
		query: {
			query: input.query,
			type: input.type,
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'supadata.youtube.search',
		{ ...input },
		'completed',
	);
	return response;
};
