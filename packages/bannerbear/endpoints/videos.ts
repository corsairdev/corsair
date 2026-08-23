import { logEventFromContext } from 'corsair/core';
import type { BannerbearEndpoints } from '..';
import { makeBannerbearRequest } from '../client';
import type { BannerbearEndpointOutputs } from './types';

export const listVideos: BannerbearEndpoints['listVideos'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['listVideos']
	>('/v5/videos', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			limit: input.limit,
			project_id: input.project_id,
		},
	});
	await logEventFromContext(
		ctx,
		'bannerbear.videos.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const listVideoTemplates: BannerbearEndpoints['listVideoTemplates'] =
	async (ctx, input) => {
		const response = await makeBannerbearRequest<
			BannerbearEndpointOutputs['listVideoTemplates']
		>('/v5/video_templates', ctx.key, {
			method: 'GET',
			query: {
				page: input.page,
				limit: input.limit,
				project_id: input.project_id,
			},
		});
		await logEventFromContext(
			ctx,
			'bannerbear.video_templates.list',
			{ ...input },
			'completed',
		);
		return response;
	};

export const createVideoTemplate: BannerbearEndpoints['createVideoTemplate'] =
	async (ctx, input) => {
		const { project_id, ...body } = input;
		const response = await makeBannerbearRequest<
			BannerbearEndpointOutputs['createVideoTemplate']
		>('/v5/video_templates', ctx.key, {
			method: 'POST',
			body: { ...body, project_id },
		});
		await logEventFromContext(
			ctx,
			'bannerbear.video_templates.create',
			{ ...input },
			'completed',
		);
		return response;
	};
