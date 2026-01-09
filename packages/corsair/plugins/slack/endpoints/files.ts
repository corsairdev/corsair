import type { CorsairEndpoint, CorsairPluginContext } from '../../../core';
import type { SlackSchema } from '../schema';
import { makeSlackRequest } from '../client';

export const get = (token: string): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ file: string; cursor?: string; limit?: number; page?: number; count?: number; token?: string }],
	Promise<{ ok: boolean; file?: { id: string; name?: string }; error?: string }>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{ ok: boolean; file?: { id: string; name?: string }; error?: string }>('files.info', token || input.token || '', {
			method: 'GET',
			query: {
				file: input.file,
				cursor: input.cursor,
				limit: input.limit,
				page: input.page,
				count: input.count,
			},
		});

		if (result.ok && result.file && ctx.files) {
			try {
				await ctx.files.upsertByResourceId({
					resourceId: result.file.id,
					data: {
						id: result.file.id,
						name: result.file.name,
					},
				});
			} catch (error) {
				console.warn('Failed to save file to database:', error);
			}
		}

		return result;
	};
};

export const list = (token: string): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ channel?: string; user?: string; types?: string; ts_from?: string; ts_to?: string; show_files_hidden_by_limit?: boolean; team_id?: string; page?: number; count?: number; token?: string }],
	Promise<{ ok: boolean; files?: Array<{ id: string; name?: string }>; error?: string }>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{ ok: boolean; files?: Array<{ id: string; name?: string }>; error?: string }>('files.list', token || input.token || '', {
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
		});

		if (result.ok && result.files && ctx.files) {
			try {
				for (const file of result.files) {
					if (file.id) {
						await ctx.files.upsertByResourceId({
							resourceId: file.id,
							data: {
								id: file.id,
								name: file.name,
							},
						});
					}
				}
			} catch (error) {
				console.warn('Failed to save files to database:', error);
			}
		}

		return result;
	};
};

export const upload = (token: string): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ channels?: string; content?: string; file?: unknown; filename?: string; filetype?: string; initial_comment?: string; thread_ts?: string; title?: string; token?: string }],
	Promise<{ ok: boolean; file?: { id: string; name?: string }; error?: string }>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{ ok: boolean; file?: { id: string; name?: string }; error?: string }>('files.upload', token || input.token || '', {
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
		});

		if (result.ok && result.file && ctx.files) {
			try {
				await ctx.files.upsertByResourceId({
					resourceId: result.file.id,
					data: {
						id: result.file.id,
						name: result.file.name,
						title: input.title,
						filetype: input.filetype,
					},
				});
			} catch (error) {
				console.warn('Failed to save file to database:', error);
			}
		}

		return result;
	};
};

