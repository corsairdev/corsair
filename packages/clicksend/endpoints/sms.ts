import { logEventFromContext } from 'corsair/core';
import { getClickSendCredentials, makeClickSendRequest } from '../client';
import type { ClickSendEndpoints } from '../index';
import { ClickSendEndpointOutputSchemas } from './types';

function epochSecondsToISOString(epochSeconds?: number): string | undefined {
	if (typeof epochSeconds !== 'number' || !Number.isFinite(epochSeconds)) {
		return undefined;
	}

	const iso = new Date(epochSeconds * 1000).toISOString();
	return Number.isNaN(Date.parse(iso)) ? undefined : iso;
}

export const send: ClickSendEndpoints['smsSend'] = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest('sms/send', username, apiKey, {
		method: 'POST',
		body: { messages: input.messages },
		responseSchema: ClickSendEndpointOutputSchemas.smsSend,
	});

	if (response.messages && ctx.db.messages) {
		for (const msg of response.messages) {
			try {
				await ctx.db.messages.upsertByEntityId(msg.message_id, {
					id: msg.message_id,
					message_id: msg.message_id,
					to: msg.to,
					from: msg.from,
					body: msg.body,
					status: msg.status,
					direction: msg.direction ?? 'out',
					date_sent: epochSecondsToISOString(msg.date),
					price: msg.message_price,
					currency: msg.currency,
				});
			} catch (error) {
				console.warn('Failed to save message to database:', error);
			}
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

	const response = await makeClickSendRequest('sms/history', username, apiKey, {
		method: 'GET',
		query: {
			page: input.page,
			limit: input.limit,
			date_from: input.date_from,
			date_to: input.date_to,
		},
		responseSchema: ClickSendEndpointOutputSchemas.smsHistory,
	});

	if (response.data && ctx.db.messages) {
		for (const msg of response.data) {
			try {
				await ctx.db.messages.upsertByEntityId(msg.message_id, {
					id: msg.message_id,
					message_id: msg.message_id,
					to: msg.to,
					from: msg.from,
					body: msg.body,
					status: msg.status,
					direction: msg.direction ?? 'out',
					date_sent: epochSecondsToISOString(msg.date),
					price: msg.message_price,
					currency: msg.currency,
				});
			} catch (error) {
				console.warn('Failed to cache message history to database:', error);
			}
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

	const response = await makeClickSendRequest(
		'sms/inbound-sms',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				page: input.page,
				limit: input.limit,
			},
			responseSchema: ClickSendEndpointOutputSchemas.smsInbound,
		},
	);

	if (response.data && ctx.db.messages) {
		for (const msg of response.data) {
			try {
				await ctx.db.messages.upsertByEntityId(msg.message_id, {
					id: msg.message_id,
					message_id: msg.message_id,
					to: msg.to,
					from: msg.from,
					body: msg.body,
					status: 'received',
					direction: 'in',
					date_sent: epochSecondsToISOString(msg.timestamp),
				});
			} catch (error) {
				console.warn('Failed to cache inbound message to database:', error);
			}
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

	const response = await makeClickSendRequest(
		'sms/receipts',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				page: input.page,
				limit: input.limit,
			},
			responseSchema: ClickSendEndpointOutputSchemas.smsReceipts,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.sms.receipts',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};
