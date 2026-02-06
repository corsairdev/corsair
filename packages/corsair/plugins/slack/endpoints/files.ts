import { logEventFromContext } from '../../utils/events';
import type { SlackBoundEndpoints, SlackEndpoints } from '..';
import { makeSlackRequest } from '../client';
import type { SlackEndpointOutputs } from './types';

export const get: SlackEndpoints['filesGet'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['filesGet']>(
		'files.info',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);

	if (result.ok && result.file && ctx.db.files) {
		try {
			await ctx.db.files.upsertByEntityId(result.file.id, {
				...result.file,
			});
		} catch (error) {
			console.warn('Failed to save file to database:', error);
		}
	}

	await logEventFromContext(ctx, 'slack.files.get', { ...input }, 'completed');
	return result;
};

export const list: SlackEndpoints['filesList'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['filesList']>(
		'files.list',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);

	if (result.ok && result.files && ctx.db.files) {
		try {
			for (const file of result.files) {
				if (file.id) {
					await ctx.db.files.upsertByEntityId(file.id, {
						...file,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save files to database:', error);
		}
	}

	await logEventFromContext(ctx, 'slack.files.list', { ...input }, 'completed');
	return result;
};

export const upload: SlackEndpoints['filesUpload'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['filesUpload']>(
		'files.upload',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	if (result.ok && result.file) {
		const endpoints = ctx.endpoints as SlackBoundEndpoints;
		await endpoints.files.get({ file: result.file.id });
	}

	await logEventFromContext(
		ctx,
		'slack.files.upload',
		{ ...input },
		'completed',
	);
	return result;
};
