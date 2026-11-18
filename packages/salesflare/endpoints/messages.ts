import { logEventFromContext } from 'corsair/core';
import type { SalesflareEndpoints } from '..';
import { makeSalesflareRequest } from '../client';
import { salesflarePathParameter } from './path';
import type { SalesflareEndpointOutputs } from './types';

export const createMessage: SalesflareEndpoints['createMessage'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['createMessage']
	>(ctx, '/messages', { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'salesflare.messages.createMessage',
		input,
		'completed',
	);
	return response;
};

export const createMessageFeedback: SalesflareEndpoints['createMessageFeedback'] =
	async (ctx, input) => {
		const { messageId, ...body } = input;
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['createMessageFeedback']
		>(
			ctx,
			salesflarePathParameter(
				'/messages/{message_id}/feedback',
				'message_id',
				input.messageId,
			),
			{ method: 'POST', body: body },
		);
		await logEventFromContext(
			ctx,
			'salesflare.messages.createMessageFeedback',
			input,
			'completed',
		);
		return response;
	};

export const updateMessage: SalesflareEndpoints['updateMessage'] = async (
	ctx,
	input,
) => {
	const { messageId, ...body } = input;
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['updateMessage']
	>(
		ctx,
		salesflarePathParameter(
			'/messages/{message_id}',
			'message_id',
			input.messageId,
		),
		{ method: 'PUT', body: body },
	);
	await logEventFromContext(
		ctx,
		'salesflare.messages.updateMessage',
		input,
		'completed',
	);
	return response;
};

export const deleteMessage: SalesflareEndpoints['deleteMessage'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['deleteMessage']
	>(
		ctx,
		salesflarePathParameter(
			'/messages/{message_id}',
			'message_id',
			input.messageId,
		),
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'salesflare.messages.deleteMessage',
		input,
		'completed',
	);
	return response;
};
