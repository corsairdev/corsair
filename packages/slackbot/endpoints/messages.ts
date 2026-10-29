import { logEventFromContext } from 'corsair/core';
import { makeSlackbotRequest } from '../client';
import { messageEntityId } from '../entity-ids';
import type { SlackbotEndpoints } from '../index';
import type { SlackbotEndpointOutputs } from './types';

export const post: SlackbotEndpoints['messagesPost'] = async (ctx, input) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['messagesPost']
	>('chat.postMessage', ctx.key, { method: 'POST', body: input });

	if (result.ok && result.ts && ctx.db.messages) {
		try {
			const channel = result.channel ?? input.channel;
			const entityId = messageEntityId(channel, result.ts);
			await ctx.db.messages.upsertByEntityId(entityId, {
				id: entityId,
				ts: result.ts,
				channel,
				text: result.message?.text ?? input.text,
				user: result.message?.user,
				bot_id: result.message?.bot_id,
				app_id: result.message?.app_id,
				team: result.message?.team,
				subtype: result.message?.subtype,
				thread_ts: input.thread_ts ?? result.message?.thread_ts,
			});
		} catch (error) {
			// A cache write must never fail the send it is mirroring.
			console.warn('Failed to cache posted message:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slackbot.messages.post',
		{ ...input },
		'completed',
	);
	return result;
};

export const postEphemeral: SlackbotEndpoints['messagesPostEphemeral'] = async (
	ctx,
	input,
) => {
	// Ephemeral messages are never persisted: they are visible only to `user`
	// and Slack gives them no addressable ts.
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['messagesPostEphemeral']
	>('chat.postEphemeral', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'slackbot.messages.postEphemeral',
		{ ...input },
		'completed',
	);
	return result;
};

export const postMe: SlackbotEndpoints['messagesPostMe'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['messagesPostMe']
	>('chat.meMessage', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'slackbot.messages.postMe',
		{ ...input },
		'completed',
	);
	return result;
};

export const schedule: SlackbotEndpoints['messagesSchedule'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['messagesSchedule']
	>('chat.scheduleMessage', ctx.key, { method: 'POST', body: input });

	if (result.ok && result.scheduled_message_id && ctx.db.scheduled_messages) {
		try {
			await ctx.db.scheduled_messages.upsertByEntityId(
				result.scheduled_message_id,
				{
					id: result.scheduled_message_id,
					channel: result.channel ?? input.channel,
					post_at: result.post_at ?? input.post_at,
					text: input.text,
					thread_ts: input.thread_ts,
				},
			);
		} catch (error) {
			console.warn('Failed to cache scheduled message:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slackbot.messages.schedule',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteScheduled: SlackbotEndpoints['messagesDeleteScheduled'] =
	async (ctx, input) => {
		const result = await makeSlackbotRequest<
			SlackbotEndpointOutputs['messagesDeleteScheduled']
		>('chat.deleteScheduledMessage', ctx.key, { method: 'POST', body: input });

		if (result.ok && ctx.db.scheduled_messages) {
			try {
				await ctx.db.scheduled_messages.deleteByEntityId(
					input.scheduled_message_id,
				);
			} catch (error) {
				console.warn('Failed to evict scheduled message from cache:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'slackbot.messages.deleteScheduled',
			{ ...input },
			'completed',
		);
		return result;
	};

export const update: SlackbotEndpoints['messagesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['messagesUpdate']
	>('chat.update', ctx.key, { method: 'POST', body: input });

	if (result.ok && result.ts && ctx.db.messages) {
		try {
			const channel = result.channel ?? input.channel;
			const entityId = messageEntityId(channel, result.ts);
			await ctx.db.messages.upsertByEntityId(entityId, {
				id: entityId,
				ts: result.ts,
				channel,
				text: result.text ?? result.message?.text ?? input.text,
				user: result.message?.user,
				bot_id: result.message?.bot_id,
				team: result.message?.team,
				thread_ts: result.message?.thread_ts,
			});
		} catch (error) {
			console.warn('Failed to update cached message:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slackbot.messages.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteMessage: SlackbotEndpoints['messagesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['messagesDelete']
	>('chat.delete', ctx.key, { method: 'POST', body: input });

	if (result.ok && ctx.db.messages) {
		try {
			await ctx.db.messages.deleteByEntityId(
				messageEntityId(input.channel, input.ts),
			);
		} catch (error) {
			console.warn('Failed to evict deleted message from cache:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slackbot.messages.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const history: SlackbotEndpoints['messagesHistory'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['messagesHistory']
	>('conversations.history', ctx.key, { method: 'GET', query: input });

	await logEventFromContext(
		ctx,
		'slackbot.messages.history',
		{ ...input },
		'completed',
	);
	return result;
};

export const replies: SlackbotEndpoints['messagesReplies'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['messagesReplies']
	>('conversations.replies', ctx.key, { method: 'GET', query: input });

	await logEventFromContext(
		ctx,
		'slackbot.messages.replies',
		{ ...input },
		'completed',
	);
	return result;
};

export const reactionAdd: SlackbotEndpoints['messagesReactionAdd'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['messagesReactionAdd']
	>('reactions.add', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'slackbot.messages.reactionAdd',
		{ ...input },
		'completed',
	);
	return result;
};

export const reactionRemove: SlackbotEndpoints['messagesReactionRemove'] =
	async (ctx, input) => {
		const result = await makeSlackbotRequest<
			SlackbotEndpointOutputs['messagesReactionRemove']
		>('reactions.remove', ctx.key, { method: 'POST', body: input });

		await logEventFromContext(
			ctx,
			'slackbot.messages.reactionRemove',
			{ ...input },
			'completed',
		);
		return result;
	};

export const reactionsGet: SlackbotEndpoints['messagesReactionsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['messagesReactionsGet']
	>('reactions.get', ctx.key, { method: 'GET', query: input });

	await logEventFromContext(
		ctx,
		'slackbot.messages.reactionsGet',
		{ ...input },
		'completed',
	);
	return result;
};

export const reactionsList: SlackbotEndpoints['messagesReactionsList'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['messagesReactionsList']
	>('reactions.list', ctx.key, { method: 'GET', query: input });

	await logEventFromContext(
		ctx,
		'slackbot.messages.reactionsList',
		{ ...input },
		'completed',
	);
	return result;
};

export const pinAdd: SlackbotEndpoints['messagesPinAdd'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['messagesPinAdd']
	>('pins.add', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'slackbot.messages.pinAdd',
		{ ...input },
		'completed',
	);
	return result;
};

export const pinRemove: SlackbotEndpoints['messagesPinRemove'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['messagesPinRemove']
	>('pins.remove', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'slackbot.messages.pinRemove',
		{ ...input },
		'completed',
	);
	return result;
};

export const pinsList: SlackbotEndpoints['messagesPinsList'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['messagesPinsList']
	>('pins.list', ctx.key, { method: 'GET', query: input });

	await logEventFromContext(
		ctx,
		'slackbot.messages.pinsList',
		{ ...input },
		'completed',
	);
	return result;
};
