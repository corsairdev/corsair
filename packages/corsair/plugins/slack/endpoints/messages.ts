import type { CorsairEndpoint, CorsairPluginContext } from '../../../core';
import type { SlackSchema } from '../schema';
import { makeSlackRequest } from '../client';

export const postMessage = (token: string): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
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
	return async (ctx, input) => {
		const result = await makeSlackRequest<{ ok: boolean; channel?: string; ts?: string; message?: { ts?: string; text?: string }; error?: string }>('chat.postMessage', token || input.token || '', {
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

		if (result.ok && result.message && result.ts && ctx.messages) {
			try {
				await ctx.messages.upsertByResourceId({
					resourceId: result.ts,
					data: {
						id: result.ts,
						ts: result.ts,
						text: result.message.text,
						channel: result.channel || input.channel,
						thread_ts: input.thread_ts,
						createdAt: new Date(),
					},
				});
			} catch (error) {
				console.warn('Failed to save message to database:', error);
			}
		}

		return result;
	};
};

export const deleteMessage = (token: string): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ channel: string; ts: string; as_user?: boolean; token?: string }],
	Promise<{ ok: boolean; channel?: string; ts?: string; error?: string }>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{ ok: boolean; channel?: string; ts?: string; error?: string }>('chat.delete', token || input.token || '', {
			method: 'POST',
			body: {
				channel: input.channel,
				ts: input.ts,
				as_user: input.as_user,
			},
		});

		if (result.ok && result.ts && ctx.messages) {
			try {
				await ctx.messages.deleteByResourceId(result.ts);
			} catch (error) {
				console.warn('Failed to delete message from database:', error);
			}
		}

		return result;
	};
};

export const update = (token: string): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
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
	return async (ctx, input) => {
		const result = await makeSlackRequest<{ ok: boolean; channel?: string; ts?: string; text?: string; message?: { ts?: string; text?: string }; error?: string }>('chat.update', token || input.token || '', {
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

		if (result.ok && result.message && result.ts && ctx.messages) {
			try {
				await ctx.messages.upsertByResourceId({
					resourceId: result.ts,
					data: {
						id: result.ts,
						ts: result.ts,
						text: result.message.text || result.text,
						channel: result.channel || input.channel,
						createdAt: new Date(),
					},
				});
			} catch (error) {
				console.warn('Failed to update message in database:', error);
			}
		}

		return result;
	};
};

export const getPermalink = (token: string): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ channel: string; message_ts: string; token?: string }],
	Promise<{ ok: boolean; channel?: string; permalink?: string; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest<{ ok: boolean; channel?: string; permalink?: string; error?: string }>('chat.getPermalink', token || input.token || '', {
			method: 'GET',
			query: {
				channel: input.channel,
				message_ts: input.message_ts,
			},
		});
	};
};

export const search = (token: string): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ query: string; sort?: 'score' | 'timestamp'; sort_dir?: 'asc' | 'desc'; highlight?: boolean; team_id?: string; cursor?: string; limit?: number; page?: number; count?: number; token?: string }],
	Promise<{ ok: boolean; query?: string; messages?: { matches?: Array<{ ts?: string; text?: string }> }; error?: string }>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{ ok: boolean; query?: string; messages?: { matches?: Array<{ ts?: string; text?: string }> }; error?: string }>('search.messages', token || input.token || '', {
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

		if (result.ok && result.messages?.matches && ctx.messages) {
			try {
				for (const match of result.messages.matches) {
					if (match.ts) {
					await ctx.messages.upsertByResourceId({
						resourceId: match.ts,
						data: {
							id: match.ts,
							ts: match.ts,
							text: match.text,
							channel: '',
							createdAt: new Date(),
						},
					});
					}
				}
			} catch (error) {
				console.warn('Failed to save search results to database:', error);
			}
		}

		return result;
	};
};

