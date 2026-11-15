import type { SpotlightrEndpoints } from '..';
import { call, flag, idList } from './call';
import {
	SpotlightrEndpointInputSchemas,
	SpotlightrEndpointOutputSchemas,
} from './types';

export const list: SpotlightrEndpoints['videosList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'videos.list',
			input: SpotlightrEndpointInputSchemas.listVideos,
			output: SpotlightrEndpointOutputSchemas.listVideos,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'api/videos',
			query: {
				videoID: parsed.video_id,
				videoGroup: parsed.video_group,
			},
		}),
		{ log: (_parsed, result) => ({ videos: result.length }) },
	);

export const create: SpotlightrEndpoints['videosCreate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'videos.create',
			input: SpotlightrEndpointInputSchemas.createVideo,
			output: SpotlightrEndpointOutputSchemas.createVideo,
		},
		input,
		(parsed) => {
			// A file makes this multipart; otherwise `URL` goes in a form body,
			// which is the shape the reference's upload example uses.
			const formData: Record<string, string | Blob | undefined> = {
				name: parsed.name,
				URL: parsed.url,
				file: parsed.file,
				customS3:
					parsed.custom_s3 === undefined ? undefined : String(parsed.custom_s3),
				hls:
					flag(parsed.hls) === undefined ? undefined : String(flag(parsed.hls)),
				videoGroup:
					parsed.video_group === undefined
						? undefined
						: String(parsed.video_group),
				create:
					flag(parsed.create) === undefined
						? undefined
						: String(flag(parsed.create)),
				playerSettings: parsed.player_settings,
			};
			return { method: 'POST', path: 'api/createVideo', formData };
		},
		{
			log: (parsed) => ({
				name: parsed.name,
				has_file: parsed.file !== undefined,
				video_group: parsed.video_group,
			}),
		},
	);

export const updateSource: SpotlightrEndpoints['videosUpdateSource'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'videos.updateSource',
			input: SpotlightrEndpointInputSchemas.updateVideoSource,
			output: SpotlightrEndpointOutputSchemas.updateVideoSource,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'api/videoSource',
			query: { id: parsed.video_id, URL: parsed.url },
		}),
		{ log: (parsed) => ({ video_id: parsed.video_id }) },
	);

export const remove: SpotlightrEndpoints['videosDelete'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'videos.delete',
			input: SpotlightrEndpointInputSchemas.deleteVideos,
			output: SpotlightrEndpointOutputSchemas.deleteVideos,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'api/deleteVideo',
			// The reference documents `IDs` as an array such as `[1234,5678]`;
			// `getFormData` would send an array as repeated fields, so it is sent
			// as one comma-separated value instead.
			formData: { IDs: idList(parsed.video_ids) },
		}),
		{ log: (parsed) => ({ videos: parsed.video_ids.length }) },
	);

export const listTop: SpotlightrEndpoints['videosListTop'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'videos.listTop',
			input: SpotlightrEndpointInputSchemas.listTopVideos,
			output: SpotlightrEndpointOutputSchemas.listTopVideos,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'api/getTopVideos',
			query: { days: parsed.days, total: parsed.total },
		}),
		{ log: (parsed, result) => ({ days: parsed.days, videos: result.length }) },
	);

export const metrics: SpotlightrEndpoints['videosMetrics'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'videos.metrics',
			input: SpotlightrEndpointInputSchemas.getVideoMetrics,
			output: SpotlightrEndpointOutputSchemas.getVideoMetrics,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'api/video/metrics',
			query: { videoID: parsed.video_id },
		}),
		{ log: (parsed) => ({ video_id: parsed.video_id }) },
	);

export const views: SpotlightrEndpoints['videosViews'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'videos.views',
			input: SpotlightrEndpointInputSchemas.listViews,
			output: SpotlightrEndpointOutputSchemas.listViews,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'api/views/getViews',
			query: {
				videoID: parsed.video_id,
				customViewerID: parsed.custom_viewer_id,
				onlyWatched: flag(parsed.only_watched),
				allViews: flag(parsed.all_views),
			},
		}),
		{
			log: (parsed, result) => ({
				video_id: parsed.video_id,
				views: result.length,
			}),
		},
	);

export const updateSettings: SpotlightrEndpoints['videosUpdateSettings'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'videos.updateSettings',
				input: SpotlightrEndpointInputSchemas.updatePlayerSettings,
				output: SpotlightrEndpointOutputSchemas.updatePlayerSettings,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: 'video/updateSettings',
				body: { id: parsed.video_id, settings: parsed.settings },
			}),
			{
				log: (parsed) => ({
					video_id: parsed.video_id,
					settings: Object.keys(parsed.settings).length,
				}),
			},
		);
