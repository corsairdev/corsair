import { logEventFromContext } from 'corsair/core';
import { makeWorkableRequest } from '../client';
import type { WorkableEndpoints } from '../index';
import { resolveAccount } from './shared';
import type { WorkableEndpointOutputs } from './types';

export const list: WorkableEndpoints['accountsList'] = async (ctx) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['accountsList']
	>('/accounts', ctx.key, account);
	await logEventFromContext(ctx, 'workable.accounts.list', {}, 'completed');
	return response;
};

export const get: WorkableEndpoints['accountsGet'] = async (ctx, input) => {
	const account = input.subdomain ?? (await resolveAccount(ctx));
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['accountsGet']
	>(`/accounts/${encodeURIComponent(account)}`, ctx.key, account);
	await logEventFromContext(
		ctx,
		'workable.accounts.get',
		{ subdomain: account },
		'completed',
	);
	return response;
};
