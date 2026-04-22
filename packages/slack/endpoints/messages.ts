import { logEventFromContext } from 'corsair/core';
import { makeSlackRequest } from '../client';
import type { SlackEndpoints } from '../index';
import type { SlackEndpointOutputs } from './types';

export const postMessage: SlackEndpoints['postMessage'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['postMessage']>(
		'chat.postMessage',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	if (result.ok && result.ts && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(result.ts, {
				id: result.ts,
				ts: result.ts,
				type: result.message?.type,
				subtype: result.message?.subtype,
				text: result.message?.text,
				user: result.message?.user,
				bot_id: result.message?.bot_id,
				app_id: result.message?.app_id,
				team: result.message?.team,
				username: result.message?.username,
				channel: result.channel || input.channel,
				thread_ts: input.thread_ts ?? result.message?.thread_ts,
				reply_count: result.message?.reply_count,
				is_locked: result.message?.is_locked,
				subscribed: result.message?.subscribed,
				authorId: result.message?.user,
			});
		} catch (error) {
			console.warn('Failed to save message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slack.messages.postMessage',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteMessage: SlackEndpoints['messagesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['messagesDelete']>(
		'chat.delete',
		ctx.key,
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
			await ctx.db.messages.deleteByEntityId(result.ts);
		} catch (error) {
			console.warn('Failed to delete message from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slack.messages.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: SlackEndpoints['messagesUpdate'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['messagesUpdate']>(
		'chat.update',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	if (result.ok && result.ts && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(result.ts, {
				id: result.ts,
				ts: result.ts,
				type: result.message?.type,
				subtype: result.message?.subtype,
				text: result.text ?? result.message?.text,
				user: result.message?.user,
				bot_id: result.message?.bot_id,
				app_id: result.message?.app_id,
				team: result.message?.team,
				username: result.message?.username,
				channel: result.channel || input.channel,
				thread_ts: result.message?.thread_ts,
				reply_count: result.message?.reply_count,
				is_locked: result.message?.is_locked,
				subscribed: result.message?.subscribed,
				authorId: result.message?.user,
			});
		} catch (error) {
			console.warn('Failed to update message in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slack.messages.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const getPermalink: SlackEndpoints['messagesGetPermalink'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<
		SlackEndpointOutputs['messagesGetPermalink']
	>('chat.getPermalink', ctx.key, {
		method: 'GET',
		query: {
			channel: input.channel,
			message_ts: input.message_ts,
		},
	});
	await logEventFromContext(
		ctx,
		'slack.messages.getPermalink',
		{ ...input },
		'completed',
	);
	return result;
};

export const search: SlackEndpoints['messagesSearch'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['messagesSearch']>(
		'search.messages',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);

	if (result.ok && result.messages?.matches && ctx.db.messages) {
		try {
			for (const match of result.messages.matches) {
				if (match.ts && match.channel?.id) {
					await ctx.db.messages.upsertByEntityId(match.ts, {
						id: match.ts,
						ts: match.ts,
						type: match.type,
						subtype: match.subtype,
						text: match.text,
						user: match.user,
						bot_id: match.bot_id,
						app_id: match.app_id,
						team: match.team,
						username: match.username,
						channel: match.channel.id,
						thread_ts: match.thread_ts,
						reply_count: match.reply_count,
						is_locked: match.is_locked,
						subscribed: match.subscribed,
						authorId: match.user,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save search results to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slack.messages.search',
		{ ...input },
		'completed',
	);
	return result;
};
