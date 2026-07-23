import { logEventFromContext } from 'corsair/core';
import { makeHeygenRequest } from '../client';
import type { HeygenEndpoints } from '../index';
import type { HeygenEndpointOutputs } from './types';

// Template generation/listing, the WebM export, personalized-video, delete, and list
// operations in this file have no published v3 equivalent per developers.heygen.com/
// endpoint-version-comparison ("Not yet available"), so they stay on their confirmed v1/v2
// paths until HeyGen ships v3 replacements.

// Migrated to HeyGen v3 API endpoint per developers.heygen.com
export const generate: HeygenEndpoints['videosGenerate'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['videosGenerate']
	>('/v3/videos', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'heygen.videos.generate',
		{ type: input.type },
		'completed',
	);
	return result;
};

export const templateGenerate: HeygenEndpoints['videosTemplateGenerate'] =
	async (ctx, input) => {
		const { template_id, ...body } = input;
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['videosTemplateGenerate']
		>(`/v2/template/${template_id}/generate`, ctx.key, {
			method: 'POST',
			body,
		});

		await logEventFromContext(
			ctx,
			'heygen.videos.templateGenerate',
			{ templateId: template_id },
			'completed',
		);
		return result;
	};

// [B] Path inferred as `/v1/video.webm`; see endpoints/types.ts for details.
export const createWebm: HeygenEndpoints['videosCreateWebm'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['videosCreateWebm']
	>('/v1/video.webm', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'heygen.videos.createWebm',
		{ avatarId: input.avatar_id },
		'completed',
	);
	return result;
};

export const personalizedAddContact: HeygenEndpoints['videosPersonalizedAddContact'] =
	async (ctx, input) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['videosPersonalizedAddContact']
		>('/v1/personalized_video/add_contact', ctx.key, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'heygen.videos.personalizedAddContact',
			{
				projectId: input.project_id,
				itemCount: input.variables_list.length,
			},
			'completed',
		);
		return result;
	};

export const personalizedProjectDetail: HeygenEndpoints['videosPersonalizedProjectDetail'] =
	async (ctx, input) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['videosPersonalizedProjectDetail']
		>('/v1/personalized_video/project/detail', ctx.key, {
			method: 'GET',
			query: { id: input.id },
		});

		await logEventFromContext(
			ctx,
			'heygen.videos.personalizedProjectDetail',
			{ projectId: input.id },
			'completed',
		);
		return result;
	};

// Migrated to HeyGen v3 API endpoint per developers.heygen.com
export const getStatus: HeygenEndpoints['videosGetStatus'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['videosGetStatus']
	>(`/v3/videos/${input.video_id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'heygen.videos.getStatus',
		{ videoId: input.video_id },
		'completed',
	);
	return result;
};

// Migrated to HeyGen v3 API endpoint per developers.heygen.com
export const translate: HeygenEndpoints['videosTranslate'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['videosTranslate']
	>('/v3/video-translations', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'heygen.videos.translate',
		{ outputLanguageCount: input.output_languages.length },
		'completed',
	);
	return result;
};

// Migrated to HeyGen v3 API endpoint per developers.heygen.com
export const translateStatus: HeygenEndpoints['videosTranslateStatus'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['videosTranslateStatus']
	>(`/v3/video-translations/${input.video_translate_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'heygen.videos.translateStatus',
		{ videoTranslateId: input.video_translate_id },
		'completed',
	);
	return result;
};

// Migrated to HeyGen v3 API endpoint per developers.heygen.com
export const translateTargetLanguages: HeygenEndpoints['videosTranslateTargetLanguages'] =
	async (ctx) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['videosTranslateTargetLanguages']
		>('/v3/video-translations/languages', ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'heygen.videos.translateTargetLanguages',
			{},
			'completed',
		);
		return result;
	};

// [B] Path inferred as `/v1/video/share`; see endpoints/types.ts for details.
export const getSharableUrl: HeygenEndpoints['videosGetSharableUrl'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['videosGetSharableUrl']
	>('/v1/video/share', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'heygen.videos.getSharableUrl',
		{ videoId: input.video_id },
		'completed',
	);
	return result;
};

export const deleteVideo: HeygenEndpoints['videosDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<HeygenEndpointOutputs['videosDelete']>(
		'/v1/video.delete',
		ctx.key,
		{ method: 'DELETE', query: { video_id: input.video_id } },
	);

	await logEventFromContext(
		ctx,
		'heygen.videos.delete',
		{ videoId: input.video_id },
		'completed',
	);
	return result;
};

export const list: HeygenEndpoints['videosList'] = async (ctx, input) => {
	const result = await makeHeygenRequest<HeygenEndpointOutputs['videosList']>(
		'/v1/video.list',
		ctx.key,
		{ method: 'GET', query: { limit: input.limit, token: input.token } },
	);

	await logEventFromContext(ctx, 'heygen.videos.list', {}, 'completed');
	return result;
};

// --- v3 additions, per developers.heygen.com. Named with a `V3` suffix since they'd
// otherwise collide with the legacy v1 `videos.list`/`videos.delete` operations above. ---

// Migrated to HeyGen v3 API per developers.heygen.com
export const listV3: HeygenEndpoints['videosListV3'] = async (ctx, input) => {
	const result = await makeHeygenRequest<HeygenEndpointOutputs['videosListV3']>(
		'/v3/videos',
		ctx.key,
		{
			method: 'GET',
			query: {
				limit: input.limit,
				token: input.token,
				folder_id: input.folder_id,
				title: input.title,
			},
		},
	);

	await logEventFromContext(ctx, 'heygen.videos.listV3', {}, 'completed');
	return result;
};

// Migrated to HeyGen v3 API per developers.heygen.com
export const deleteV3: HeygenEndpoints['videosDeleteV3'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['videosDeleteV3']
	>(`/v3/videos/${input.video_id}`, ctx.key, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'heygen.videos.deleteV3',
		{ videoId: input.video_id },
		'completed',
	);
	return result;
};
