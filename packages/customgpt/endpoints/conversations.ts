import { logEventFromContext } from 'corsair/core';
import type { CustomGPTContext, CustomGPTEndpoints } from '..';
import { makeCustomGPTRequest } from '../client';
import { cacheEntity, omit } from './shared';
import type { CustomGPTEndpointOutputs } from './types';

/** Mirrors a conversation into the `conversations` cache, keyed by session id. */
async function cacheConversation(
	ctx: CustomGPTContext,
	conversation: { session_id?: string } & Record<string, unknown>,
): Promise<void> {
	if (!conversation?.session_id || !ctx.db.conversations) return;
	await cacheEntity('conversation', () =>
		ctx.db.conversations.upsertByEntityId(conversation.session_id as string, {
			...conversation,
			session_id: conversation.session_id as string,
			syncedAt: new Date(),
		}),
	);
}

/** Mirrors a prompt/response exchange into the `messages` cache. */
async function cacheMessage(
	ctx: CustomGPTContext,
	message: { id?: number } & Record<string, unknown>,
): Promise<void> {
	if (message?.id === undefined || !ctx.db.messages) return;
	await cacheEntity('message', () =>
		ctx.db.messages.upsertByEntityId(String(message.id), {
			...message,
			id: message.id as number,
			syncedAt: new Date(),
		}),
	);
}

export const createConversation: CustomGPTEndpoints['createConversation'] =
	async (ctx, input) => {
		const response = await makeCustomGPTRequest<
			CustomGPTEndpointOutputs['createConversation']
		>(`projects/${input.projectId}/conversations`, ctx.key, {
			method: 'POST',
			body: input.name === undefined ? {} : { name: input.name },
		});

		await cacheConversation(ctx, response.data);

		await logEventFromContext(
			ctx,
			'customgpt.conversations.create',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listConversationMessages: CustomGPTEndpoints['listConversationMessages'] =
	async (ctx, input) => {
		const response = await makeCustomGPTRequest<
			CustomGPTEndpointOutputs['listConversationMessages']
		>(
			`projects/${input.projectId}/conversations/${input.sessionId}/messages`,
			ctx.key,
			{ method: 'GET', query: omit(input, ['projectId', 'sessionId']) },
		);

		if (response.data?.conversation) {
			await cacheConversation(ctx, response.data.conversation);
		}
		for (const message of response.data?.messages?.data ?? []) {
			await cacheMessage(ctx, message);
		}

		await logEventFromContext(
			ctx,
			'customgpt.messages.list',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getMessage: CustomGPTEndpoints['getMessage'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['getMessage']
	>(
		`projects/${input.projectId}/conversations/${input.sessionId}/messages/${input.promptId}`,
		ctx.key,
		{ method: 'GET', query: { includeInsights: input.includeInsights } },
	);

	await cacheMessage(ctx, response.data);

	await logEventFromContext(
		ctx,
		'customgpt.messages.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const getMessageTrustScore: CustomGPTEndpoints['getMessageTrustScore'] =
	async (ctx, input) => {
		const response = await makeCustomGPTRequest<
			CustomGPTEndpointOutputs['getMessageTrustScore']
		>(
			`projects/${input.projectId}/conversations/${input.sessionId}/messages/${input.promptId}/trust-score`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'customgpt.messages.trust-score',
			{ ...input },
			'completed',
		);
		return response;
	};

export const verifyMessage: CustomGPTEndpoints['verifyMessage'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['verifyMessage']
	>(
		`projects/${input.projectId}/conversations/${input.sessionId}/messages/${input.promptId}/verify`,
		ctx.key,
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'customgpt.messages.verify',
		{ ...input },
		'completed',
	);
	return response;
};

export const submitMessageFeedback: CustomGPTEndpoints['submitMessageFeedback'] =
	async (ctx, input) => {
		const response = await makeCustomGPTRequest<
			CustomGPTEndpointOutputs['submitMessageFeedback']
		>(
			`projects/${input.projectId}/conversations/${input.sessionId}/messages/${input.promptId}/feedback`,
			ctx.key,
			{
				method: 'PUT',
				query: { includeInsights: input.includeInsights },
				body: { reaction: input.reaction },
			},
		);

		await cacheMessage(ctx, response.data);

		await logEventFromContext(
			ctx,
			'customgpt.messages.feedback',
			{
				projectId: input.projectId,
				sessionId: input.sessionId,
				promptId: input.promptId,
				reaction: input.reaction,
			},
			'completed',
		);
		return response;
	};
