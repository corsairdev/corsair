import { logEventFromContext } from 'corsair/core';
import type { TeamsEndpoints } from '..';
import { makeTeamsRequest } from '../client';
import type { TeamsEndpointOutputs } from './types';

function toChatRecord(chat: TeamsEndpointOutputs['chatsGet']) {
	return {
		...chat,
		id: chat.id,
		createdAt: chat.createdDateTime
			? new Date(chat.createdDateTime)
			: undefined,
	};
}

function toChatMessageRecord(
	msg: TeamsEndpointOutputs['messagesGet'],
	chatId: string,
) {
	return {
		...msg,
		id: msg.id,
		chatId,
		// Flatten nested body fields
		bodyContent: msg.body?.content,
		bodyContentType: msg.body?.contentType,
		// Flatten nested from.user fields
		fromUserId: msg.from?.user?.id,
		fromUserDisplayName: msg.from?.user?.displayName,
		createdAt: msg.createdDateTime ? new Date(msg.createdDateTime) : undefined,
	};
}

export const list: TeamsEndpoints['chatsList'] = async (ctx, input) => {
	const { filter, top } = input;
	const query = {
		...(filter && { $filter: filter }),
		...(top && { $top: top }),
	};

	const result = await makeTeamsRequest<TeamsEndpointOutputs['chatsList']>(
		'chats',
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.value && ctx.db.chats) {
		try {
			for (const chat of result.value) {
				await ctx.db.chats.upsertByEntityId(chat.id, toChatRecord(chat));
			}
		} catch (error) {
			console.warn('Failed to save chats to database:', error);
		}
	}

	await logEventFromContext(ctx, 'teams.chats.list', { ...input }, 'completed');
	return result;
};

export const get: TeamsEndpoints['chatsGet'] = async (ctx, input) => {
	const result = await makeTeamsRequest<TeamsEndpointOutputs['chatsGet']>(
		`chats/${input.chatId}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.id && ctx.db.chats) {
		try {
			await ctx.db.chats.upsertByEntityId(result.id, toChatRecord(result));
		} catch (error) {
			console.warn('Failed to save chat to database:', error);
		}
	}

	await logEventFromContext(ctx, 'teams.chats.get', { ...input }, 'completed');
	return result;
};

export const create: TeamsEndpoints['chatsCreate'] = async (ctx, input) => {
	const { chatType, topic, members } = input;

	const result = await makeTeamsRequest<TeamsEndpointOutputs['chatsCreate']>(
		'chats',
		ctx.key,
		{
			method: 'POST',
			body: {
				chatType,
				...(topic && { topic }),
				members: members.map((m) => ({
					'@odata.type': '#microsoft.graph.aadUserConversationMember',
					roles: m.roles ?? ['member'],
					'user@odata.bind': `https://graph.microsoft.com/v1.0/users('${m.userId}')`,
				})),
			},
		},
	);

	if (result.id && ctx.db.chats) {
		try {
			await ctx.db.chats.upsertByEntityId(result.id, toChatRecord(result));
		} catch (error) {
			console.warn('Failed to save new chat to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'teams.chats.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const listMessages: TeamsEndpoints['chatsListMessages'] = async (
	ctx,
	input,
) => {
	const { chatId, top, skipToken } = input;
	const query = {
		...(top && { $top: top }),
		...(skipToken && { $skiptoken: skipToken }),
	};

	const result = await makeTeamsRequest<
		TeamsEndpointOutputs['chatsListMessages']
	>(`chats/${chatId}/messages`, ctx.key, { method: 'GET', query });

	if (result.value && ctx.db.messages) {
		try {
			for (const msg of result.value) {
				await ctx.db.messages.upsertByEntityId(
					msg.id,
					toChatMessageRecord(msg, chatId),
				);
			}
		} catch (error) {
			console.warn('Failed to save chat messages to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'teams.chats.listMessages',
		{ chatId },
		'completed',
	);
	return result;
};

export const sendMessage: TeamsEndpoints['chatsSendMessage'] = async (
	ctx,
	input,
) => {
	const { chatId, ...body } = input;

	const result = await makeTeamsRequest<
		TeamsEndpointOutputs['chatsSendMessage']
	>(`chats/${chatId}/messages`, ctx.key, {
		method: 'POST',
		// Zod-inferred body type (input minus chatId) isn't assignable to Record<string, unknown> without a cast
		body: { ...body } as Record<string, unknown>,
	});

	if (result.id && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(
				result.id,
				toChatMessageRecord(result, chatId),
			);
		} catch (error) {
			console.warn('Failed to save chat message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'teams.chats.sendMessage',
		{ ...input },
		'completed',
	);
	return result;
};
