import { logEventFromContext } from 'corsair/core';
import { makeVestaboardRequest, VESTABOARD_RW_API_BASE } from '../client';
import type { VestaboardEndpoints } from '../index';
import type { VestaboardEndpointOutputs } from './types';

// Empty 6x22 board filled with character code 0 (blank space)
const EMPTY_BOARD = Array.from({ length: 6 }, () => Array(22).fill(0));

export const get: VestaboardEndpoints['messageGet'] = async (ctx, _input) => {
	const result = await makeVestaboardRequest<VestaboardEndpointOutputs['messageGet']>(
		'/',
		ctx.key,
		{
			method: 'GET',
			baseUrl: VESTABOARD_RW_API_BASE,
			apiSecret: ctx.options.apiSecret,
		},
	);

	if (result.currentMessage?.id && ctx.db?.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(result.currentMessage.id, {
				...result.currentMessage,
			});
		} catch (error) {
			console.warn('Failed to save message to database:', error);
		}
	}

	await logEventFromContext(ctx, 'vestaboard.message.get', {}, 'completed');
	return result;
};

export const post: VestaboardEndpoints['messagePost'] = async (ctx, input) => {
	const payload = input.characters
		? input.characters
		: input.text
			? { text: input.text }
			: { text: '' };

	const result = await makeVestaboardRequest<VestaboardEndpointOutputs['messagePost']>(
		'/',
		ctx.key,
		{
			method: 'POST',
			baseUrl: VESTABOARD_RW_API_BASE,
			apiSecret: ctx.options.apiSecret,
			body: payload,
		},
	);

	await logEventFromContext(
		ctx,
		'vestaboard.message.post',
		{ text: input.text },
		'completed',
	);
	return result;
};

export const clear: VestaboardEndpoints['messageClear'] = async (ctx, _input) => {
	await makeVestaboardRequest(
		'/',
		ctx.key,
		{
			method: 'POST',
			baseUrl: VESTABOARD_RW_API_BASE,
			apiSecret: ctx.options.apiSecret,
			body: EMPTY_BOARD,
		},
	);

	await logEventFromContext(ctx, 'vestaboard.message.clear', {}, 'completed');
	return {
		status: 'ok',
		cleared: true,
	};
};
