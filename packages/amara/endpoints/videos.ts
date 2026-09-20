import { logEventFromContext } from 'corsair/core';
import {
	compactQuery,
	encodeAmaraPathSegment,
	makeAmaraRequest,
} from '../client';
import type { AmaraEndpoints } from '../index';
import {
	ActivityListResponseSchema,
	EmptyOkSchema,
	SubtitleActionsListSchema,
	SubtitleLanguageListResponseSchema,
	SubtitleLanguageSchema,
	SubtitleNoteSchema,
	SubtitleNotesListResponseSchema,
	SubtitlesResourceSchema,
	VideoListResponseSchema,
	VideoSchema,
	VideoUrlListResponseSchema,
	VideoUrlSchema,
} from './types';

function videoPath(videoId: string): string {
	return `videos/${encodeAmaraPathSegment(videoId)}/`;
}

function langPath(videoId: string, languageCode: string): string {
	return `${videoPath(videoId)}languages/${encodeAmaraPathSegment(languageCode)}/`;
}

function subtitlesPath(videoId: string, languageCode: string): string {
	return `${langPath(videoId, languageCode)}subtitles/`;
}

export const list: AmaraEndpoints['videosList'] = async (ctx, input) => {
	const raw = await makeAmaraRequest('videos/', ctx.key, {
		query: compactQuery({
			// Amara docs use `order_by` for sort control.
			order_by: input.sort,
			team: input.team,
			limit: input.limit,
			owner: input.owner,
			offset: input.offset,
			archive: input.archive,
			project: input.project,
			language: input.language,
			video_id: input.video_id,
			video_url: input.video_url,
		}),
	});
	const response = VideoListResponseSchema.parse(raw);
	await logEventFromContext(ctx, 'amara.videos.list', {}, 'completed');
	return response;
};

export const viewDetails: AmaraEndpoints['videosViewDetails'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(videoPath(input.video_id), ctx.key);
	const response = VideoSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.videos.viewDetails',
		{ video_id: input.video_id },
		'completed',
	);
	return response;
};

export const create: AmaraEndpoints['videosCreate'] = async (ctx, input) => {
	const raw = await makeAmaraRequest('videos/', ctx.key, {
		method: 'POST',
		body: input,
	});
	const response = VideoSchema.parse(raw);
	await logEventFromContext(ctx, 'amara.videos.create', {}, 'completed');
	return response;
};

export const update: AmaraEndpoints['videosUpdate'] = async (ctx, input) => {
	const { video_id, ...body } = input;
	const raw = await makeAmaraRequest(videoPath(video_id), ctx.key, {
		method: 'PUT',
		body,
	});
	const response = VideoSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.videos.update',
		{ video_id },
		'completed',
	);
	return response;
};

export const listActivity: AmaraEndpoints['videosListActivity'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`${videoPath(input.video_id)}activity/`,
		ctx.key,
		{
			query: compactQuery({
				limit: input.limit,
				offset: input.offset,
			}),
		},
	);
	const response = ActivityListResponseSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.videos.listActivity',
		{ video_id: input.video_id },
		'completed',
	);
	return response;
};

export const listUrls: AmaraEndpoints['videosListUrls'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`${videoPath(input.video_id)}urls/`,
		ctx.key,
		{
			query: compactQuery({
				limit: input.limit,
				offset: input.offset,
			}),
		},
	);
	const response = VideoUrlListResponseSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.videos.listUrls',
		{ video_id: input.video_id },
		'completed',
	);
	return response;
};

export const addUrl: AmaraEndpoints['videosAddUrl'] = async (ctx, input) => {
	const { video_id, url, primary } = input;
	const raw = await makeAmaraRequest(`${videoPath(video_id)}urls/`, ctx.key, {
		method: 'POST',
		body: { url, ...(primary !== undefined ? { primary } : {}) },
	});
	const response = VideoUrlSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.videos.addUrl',
		{ video_id },
		'completed',
	);
	return response;
};

export const getUrl: AmaraEndpoints['videosGetUrl'] = async (ctx, input) => {
	const raw = await makeAmaraRequest(
		`${videoPath(input.video_id)}urls/${encodeURIComponent(String(input.url_id))}/`,
		ctx.key,
	);
	const response = VideoUrlSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.videos.getUrl',
		{ video_id: input.video_id, url_id: input.url_id },
		'completed',
	);
	return response;
};

export const deleteUrl: AmaraEndpoints['videosDeleteUrl'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`${videoPath(input.video_id)}urls/${encodeURIComponent(String(input.url_id))}/`,
		ctx.key,
		{ method: 'DELETE' },
	);
	const response = EmptyOkSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.videos.deleteUrl',
		{ video_id: input.video_id, url_id: input.url_id },
		'completed',
	);
	return response;
};

export const makeUrlPrimary: AmaraEndpoints['videosMakeUrlPrimary'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`${videoPath(input.video_id)}urls/${encodeURIComponent(String(input.url_id))}/`,
		ctx.key,
		{ method: 'PUT', body: { primary: input.primary } },
	);
	const response = VideoUrlSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.videos.makeUrlPrimary',
		{ video_id: input.video_id, url_id: input.url_id },
		'completed',
	);
	return response;
};

export const getUrlDetails: AmaraEndpoints['videosGetUrlDetails'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest('videos/', ctx.key, {
		query: compactQuery({ video_url: input.url, limit: 1 }),
	});
	const response = VideoListResponseSchema.parse(raw);
	await logEventFromContext(ctx, 'amara.videos.getUrlDetails', {}, 'completed');
	return response;
};

export const listSubtitleLanguages: AmaraEndpoints['videosListSubtitleLanguages'] =
	async (ctx, input) => {
		const raw = await makeAmaraRequest(
			`${videoPath(input.video_id)}languages/`,
			ctx.key,
			{
				query: compactQuery({
					limit: input.limit,
					offset: input.offset,
				}),
			},
		);
		const response = SubtitleLanguageListResponseSchema.parse(raw);
		await logEventFromContext(
			ctx,
			'amara.videos.listSubtitleLanguages',
			{ video_id: input.video_id },
			'completed',
		);
		return response;
	};

export const getSubtitleLanguageDetails: AmaraEndpoints['videosGetSubtitleLanguageDetails'] =
	async (ctx, input) => {
		const raw = await makeAmaraRequest(
			langPath(input.video_id, input.language_code),
			ctx.key,
		);
		const response = SubtitleLanguageSchema.parse(raw);
		await logEventFromContext(
			ctx,
			'amara.videos.getSubtitleLanguageDetails',
			{ video_id: input.video_id, language_code: input.language_code },
			'completed',
		);
		return response;
	};

export const createSubtitleLanguage: AmaraEndpoints['videosCreateSubtitleLanguage'] =
	async (ctx, input) => {
		const { video_id, ...body } = input;
		const raw = await makeAmaraRequest(
			`${videoPath(video_id)}languages/`,
			ctx.key,
			{ method: 'POST', body },
		);
		const response = SubtitleLanguageSchema.parse(raw);
		await logEventFromContext(
			ctx,
			'amara.videos.createSubtitleLanguage',
			{ video_id },
			'completed',
		);
		return response;
	};

export const updateSubtitleLanguage: AmaraEndpoints['videosUpdateSubtitleLanguage'] =
	async (ctx, input) => {
		const { video_id, language_code, ...body } = input;
		const raw = await makeAmaraRequest(
			langPath(video_id, language_code),
			ctx.key,
			{ method: 'PUT', body },
		);
		const response = SubtitleLanguageSchema.parse(raw);
		await logEventFromContext(
			ctx,
			'amara.videos.updateSubtitleLanguage',
			{ video_id, language_code },
			'completed',
		);
		return response;
	};

export const fetchSubtitlesData: AmaraEndpoints['videosFetchSubtitlesData'] =
	async (ctx, input) => {
		const subFormat = input.sub_format ?? input.format ?? 'json';
		const raw = await makeAmaraRequest(
			subtitlesPath(input.video_id, input.language_code),
			ctx.key,
			{ query: compactQuery({ sub_format: subFormat }) },
		);
		const response = SubtitlesResourceSchema.parse(raw);
		await logEventFromContext(
			ctx,
			'amara.videos.fetchSubtitlesData',
			{ video_id: input.video_id, language_code: input.language_code },
			'completed',
		);
		return response;
	};

export const createSubtitles: AmaraEndpoints['videosCreateSubtitles'] = async (
	ctx,
	input,
) => {
	const { video_id, language_code, ...body } = input;
	const raw = await makeAmaraRequest(
		subtitlesPath(video_id, language_code),
		ctx.key,
		{ method: 'POST', body },
	);
	const response = SubtitlesResourceSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.videos.createSubtitles',
		{ video_id, language_code },
		'completed',
	);
	return response;
};

export const listSubtitleActions: AmaraEndpoints['videosListSubtitleActions'] =
	async (ctx, input) => {
		const raw = await makeAmaraRequest(
			`${subtitlesPath(input.video_id, input.language_code)}actions/`,
			ctx.key,
		);
		const response = SubtitleActionsListSchema.parse(raw);
		await logEventFromContext(
			ctx,
			'amara.videos.listSubtitleActions',
			{ video_id: input.video_id, language_code: input.language_code },
			'completed',
		);
		return response;
	};

export const performSubtitleAction: AmaraEndpoints['videosPerformSubtitleAction'] =
	async (ctx, input) => {
		const raw = await makeAmaraRequest(
			`${subtitlesPath(input.video_id, input.language_code)}actions/`,
			ctx.key,
			{ method: 'POST', body: { action: input.action } },
		);
		const response = EmptyOkSchema.parse(raw);
		await logEventFromContext(
			ctx,
			'amara.videos.performSubtitleAction',
			{ video_id: input.video_id, language_code: input.language_code },
			'completed',
		);
		return response;
	};

export const listSubtitleNotes: AmaraEndpoints['videosListSubtitleNotes'] =
	async (ctx, input) => {
		const raw = await makeAmaraRequest(
			`${subtitlesPath(input.video_id, input.language_code)}notes/`,
			ctx.key,
			{
				query: compactQuery({
					limit: input.limit,
					offset: input.offset,
				}),
			},
		);
		const response = SubtitleNotesListResponseSchema.parse(raw);
		await logEventFromContext(
			ctx,
			'amara.videos.listSubtitleNotes',
			{ video_id: input.video_id, language_code: input.language_code },
			'completed',
		);
		return response;
	};

export const addSubtitleNote: AmaraEndpoints['videosAddSubtitleNote'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`${subtitlesPath(input.video_id, input.language_code)}notes/`,
		ctx.key,
		{ method: 'POST', body: { body: input.body } },
	);
	const response = SubtitleNoteSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.videos.addSubtitleNote',
		{ video_id: input.video_id, language_code: input.language_code },
		'completed',
	);
	return response;
};
