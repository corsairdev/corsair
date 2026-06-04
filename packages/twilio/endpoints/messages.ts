import { logEventFromContext } from 'corsair/core';
import { makeTwilioRequest } from '../client';
import type { TwilioEndpoints } from '../index';
import type { TwilioEndpointOutputs } from './types';

export const send: TwilioEndpoints['messagesSend'] = async (ctx, input) => {
	const accountSid = ctx.options.accountSid ?? ctx.key.split(':')[0] ?? '';
	const authToken = ctx.key.includes(':') ? ctx.key.split(':')[1]! : ctx.key;

	const response = await makeTwilioRequest<
		TwilioEndpointOutputs['messagesSend']
	>(`Accounts/${accountSid}/Messages.json`, accountSid, authToken, {
		method: 'POST',
		body: input,
	});

	if (response.sid && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(response.sid, {
				id: response.sid,
				sid: response.sid,
				to: response.to,
				from: response.from,
				body: response.body,
				status: response.status,
				direction: response.direction,
				date_sent: response.date_sent,
				price: response.price,
				price_unit: response.price_unit,
			});
		} catch (error) {
			console.warn('Failed to save message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'twilio.messages.send',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: TwilioEndpoints['messagesGet'] = async (ctx, input) => {
	const accountSid = ctx.options.accountSid ?? ctx.key.split(':')[0] ?? '';
	const authToken = ctx.key.includes(':') ? ctx.key.split(':')[1]! : ctx.key;

	const response = await makeTwilioRequest<
		TwilioEndpointOutputs['messagesGet']
	>(
		`Accounts/${accountSid}/Messages/${input.messageSid}.json`,
		accountSid,
		authToken,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'twilio.messages.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: TwilioEndpoints['messagesList'] = async (ctx, input) => {
	const accountSid = ctx.options.accountSid ?? ctx.key.split(':')[0] ?? '';
	const authToken = ctx.key.includes(':') ? ctx.key.split(':')[1]! : ctx.key;

	const response = await makeTwilioRequest<
		TwilioEndpointOutputs['messagesList']
	>(`Accounts/${accountSid}/Messages.json`, accountSid, authToken, {
		method: 'GET',
		query: {
			To: input.To,
			From: input.From,
			DateSent: input.DateSent,
			PageSize: input.PageSize,
		},
	});

	if (response.messages && ctx.db.messages) {
		try {
			for (const msg of response.messages) {
				await ctx.db.messages.upsertByEntityId(msg.sid, {
					id: msg.sid,
					sid: msg.sid,
					to: msg.to,
					from: msg.from,
					body: msg.body,
					status: msg.status,
					direction: msg.direction,
					date_sent: msg.date_sent,
					price: msg.price,
					price_unit: msg.price_unit,
				});
			}
		} catch (error) {
			console.warn('Failed to save messages to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'twilio.messages.list',
		{ ...input },
		'completed',
	);
	return response;
};
