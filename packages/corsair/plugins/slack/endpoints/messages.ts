import type { SlackEndpoints } from '..';
import { makeSlackRequest } from '../client';

export const postMessage: SlackEndpoints['postMessage'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<{
		ok: boolean;
		channel?: string;
		ts?: string;
		message?: { ts?: string; text?: string };
		error?: string;
	}>('chat.postMessage', ctx.options.botToken, {
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

export const deleteMessage: SlackEndpoints['messagesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<{
		ok: boolean;
		channel?: string;
		ts?: string;
		error?: string;
	}>('chat.delete', ctx.options.botToken, {
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

export const update: SlackEndpoints['messagesUpdate'] = async (ctx, input) => {
	const result = await makeSlackRequest<{
		ok: boolean;
		channel?: string;
		ts?: string;
		text?: string;
		message?: { ts?: string; text?: string };
		error?: string;
	}>('chat.update', ctx.options.botToken, {
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

export const getPermalink: SlackEndpoints['messagesGetPermalink'] = async (
	ctx,
	input,
) => {
	return makeSlackRequest<{
		ok: boolean;
		channel?: string;
		permalink?: string;
		error?: string;
	}>('chat.getPermalink', ctx.options.botToken, {
		method: 'GET',
		query: {
			channel: input.channel,
			message_ts: input.message_ts,
		},
	});
};

export const search: SlackEndpoints['messagesSearch'] = async (ctx, input) => {
	const result = await makeSlackRequest<{
		ok: boolean;
		query?: string;
		messages?: { matches?: Array<{ ts?: string; text?: string }> };
		error?: string;
	}>('search.messages', ctx.options.botToken, {
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
