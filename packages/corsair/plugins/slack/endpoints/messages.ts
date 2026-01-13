import type { SlackEndpoints } from '..';
import { makeSlackRequest } from '../client';
import type { SlackEndpointOutputs } from '../types';
import { logEvent, updateEventStatus } from '../../utils/events';

export const postMessage: SlackEndpoints['postMessage'] = async (
	ctx,
	input,
) => {
	const eventId = await logEvent(ctx.database, 'slack.messages.postMessage', {
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
	});

	try {
		const result = await makeSlackRequest<SlackEndpointOutputs['postMessage']>(
			'chat.postMessage',
			ctx.options.botToken,
			{
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
			},
		);

		if (result.ok && result.message && result.ts && ctx.db.messages) {
			try {
				await ctx.db.messages.upsert(result.ts, {
					id: result.ts,
					ts: result.ts,
					text: result.message.text,
					channel: result.channel || input.channel,
					thread_ts: input.thread_ts,
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save message to database:', error);
			}
		}

		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};

export const deleteMessage: SlackEndpoints['messagesDelete'] = async (
	ctx,
	input,
) => {
	const eventId = await logEvent(ctx.database, 'slack.messages.delete', {
		channel: input.channel,
		ts: input.ts,
		as_user: input.as_user,
	});

	try {
		const result = await makeSlackRequest<SlackEndpointOutputs['messagesDelete']>(
			'chat.delete',
			ctx.options.botToken,
			{
				method: 'POST',
				body: {
					channel: input.channel,
					ts: input.ts,
					as_user: input.as_user,
				},
			},
		);

		if (result.ok && result.ts && ctx.db.messages) {
			try {
				await ctx.db.messages.deleteByResourceId(result.ts);
			} catch (error) {
				console.warn('Failed to delete message from database:', error);
			}
		}

		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};

export const update: SlackEndpoints['messagesUpdate'] = async (ctx, input) => {
	const eventId = await logEvent(ctx.database, 'slack.messages.update', {
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
	});

	try {
		const result = await makeSlackRequest<SlackEndpointOutputs['messagesUpdate']>(
			'chat.update',
			ctx.options.botToken,
			{
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
			},
		);

		if (result.ok && result.message && result.ts && ctx.db.messages) {
			try {
				await ctx.db.messages.upsert(result.ts, {
					id: result.ts,
					ts: result.ts,
					text: result.message.text || result.text,
					channel: result.channel || input.channel,
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to update message in database:', error);
			}
		}

		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};

export const getPermalink: SlackEndpoints['messagesGetPermalink'] = async (
	ctx,
	input,
) => {
	const eventId = await logEvent(ctx.database, 'slack.messages.getPermalink', {
		channel: input.channel,
		message_ts: input.message_ts,
	});

	try {
		const result = await makeSlackRequest<SlackEndpointOutputs['messagesGetPermalink']>(
			'chat.getPermalink',
			ctx.options.botToken,
			{
				method: 'GET',
				query: {
					channel: input.channel,
					message_ts: input.message_ts,
				},
			},
		);
		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};

export const search: SlackEndpoints['messagesSearch'] = async (ctx, input) => {
	const eventId = await logEvent(ctx.database, 'slack.messages.search', {
		query: input.query,
		sort: input.sort,
		sort_dir: input.sort_dir,
		highlight: input.highlight,
		team_id: input.team_id,
		cursor: input.cursor,
		limit: input.limit,
		page: input.page,
		count: input.count,
	});

	try {
		const result = await makeSlackRequest<SlackEndpointOutputs['messagesSearch']>(
			'search.messages',
			ctx.options.botToken,
			{
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
			},
		);

		if (result.ok && result.messages?.matches && ctx.db.messages) {
			try {
				for (const match of result.messages.matches) {
					if (match.ts) {
						await ctx.db.messages.upsert(match.ts, {
							id: match.ts,
							ts: match.ts,
							text: match.text,
							channel: '',
							createdAt: new Date(),
						});
					}
				}
			} catch (error) {
				console.warn('Failed to save search results to database:', error);
			}
		}

		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};
