import { logEventFromContext } from 'corsair/core';
import type { SupadataEndpoints } from '..';
import { makeSupadataRequest } from '../client';
import {
	SupadataEndpointInputSchemas,
	SupadataEndpointOutputSchemas,
} from './types';

/**
 * Supadata operations.
 *
 * Every operation validates its input, issues exactly one request, validates
 * the response against the documented component schema, and logs only bounded,
 * non-sensitive metadata — never a target URL, a search query or transcript or
 * page content.
 */

export const getMe: SupadataEndpoints['accountMe'] = async (ctx, input) => {
	SupadataEndpointInputSchemas.accountMe.parse(input ?? {});

	const response = await makeSupadataRequest('me', ctx.key, { method: 'GET' });

	const result = SupadataEndpointOutputSchemas.accountMe.parse(response);

	await logEventFromContext(
		ctx,
		'supadata.account.me',
		{
			plan: result.plan,
			maxCredits: result.maxCredits,
			usedCredits: result.usedCredits,
		},
		'completed',
	);

	return result;
};

export const getTranscript: SupadataEndpoints['transcriptGet'] = async (
	ctx,
	input,
) => {
	const parsed = SupadataEndpointInputSchemas.transcriptGet.parse(input);

	const response = await makeSupadataRequest('transcript', ctx.key, {
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

	await logEventFromContext(
		ctx,
		'supadata.transcript.get',
		{
			lang: parsed.lang,
			text: parsed.text,
			mode: parsed.mode,
			// Large videos come back as a job handle instead of a transcript.
			async: 'jobId' in result,
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

	const response = await makeSupadataRequest(
		`transcript/${encodeURIComponent(parsed.jobId)}`,
		ctx.key,
		{ method: 'GET' },
	);

	const result = SupadataEndpointOutputSchemas.transcriptGetJob.parse(response);

	// Log the job status only — the id is treated as sensitive.
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

	const response = await makeSupadataRequest('metadata', ctx.key, {
		method: 'GET',
		query: { url: parsed.url },
	});

	const result = SupadataEndpointOutputSchemas.metadataGet.parse(response);

	await logEventFromContext(
		ctx,
		'supadata.metadata.get',
		{ platform: result.platform, type: result.type },
		'completed',
	);

	return result;
};

export const getYoutubeVideo: SupadataEndpoints['youtubeVideo'] = async (
	ctx,
	input,
) => {
	const parsed = SupadataEndpointInputSchemas.youtubeVideo.parse(input);

	const response = await makeSupadataRequest('youtube/video', ctx.key, {
		method: 'GET',
		query: { id: parsed.id },
	});

	const result = SupadataEndpointOutputSchemas.youtubeVideo.parse(response);

	await logEventFromContext(
		ctx,
		'supadata.youtube.video',
		{
			videoId: result.id,
			channelId: result.channel.id,
			isLive: result.isLive,
		},
		'completed',
	);

	return result;
};

export const getYoutubeChannel: SupadataEndpoints['youtubeChannel'] = async (
	ctx,
	input,
) => {
	const parsed = SupadataEndpointInputSchemas.youtubeChannel.parse(input);

	const response = await makeSupadataRequest('youtube/channel', ctx.key, {
		method: 'GET',
		query: { id: parsed.id },
	});

	const result = SupadataEndpointOutputSchemas.youtubeChannel.parse(response);

	await logEventFromContext(
		ctx,
		'supadata.youtube.channel',
		{ channelId: result.id, videoCount: result.videoCount },
		'completed',
	);

	return result;
};

export const getYoutubeChannelVideos: SupadataEndpoints['youtubeChannelVideos'] =
	async (ctx, input) => {
		const parsed =
			SupadataEndpointInputSchemas.youtubeChannelVideos.parse(input);

		const response = await makeSupadataRequest(
			'youtube/channel/videos',
			ctx.key,
			{
				method: 'GET',
				query: { id: parsed.id, limit: parsed.limit, type: parsed.type },
			},
		);

		const result =
			SupadataEndpointOutputSchemas.youtubeChannelVideos.parse(response);

		await logEventFromContext(
			ctx,
			'supadata.youtube.channelVideos',
			{
				type: parsed.type,
				limit: parsed.limit,
				videoCount: result.videoIds.length,
				shortCount: result.shortIds.length,
				liveCount: result.liveIds.length,
			},
			'completed',
		);

		return result;
	};

export const getYoutubePlaylist: SupadataEndpoints['youtubePlaylist'] = async (
	ctx,
	input,
) => {
	const parsed = SupadataEndpointInputSchemas.youtubePlaylist.parse(input);

	const response = await makeSupadataRequest('youtube/playlist', ctx.key, {
		method: 'GET',
		query: { id: parsed.id },
	});

	const result = SupadataEndpointOutputSchemas.youtubePlaylist.parse(response);

	await logEventFromContext(
		ctx,
		'supadata.youtube.playlist',
		{
			playlistId: result.id,
			videoCount: result.videoCount,
			channelId: result.channel.id,
		},
		'completed',
	);

	return result;
};

export const getYoutubePlaylistVideos: SupadataEndpoints['youtubePlaylistVideos'] =
	async (ctx, input) => {
		const parsed =
			SupadataEndpointInputSchemas.youtubePlaylistVideos.parse(input);

		const response = await makeSupadataRequest(
			'youtube/playlist/videos',
			ctx.key,
			{
				method: 'GET',
				query: { id: parsed.id, limit: parsed.limit },
			},
		);

		const result =
			SupadataEndpointOutputSchemas.youtubePlaylistVideos.parse(response);

		await logEventFromContext(
			ctx,
			'supadata.youtube.playlistVideos',
			{
				limit: parsed.limit,
				videoCount: result.videoIds.length,
				shortCount: result.shortIds.length,
				liveCount: result.liveIds.length,
			},
			'completed',
		);

		return result;
	};

export const searchYoutube: SupadataEndpoints['youtubeSearch'] = async (
	ctx,
	input,
) => {
	const parsed = SupadataEndpointInputSchemas.youtubeSearch.parse(input);

	const response = await makeSupadataRequest('youtube/search', ctx.key, {
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
	});

	const result = SupadataEndpointOutputSchemas.youtubeSearch.parse(response);

	// Log bounded metadata only — never the search query itself.
	await logEventFromContext(
		ctx,
		'supadata.youtube.search',
		{
			type: parsed.type,
			sortBy: parsed.sortBy,
			limit: parsed.limit,
			resultCount: result.results.length,
			hasNextPage: result.nextPageToken !== undefined,
		},
		'completed',
	);

	return result;
};

export const scrapeWeb: SupadataEndpoints['webScrape'] = async (ctx, input) => {
	const parsed = SupadataEndpointInputSchemas.webScrape.parse(input);

	const response = await makeSupadataRequest('web/scrape', ctx.key, {
		method: 'GET',
		query: {
			url: parsed.url,
			noLinks: parsed.noLinks,
			lang: parsed.lang,
		},
	});

	const result = SupadataEndpointOutputSchemas.webScrape.parse(response);

	// Never log the target URL or the scraped content.
	await logEventFromContext(
		ctx,
		'supadata.web.scrape',
		{
			noLinks: parsed.noLinks,
			lang: parsed.lang,
			countCharacters: result.countCharacters,
			linkCount: result.urls.length,
		},
		'completed',
	);

	return result;
};

export const mapWeb: SupadataEndpoints['webMap'] = async (ctx, input) => {
	const parsed = SupadataEndpointInputSchemas.webMap.parse(input);

	const response = await makeSupadataRequest('web/map', ctx.key, {
		method: 'GET',
		query: { url: parsed.url },
	});

	const result = SupadataEndpointOutputSchemas.webMap.parse(response);

	// Never log the target domain or the discovered URLs.
	await logEventFromContext(
		ctx,
		'supadata.web.map',
		{ urlCount: result.urls.length },
		'completed',
	);

	return result;
};
