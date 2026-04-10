import { logEventFromContext } from 'corsair/core';
import type { IntercomEndpoints } from '..';
import { makeIntercomRequest } from '../client';
import type { IntercomEndpointOutputs } from './types';

export const get: IntercomEndpoints['conversationsGet'] = async (
	ctx,
	input,
) => {
	const { id, ...query } = input;
	const result = await makeIntercomRequest<
		IntercomEndpointOutputs['conversationsGet']
	>(`conversations/${id}`, ctx.key, {
		query,
	});

	if (result && ctx.db.conversations) {
		try {
			await ctx.db.conversations.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save conversation to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'intercom.conversations.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: IntercomEndpoints['conversationsList'] = async (
	ctx,
	input,
) => {
	const result = await makeIntercomRequest<
		IntercomEndpointOutputs['conversationsList']
	>('conversations', ctx.key, {
		query: input,
	});

	if (result?.conversations && ctx.db.conversations) {
		try {
			for (const conversation of result.conversations) {
				await ctx.db.conversations.upsertByEntityId(
					conversation.id,
					conversation,
				);
			}
		} catch (error) {
			console.warn('Failed to save conversations to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'intercom.conversations.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: IntercomEndpoints['conversationsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeIntercomRequest<
		IntercomEndpointOutputs['conversationsCreate']
	>('conversations', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (result && ctx.db.conversations) {
		try {
			await ctx.db.conversations.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save conversation to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'intercom.conversations.create',
		{},
		'completed',
	);
	return result;
};

export const search: IntercomEndpoints['conversationsSearch'] = async (
	ctx,
	input,
) => {
	const result = await makeIntercomRequest<
		IntercomEndpointOutputs['conversationsSearch']
	>('conversations/search', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (result?.conversations && ctx.db.conversations) {
		try {
			for (const conversation of result.conversations) {
				await ctx.db.conversations.upsertByEntityId(
					conversation.id,
					conversation,
				);
			}
		} catch (error) {
			console.warn('Failed to save conversations to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'intercom.conversations.search',
		{},
		'completed',
	);
	return result;
};

export const assign: IntercomEndpoints['conversationsAssign'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const result = await makeIntercomRequest<
		IntercomEndpointOutputs['conversationsAssign']
	>(`conversations/${id}/parts`, ctx.key, {
		method: 'POST',
		body: {
			...body,
			message_type: 'assignment',
		},
	});

	if (result && ctx.db.conversations) {
		try {
			await ctx.db.conversations.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to update conversation in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'intercom.conversations.assign',
		{ id },
		'completed',
	);
	return result;
};

export const close: IntercomEndpoints['conversationsClose'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const result = await makeIntercomRequest<
		IntercomEndpointOutputs['conversationsClose']
	>(`conversations/${id}/parts`, ctx.key, {
		method: 'POST',
		body: {
			...body,
			message_type: 'close',
		},
	});

	if (result && ctx.db.conversations) {
		try {
			await ctx.db.conversations.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to update conversation in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'intercom.conversations.close',
		{ id },
		'completed',
	);
	return result;
};

export const reopen: IntercomEndpoints['conversationsReopen'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const result = await makeIntercomRequest<
		IntercomEndpointOutputs['conversationsReopen']
	>(`conversations/${id}/parts`, ctx.key, {
		method: 'POST',
		body: {
			...body,
			message_type: 'open',
		},
	});

	if (result && ctx.db.conversations) {
		try {
			await ctx.db.conversations.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to update conversation in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'intercom.conversations.reopen',
		{ id },
		'completed',
	);
	return result;
};

export const reply: IntercomEndpoints['conversationsReply'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const result = await makeIntercomRequest<
		IntercomEndpointOutputs['conversationsReply']
	>(`conversations/${id}/reply`, ctx.key, {
		method: 'POST',
		body: body,
	});

	if (result && ctx.db.conversations) {
		try {
			await ctx.db.conversations.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to update conversation in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'intercom.conversations.reply',
		{ id },
		'completed',
	);
	return result;
};
