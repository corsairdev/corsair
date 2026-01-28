import { logEventFromContext } from '../../utils/events';
import type { SlackEndpoints } from '..';
import { makeSlackRequest } from '../client';
import type { SlackEndpointOutputs } from './types';

export const get: SlackEndpoints['filesGet'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['filesGet']>(
		'files.info',
		ctx.key,
		{
			method: 'GET',
			query: {
				file: input.file,
				cursor: input.cursor,
				limit: input.limit,
				page: input.page,
				count: input.count,
			},
		},
	);

	if (result.ok && result.file && ctx.db.files) {
		try {
			await ctx.db.files.upsert(result.file.id, {
				id: result.file.id,
				name: result.file.name,
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
			query: {
				channel: input.channel,
				user: input.user,
				types: input.types,
				ts_from: input.ts_from,
				ts_to: input.ts_to,
				show_files_hidden_by_limit: input.show_files_hidden_by_limit,
				team_id: input.team_id,
				page: input.page,
				count: input.count,
			},
		},
	);

	if (result.ok && result.files && ctx.db.files) {
		try {
			for (const file of result.files) {
				if (file.id) {
					await ctx.db.files.upsert(file.id, {
						id: file.id,
						name: file.name,
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
			body: {
				channels: input.channels,
				content: input.content,
				file: input.file,
				filename: input.filename,
				filetype: input.filetype,
				initial_comment: input.initial_comment,
				thread_ts: input.thread_ts,
				title: input.title,
			},
		},
	);

	if (result.ok && result.file && ctx.db.files) {
		try {
			await ctx.db.files.upsert(result.file.id, {
				id: result.file.id,
				name: result.file.name,
				title: input.title,
				filetype: input.filetype,
			});
		} catch (error) {
			console.warn('Failed to save file to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slack.files.upload',
		{ ...input },
		'completed',
	);
	return result;
};
