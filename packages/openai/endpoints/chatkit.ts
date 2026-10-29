import { logEventFromContext } from 'corsair/core';
import { makeOpenaiRequest } from '../client';
import type { OpenaiEndpoints } from '../index';
import type {
	ChatkitGetThreadResponse,
	ChatkitListThreadItemsResponse,
	ChatkitListThreadsResponse,
} from '../schema/chatkit';

// ChatKit is a beta API that requires this header on every call.
const CHATKIT_BETA_HEADERS = { 'OpenAI-Beta': 'chatkit_beta=v1' };

export const listThreads: OpenaiEndpoints['chatkitListThreads'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ChatkitListThreadsResponse>(
		'chatkit/threads',
		ctx.key,
		{ method: 'GET', headers: CHATKIT_BETA_HEADERS, query: { ...input } },
	);

	await logEventFromContext(
		ctx,
		'openai.chatkit.listThreads',
		{ ...input },
		'completed',
	);
	return result;
};

export const getThread: OpenaiEndpoints['chatkitGetThread'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ChatkitGetThreadResponse>(
		`chatkit/threads/${input.threadId}`,
		ctx.key,
		{ method: 'GET', headers: CHATKIT_BETA_HEADERS },
	);

	await logEventFromContext(
		ctx,
		'openai.chatkit.getThread',
		{ ...input },
		'completed',
	);
	return result;
};

export const listThreadItems: OpenaiEndpoints['chatkitListThreadItems'] =
	async (ctx, input) => {
		const { threadId, ...query } = input;
		const result = await makeOpenaiRequest<ChatkitListThreadItemsResponse>(
			`chatkit/threads/${threadId}/items`,
			ctx.key,
			{ method: 'GET', headers: CHATKIT_BETA_HEADERS, query: { ...query } },
		);

		await logEventFromContext(
			ctx,
			'openai.chatkit.listThreadItems',
			{ ...input },
			'completed',
		);
		return result;
	};
