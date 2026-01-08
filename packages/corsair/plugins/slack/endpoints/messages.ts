import type { CorsairEndpoint, CorsairContext } from '../../../core';
import { makeSlackRequest } from '../client';

export const postMessage = (token: string): CorsairEndpoint<
	CorsairContext,
	[{
		channel: string;
		text?: string;
		blocks?: Array<{ type: string; [key: string]: unknown }>;
		attachments?: Array<{ [key: string]: unknown }>;
		thread_ts?: string;
		reply_broadcast?: boolean;
		parse?: 'full' | 'none';
		link_names?: boolean;
		unfurl_links?: boolean;
		unfurl_media?: boolean;
		mrkdwn?: boolean;
		as_user?: boolean;
		icon_emoji?: string;
		icon_url?: string;
		username?: string;
		metadata?: { event_type: string; event_payload: Record<string, unknown> };
		token?: string;
	}],
	Promise<{ ok: boolean; channel?: string; ts?: string; message?: { ts?: string; text?: string }; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('chat.postMessage', token || input.token || '', {
			method: 'POST',
			body: {
				channel: input.channel,
				text: input.text,
				blocks: input.blocks,
				attachments: input.attachments,
				thread_ts: input.thread_ts,
				reply_broadcast: input.reply_broadcast,
				parse: input.parse,
				link_names: input.link_names,
				unfurl_links: input.unfurl_links,
				unfurl_media: input.unfurl_media,
				mrkdwn: input.mrkdwn,
				as_user: input.as_user,
				icon_emoji: input.icon_emoji,
				icon_url: input.icon_url,
				username: input.username,
				metadata: input.metadata,
			},
		});
	};
};

export const deleteMessage = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ channel: string; ts: string; as_user?: boolean; token?: string }],
	Promise<{ ok: boolean; channel?: string; ts?: string; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('chat.delete', token || input.token || '', {
			method: 'POST',
			body: {
				channel: input.channel,
				ts: input.ts,
				as_user: input.as_user,
			},
		});
	};
};

export const update = (token: string): CorsairEndpoint<
	CorsairContext,
	[{
		channel: string;
		ts: string;
		text?: string;
		blocks?: Array<{ type: string; [key: string]: unknown }>;
		attachments?: Array<{ [key: string]: unknown }>;
		parse?: 'full' | 'none';
		link_names?: boolean;
		as_user?: boolean;
		file_ids?: string[];
		reply_broadcast?: boolean;
		metadata?: { event_type: string; event_payload: Record<string, unknown> };
		token?: string;
	}],
	Promise<{ ok: boolean; channel?: string; ts?: string; text?: string; message?: { ts?: string; text?: string }; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('chat.update', token || input.token || '', {
			method: 'POST',
			body: {
				channel: input.channel,
				ts: input.ts,
				text: input.text,
				blocks: input.blocks,
				attachments: input.attachments,
				parse: input.parse,
				link_names: input.link_names,
				as_user: input.as_user,
				file_ids: input.file_ids,
				reply_broadcast: input.reply_broadcast,
				metadata: input.metadata,
			},
		});
	};
};

export const getPermalink = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ channel: string; message_ts: string; token?: string }],
	Promise<{ ok: boolean; channel?: string; permalink?: string; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('chat.getPermalink', token || input.token || '', {
			method: 'GET',
			query: {
				channel: input.channel,
				message_ts: input.message_ts,
			},
		});
	};
};

export const search = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ query: string; sort?: 'score' | 'timestamp'; sort_dir?: 'asc' | 'desc'; highlight?: boolean; team_id?: string; cursor?: string; limit?: number; page?: number; count?: number; token?: string }],
	Promise<{ ok: boolean; query?: string; messages?: { matches?: Array<{ ts?: string; text?: string }> }; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('search.messages', token || input.token || '', {
			method: 'GET',
			query: {
				query: input.query,
				sort: input.sort,
				sort_dir: input.sort_dir,
				highlight: input.highlight,
				team_id: input.team_id,
				cursor: input.cursor,
				limit: input.limit,
				page: input.page,
				count: input.count,
			},
		});
	};
};

