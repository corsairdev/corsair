import type { CorsairEndpoint, CorsairContext } from '../../../core';
import { makeSlackRequest } from '../client';

export const get = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ file: string; cursor?: string; limit?: number; page?: number; count?: number; token?: string }],
	Promise<{ ok: boolean; file?: { id: string; name?: string }; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('files.info', token || input.token || '', {
			method: 'GET',
			query: {
				file: input.file,
				cursor: input.cursor,
				limit: input.limit,
				page: input.page,
				count: input.count,
			},
		});
	};
};

export const list = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ channel?: string; user?: string; types?: string; ts_from?: string; ts_to?: string; show_files_hidden_by_limit?: boolean; team_id?: string; page?: number; count?: number; token?: string }],
	Promise<{ ok: boolean; files?: Array<{ id: string; name?: string }>; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('files.list', token || input.token || '', {
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
	};
};

export const upload = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ channels?: string; content?: string; file?: unknown; filename?: string; filetype?: string; initial_comment?: string; thread_ts?: string; title?: string; token?: string }],
	Promise<{ ok: boolean; file?: { id: string; name?: string }; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('files.upload', token || input.token || '', {
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
	};
};

