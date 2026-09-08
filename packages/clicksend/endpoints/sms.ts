import { logEventFromContext } from 'corsair/core';
import { getClickSendCredentials, makeClickSendRequest } from '../client';
import type { ClickSendEndpoints } from '../index';
import type { ClickSendEndpointOutputs } from './types';

export const send: ClickSendEndpoints['smsSend'] = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest<
		ClickSendEndpointOutputs['smsSend']
	>('sms/send', username, apiKey, {
		method: 'POST',
		body: { messages: input.messages },
	});

	if (response.messages && ctx.db.messages) {
		try {
			for (const msg of response.messages) {
				await ctx.db.messages.upsertByEntityId(msg.message_id, {
					id: msg.message_id,
					message_id: msg.message_id,
					to: msg.to,
					from: msg.from,
					body: msg.body,
					status: msg.status,
					direction: msg.direction ?? 'out',
					date_sent: msg.date
						? new Date(msg.date * 1000).toISOString()
						: undefined,
					price: msg.message_price,
					currency: 'USD',
				});
			}
		} catch (error) {
			console.warn('Failed to save message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'clicksend.sms.send',
		{ count: input.messages.length },
		'completed',
	);

	return response;
};

export const history: ClickSendEndpoints['smsHistory'] = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest<
		ClickSendEndpointOutputs['smsHistory']
	>('sms/history', username, apiKey, {
		method: 'GET',
		query: {
			page: input.page,
			limit: input.limit,
			date_from: input.date_from,
			date_to: input.date_to,
		},
	});

	if (response.data && ctx.db.messages) {
		try {
			for (const msg of response.data) {
				await ctx.db.messages.upsertByEntityId(msg.message_id, {
					id: msg.message_id,
					message_id: msg.message_id,
					to: msg.to,
					from: msg.from,
					body: msg.body,
					status: msg.status,
					direction: msg.direction ?? 'out',
					date_sent: msg.date
						? new Date(msg.date * 1000).toISOString()
						: undefined,
					price: msg.message_price,
					currency: 'USD',
				});
			}
		} catch (error) {
			console.warn('Failed to cache message history to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'clicksend.sms.history',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

export const inbound: ClickSendEndpoints['smsInbound'] = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest<
		ClickSendEndpointOutputs['smsInbound']
	>('sms/inbound-sms', username, apiKey, {
		method: 'GET',
		query: {
			page: input.page,
			limit: input.limit,
		},
	});

	if (response.data && ctx.db.messages) {
		try {
			for (const msg of response.data) {
				await ctx.db.messages.upsertByEntityId(msg.message_id, {
					id: msg.message_id,
					message_id: msg.message_id,
					to: msg.to,
					from: msg.from,
					body: msg.body,
					status: 'received',
					direction: 'in',
					date_sent: msg.timestamp
						? new Date(msg.timestamp * 1000).toISOString()
						: undefined,
				});
			}
		} catch (error) {
			console.warn('Failed to cache inbound message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'clicksend.sms.inbound',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

export const receipts: ClickSendEndpoints['smsReceipts'] = async (
	ctx,
	input,
) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest<
		ClickSendEndpointOutputs['smsReceipts']
	>('sms/receipts', username, apiKey, {
		method: 'GET',
		query: {
			page: input.page,
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'clicksend.sms.receipts',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};
