import type { CorsairEndpoint, CorsairContext } from '../../../core';
import { makeSlackRequest } from '../client';

export const add = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ channel: string; timestamp: string; name: string; token?: string }],
	Promise<{ ok: boolean; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('reactions.add', token || input.token || '', {
			method: 'POST',
			body: {
				channel: input.channel,
				timestamp: input.timestamp,
				name: input.name,
			},
		});
	};
};

export const get = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ channel?: string; timestamp?: string; file?: string; file_comment?: string; full?: boolean; token?: string }],
	Promise<{ ok: boolean; type?: string; message?: { ts?: string }; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('reactions.get', token || input.token || '', {
			method: 'GET',
			query: {
				channel: input.channel,
				timestamp: input.timestamp,
				file: input.file,
				file_comment: input.file_comment,
				full: input.full,
			},
		});
	};
};

export const remove = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ name: string; channel?: string; timestamp?: string; file?: string; file_comment?: string; token?: string }],
	Promise<{ ok: boolean; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('reactions.remove', token || input.token || '', {
			method: 'POST',
			body: {
				name: input.name,
				channel: input.channel,
				timestamp: input.timestamp,
				file: input.file,
				file_comment: input.file_comment,
			},
		});
	};
};

