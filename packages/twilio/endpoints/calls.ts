import { logEventFromContext } from 'corsair/core';
import { makeTwilioRequest } from '../client';
import type { TwilioEndpoints } from '../index';
import type { TwilioEndpointOutputs } from './types';

export const create: TwilioEndpoints['callsCreate'] = async (ctx, input) => {
	const accountSid =
		ctx.options.accountSid ??
		(await ctx.keys.get_accountSid()) ??
		ctx.key.split(':')[0] ??
		'';
	const authToken = ctx.key.includes(':') ? ctx.key.split(':')[1]! : ctx.key;

	const response = await makeTwilioRequest<
		TwilioEndpointOutputs['callsCreate']
	>(`Accounts/${accountSid}/Calls.json`, accountSid, authToken, {
		method: 'POST',
		body: input,
	});

	if (response.sid && ctx.db.calls) {
		try {
			await ctx.db.calls.upsertByEntityId(response.sid, {
				id: response.sid,
				sid: response.sid,
				to: response.to,
				from: response.from,
				status: response.status,
				direction: response.direction,
				duration: response.duration,
				start_time: response.start_time ?? null,
				end_time: response.end_time ?? null,
				price: response.price,
				price_unit: response.price_unit,
			});
		} catch (error) {
			console.warn('Failed to save call to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'twilio.calls.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: TwilioEndpoints['callsGet'] = async (ctx, input) => {
	const accountSid =
		ctx.options.accountSid ??
		(await ctx.keys.get_accountSid()) ??
		ctx.key.split(':')[0] ??
		'';
	const authToken = ctx.key.includes(':') ? ctx.key.split(':')[1]! : ctx.key;

	const response = await makeTwilioRequest<TwilioEndpointOutputs['callsGet']>(
		`Accounts/${accountSid}/Calls/${input.callSid}.json`,
		accountSid,
		authToken,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'twilio.calls.get', { ...input }, 'completed');
	return response;
};

export const list: TwilioEndpoints['callsList'] = async (ctx, input) => {
	const accountSid =
		ctx.options.accountSid ??
		(await ctx.keys.get_accountSid()) ??
		ctx.key.split(':')[0] ??
		'';
	const authToken = ctx.key.includes(':') ? ctx.key.split(':')[1]! : ctx.key;

	const response = await makeTwilioRequest<TwilioEndpointOutputs['callsList']>(
		`Accounts/${accountSid}/Calls.json`,
		accountSid,
		authToken,
		{
			method: 'GET',
			query: {
				To: input.To,
				From: input.From,
				Status: input.Status,
				StartTime: input.StartTime,
				EndTime: input.EndTime,
				PageSize: input.PageSize,
			},
		},
	);

	if (response.calls && ctx.db.calls) {
		try {
			for (const call of response.calls) {
				await ctx.db.calls.upsertByEntityId(call.sid, {
					id: call.sid,
					sid: call.sid,
					to: call.to,
					from: call.from,
					status: call.status,
					direction: call.direction,
					duration: call.duration,
					start_time: call.start_time ?? null,
					end_time: call.end_time ?? null,
					price: call.price,
					price_unit: call.price_unit,
				});
			}
		} catch (error) {
			console.warn('Failed to save calls to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'twilio.calls.list',
		{ ...input },
		'completed',
	);
	return response;
};
