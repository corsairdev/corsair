import { logEventFromContext } from 'corsair/core';
import type { SupadataEndpoints } from '..';
import { makeSupadataRequest } from '../client';
import {
	SupadataEndpointInputSchemas,
	SupadataEndpointOutputSchemas,
} from './types';

export const getTranscript: SupadataEndpoints['transcriptGet'] = async (
	ctx,
	input,
) => {
	const parsed = SupadataEndpointInputSchemas.transcriptGet.parse(input);

	const response = await makeSupadataRequest<unknown>('transcript', ctx.key, {
		method: 'GET',
		query: {
			url: parsed.url,
			lang: parsed.lang,
			text: parsed.text,
			chunkSize: parsed.chunkSize,
			mode: parsed.mode,
		},
	});

	const result = SupadataEndpointOutputSchemas.transcriptGet.parse(response);

	// Log only non-sensitive metadata — do not log the URL or transcript content.
	await logEventFromContext(
		ctx,
		'supadata.transcript.get',
		{
			lang: parsed.lang,
			text: parsed.text,
			mode: parsed.mode,
		},
		'completed',
	);

	return result;
};

export const getTranscriptJob: SupadataEndpoints['transcriptGetJob'] = async (
	ctx,
	input,
) => {
	const parsed = SupadataEndpointInputSchemas.transcriptGetJob.parse(input);

	const response = await makeSupadataRequest<unknown>(
		`transcript/${encodeURIComponent(parsed.jobId)}`,
		ctx.key,
		{ method: 'GET' },
	);

	const result = SupadataEndpointOutputSchemas.transcriptGetJob.parse(response);

	// Log only the job status — not the raw jobId as it may be treated as sensitive.
	await logEventFromContext(
		ctx,
		'supadata.transcript.getJob',
		{ status: result.status },
		'completed',
	);

	return result;
};

export const getMetadata: SupadataEndpoints['metadataGet'] = async (
	ctx,
	input,
) => {
	const parsed = SupadataEndpointInputSchemas.metadataGet.parse(input);

	const response = await makeSupadataRequest<unknown>('metadata', ctx.key, {
		method: 'GET',
		query: { url: parsed.url },
	});

	const result = SupadataEndpointOutputSchemas.metadataGet.parse(response);

	// Log only the detected platform — do not log the raw URL.
	await logEventFromContext(
		ctx,
		'supadata.metadata.get',
		{ platform: result.platform },
		'completed',
	);

	return result;
};

export const scrapeWeb: SupadataEndpoints['webScrape'] = async (ctx, input) => {
	const parsed = SupadataEndpointInputSchemas.webScrape.parse(input);

	const response = await makeSupadataRequest<unknown>('web/scrape', ctx.key, {
		method: 'GET',
		query: {
			url: parsed.url,
			noLinks: parsed.noLinks,
			lang: parsed.lang,
		},
	});

	const result = SupadataEndpointOutputSchemas.webScrape.parse(response);

	// Log only bounded metadata — do not log the raw URL or scraped content.
	await logEventFromContext(
		ctx,
		'supadata.web.scrape',
		{
			noLinks: parsed.noLinks,
			countCharacters: result.countCharacters,
		},
		'completed',
	);

	return result;
};

export const mapWeb: SupadataEndpoints['webMap'] = async (ctx, input) => {
	const parsed = SupadataEndpointInputSchemas.webMap.parse(input);

	const response = await makeSupadataRequest<unknown>('web/map', ctx.key, {
		method: 'GET',
		query: {
			url: parsed.url,
			limit: parsed.limit,
		},
	});

	const result = SupadataEndpointOutputSchemas.webMap.parse(response);

	// Log only bounded metadata — do not log the raw URL or discovered URLs.
	await logEventFromContext(
		ctx,
		'supadata.web.map',
		{ limit: parsed.limit },
		'completed',
	);

	return result;
};

export const searchYoutube: SupadataEndpoints['youtubeSearch'] = async (
	ctx,
	input,
) => {
	const parsed = SupadataEndpointInputSchemas.youtubeSearch.parse(input);

	const response = await makeSupadataRequest<unknown>(
		'youtube/search',
		ctx.key,
		{
			method: 'GET',
			query: {
				query: parsed.query,
				type: parsed.type,
				limit: parsed.limit,
				uploadDate: parsed.uploadDate,
				sortBy: parsed.sortBy,
				duration: parsed.duration,
				features: parsed.features,
				nextPageToken: parsed.nextPageToken,
			},
		},
	);

	const result = SupadataEndpointOutputSchemas.youtubeSearch.parse(response);

	// Log only safe bounded metadata — do not log the raw search query.
	await logEventFromContext(
		ctx,
		'supadata.youtube.search',
		{
			type: parsed.type,
			sortBy: parsed.sortBy,
			limit: parsed.limit,
			resultCount: result.results.length,
		},
		'completed',
	);

	return result;
};
