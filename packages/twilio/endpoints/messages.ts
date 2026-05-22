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

export const list: TwilioEndpoints['messagesList'] = async (ctx, input) => {
	const accountSid = getAccountSid(ctx);
	const response = await makeTwilioRequest<TwilioEndpointOutputs['messagesList']>(
		`/Accounts/${accountSid}/Messages.json`,
		accountSid,
		ctx.key,
		{
			method: 'GET',
			query: {
				limit: input.limit,
				to: input.to,
				from: input.from,
				dateSentAfter: input.dateSentAfter,
				dateSentBefore: input.dateSentBefore,
				pageSize: input.pageSize,
			},
		},
	);

	await logEventFromContext(ctx, 'twilio.messages.list', { ...input }, 'completed');
	return response;
};

export const get: TwilioEndpoints['messagesGet'] = async (ctx, input) => {
	const accountSid = getAccountSid(ctx);
	const response = await makeTwilioRequest<TwilioEndpointOutputs['messagesGet']>(
		`/Accounts/${accountSid}/Messages/${input.sid}.json`,
		accountSid,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'twilio.messages.get', { sid: input.sid }, 'completed');
	return response;
};