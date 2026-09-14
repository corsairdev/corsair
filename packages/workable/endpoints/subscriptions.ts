import { logEventFromContext } from 'corsair/core';
import { makeWorkableRequest } from '../client';
import type { WorkableEndpoints } from '../index';
import { compactBody, resolveAccount } from './shared';
import type { WorkableEndpointOutputs } from './types';

export const list: WorkableEndpoints['subscriptionsList'] = async (ctx) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['subscriptionsList']
	>('/subscriptions', ctx.key, account);
	await logEventFromContext(
		ctx,
		'workable.subscriptions.list',
		{},
		'completed',
	);
	return response;
};

export const create: WorkableEndpoints['subscriptionsCreate'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['subscriptionsCreate']
	>('/subscriptions', ctx.key, account, {
		method: 'POST',
		body: compactBody({
			target: input.target,
			event: input.event,
			args: input.args,
		}),
	});
	await logEventFromContext(
		ctx,
		'workable.subscriptions.create',
		{ event: input.event, target: input.target },
		'completed',
	);
	return response;
};

export const remove: WorkableEndpoints['subscriptionsDelete'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['subscriptionsDelete']
	>(`/subscriptions/${encodeURIComponent(input.id)}`, ctx.key, account, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'workable.subscriptions.delete',
		{ id: input.id },
		'completed',
	);
	return response ?? {};
};
