import { logEventFromContext } from 'corsair/core';
import type { TwilioEndpoints } from '..';
import type { TwilioEndpointOutputs } from './types';
import { makeTwilioRequest } from '../client';

function getAccountSid(ctx: { options: { accountSid?: string } }): string {
	const accountSid = ctx.options.accountSid;
	if (!accountSid) {
		throw new Error('Twilio accountSid is required to call this endpoint.');
	}
	return accountSid;
}

export const list: TwilioEndpoints['callsList'] = async (ctx, input) => {
	const accountSid = getAccountSid(ctx);
	const response = await makeTwilioRequest<TwilioEndpointOutputs['callsList']>(
		`/Accounts/${accountSid}/Calls.json`,
		accountSid,
		ctx.key,
		{
			method: 'GET',
			query: {
				limit: input.limit,
				to: input.to,
				from: input.from,
				status: input.status,
				startTimeAfter: input.startTimeAfter,
				startTimeBefore: input.startTimeBefore,
				endTimeAfter: input.endTimeAfter,
				endTimeBefore: input.endTimeBefore,
				pageSize: input.pageSize,
			},
		},
	);

	await logEventFromContext(ctx, 'twilio.calls.list', { ...input }, 'completed');
	return response;
};

export const get: TwilioEndpoints['callsGet'] = async (ctx, input) => {
	const accountSid = getAccountSid(ctx);
	const response = await makeTwilioRequest<TwilioEndpointOutputs['callsGet']>(
		`/Accounts/${accountSid}/Calls/${input.sid}.json`,
		accountSid,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'twilio.calls.get', { sid: input.sid }, 'completed');
	return response;
};