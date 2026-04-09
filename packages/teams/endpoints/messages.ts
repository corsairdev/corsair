import { logEventFromContext } from 'corsair/core';
import type { TeamsEndpoints } from '..';
import { makeTeamsRequest } from '../client';
import type { TeamsEndpointOutputs } from './types';

export function toMessageRecord(
	msg: TeamsEndpointOutputs['messagesGet'],
	overrides: {
		teamId?: string;
		channelId?: string;
		chatId?: string;
		replyToId?: string;
	} = {},
) {
	return {
		...msg,
		id: msg.id,
		// Flatten nested body fields
		bodyContent: msg.body?.content,
		bodyContentType: msg.body?.contentType,
		// Flatten nested from.user fields
		fromUserId: msg.from?.user?.id,
		fromUserDisplayName: msg.from?.user?.displayName,
		// Computed date
		createdAt: msg.createdDateTime ? new Date(msg.createdDateTime) : undefined,
		// Context overrides (id scoping)
		...overrides,
	};
}

export const list: TeamsEndpoints['messagesList'] = async (ctx, input) => {
	const { teamId, channelId, top, skipToken } = input;
	const query = {
		...(top && { $top: top }),
		...(skipToken && { $skiptoken: skipToken }),
	};

	const result = await makeTeamsRequest<TeamsEndpointOutputs['messagesList']>(
		`teams/${teamId}/channels/${channelId}/messages`,
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.value && ctx.db.messages) {
		try {
			for (const msg of result.value) {
				await ctx.db.messages.upsertByEntityId(
					msg.id,
					toMessageRecord(msg, { teamId, channelId }),
				);
			}
		} catch (error) {
			console.warn('Failed to save messages to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'teams.messages.list',
		{ teamId, channelId },
		'completed',
	);
	return result;
};

export const get: TeamsEndpoints['messagesGet'] = async (ctx, input) => {
	const { teamId, channelId, messageId } = input;

	const result = await makeTeamsRequest<TeamsEndpointOutputs['messagesGet']>(
		`teams/${teamId}/channels/${channelId}/messages/${messageId}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.id && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(
				result.id,
				toMessageRecord(result, { teamId, channelId }),
			);
		} catch (error) {
			console.warn('Failed to save message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'teams.messages.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const send: TeamsEndpoints['messagesSend'] = async (ctx, input) => {
	const { teamId, channelId, ...body } = input;

	const result = await makeTeamsRequest<TeamsEndpointOutputs['messagesSend']>(
		`teams/${teamId}/channels/${channelId}/messages`,
		ctx.key,
		{
			method: 'POST',
			// Zod-inferred body type (input minus teamId/channelId) isn't assignable to Record<string, unknown> without a cast
			body: { ...body } as Record<string, unknown>,
		},
	);

	if (result.id && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(
				result.id,
				toMessageRecord(result, { teamId, channelId }),
			);
		} catch (error) {
			console.warn('Failed to save sent message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'teams.messages.send',
		{ ...input },
		'completed',
	);
	return result;
};

export const reply: TeamsEndpoints['messagesReply'] = async (ctx, input) => {
	const { teamId, channelId, messageId, ...body } = input;

	const result = await makeTeamsRequest<TeamsEndpointOutputs['messagesReply']>(
		`teams/${teamId}/channels/${channelId}/messages/${messageId}/replies`,
		ctx.key,
		{
			method: 'POST',
			// Zod-inferred body type (input minus teamId/channelId/messageId) isn't assignable to Record<string, unknown> without a cast
			body: { ...body } as Record<string, unknown>,
		},
	);

	if (result.id && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(
				result.id,
				toMessageRecord(result, { teamId, channelId, replyToId: messageId }),
			);
		} catch (error) {
			console.warn('Failed to save reply to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'teams.messages.reply',
		{ ...input },
		'completed',
	);
	return result;
};

export const listReplies: TeamsEndpoints['messagesListReplies'] = async (
	ctx,
	input,
) => {
	const { teamId, channelId, messageId, top } = input;
	const query = {
		...(top && { $top: top }),
	};

	const result = await makeTeamsRequest<
		TeamsEndpointOutputs['messagesListReplies']
	>(
		`teams/${teamId}/channels/${channelId}/messages/${messageId}/replies`,
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.value && ctx.db.messages) {
		try {
			for (const msg of result.value) {
				await ctx.db.messages.upsertByEntityId(
					msg.id,
					toMessageRecord(msg, { teamId, channelId, replyToId: messageId }),
				);
			}
		} catch (error) {
			console.warn('Failed to save replies to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'teams.messages.listReplies',
		{ ...input },
		'completed',
	);
	return result;
};

export const remove: TeamsEndpoints['messagesDelete'] = async (ctx, input) => {
	const { teamId, channelId, messageId } = input;

	const result = await makeTeamsRequest<TeamsEndpointOutputs['messagesDelete']>(
		`teams/${teamId}/channels/${channelId}/messages/${messageId}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (ctx.db.messages) {
		try {
			await ctx.db.messages.deleteByEntityId(messageId);
		} catch (error) {
			console.warn('Failed to delete message from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'teams.messages.delete',
		{ ...input },
		'completed',
	);
	return result;
};
