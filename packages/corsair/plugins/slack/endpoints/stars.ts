import type { CorsairEndpoint, CorsairPluginContext } from '../../../core';
import { makeSlackRequest } from '../client';
import type { SlackSchema } from '../schema';

export const add = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[
		{
			channel?: string;
			timestamp?: string;
			file?: string;
			file_comment?: string;
			token?: string;
		},
	],
	Promise<{ ok: boolean; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('stars.add', token || input.token || '', {
			method: 'POST',
			body: {
				channel: input.channel,
				timestamp: input.timestamp,
				file: input.file,
				file_comment: input.file_comment,
			},
		});
	};
};

export const remove = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[
		{
			channel?: string;
			timestamp?: string;
			file?: string;
			file_comment?: string;
			token?: string;
		},
	],
	Promise<{ ok: boolean; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('stars.remove', token || input.token || '', {
			method: 'POST',
			body: {
				channel: input.channel,
				timestamp: input.timestamp,
				file: input.file,
				file_comment: input.file_comment,
			},
		});
	};
};

export const list = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[
		{
			team_id?: string;
			cursor?: string;
			limit?: number;
			page?: number;
			count?: number;
			token?: string;
		},
	],
	Promise<{
		ok: boolean;
		items?: Array<{ type?: string; date_create?: number }>;
		error?: string;
	}>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('stars.list', token || input.token || '', {
			method: 'GET',
			query: {
				team_id: input.team_id,
				cursor: input.cursor,
				limit: input.limit,
				page: input.page,
				count: input.count,
			},
		});
	};
};
