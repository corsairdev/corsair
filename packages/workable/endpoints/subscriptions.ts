import { logEventFromContext } from 'corsair/core';
import { makeWorkableRequest } from '../client';
import type { WorkableEndpoints } from '../index';
import {
	compactBody,
	parseEndpointInput,
	parseEndpointOutput,
	resolveAccount,
} from './shared';
import type { WorkableEndpointOutputs } from './types';
import {
	WorkableEndpointInputSchemas,
	WorkableEndpointOutputSchemas,
} from './types';

export const list: WorkableEndpoints['subscriptionsList'] = async (
	ctx,
	input,
) => {
	parseEndpointInput(WorkableEndpointInputSchemas.subscriptionsList, input);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<
		WorkableEndpointOutputs['subscriptionsList']
	>('/subscriptions', ctx.key, account);
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.subscriptionsList,
		raw,
	);
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
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.subscriptionsCreate,
		input,
	);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<
		WorkableEndpointOutputs['subscriptionsCreate']
	>('/subscriptions', ctx.key, account, {
		method: 'POST',
		body: compactBody({
			target: valid.target,
			event: valid.event,
			args: valid.args,
		}),
		retryOnRateLimit: false,
	});
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.subscriptionsCreate,
		raw,
	);
	await logEventFromContext(
		ctx,
		'workable.subscriptions.create',
		{ event: valid.event, target: valid.target },
		'completed',
	);
	return response;
};

export const remove: WorkableEndpoints['subscriptionsDelete'] = async (
	ctx,
	input,
) => {
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.subscriptionsDelete,
		input,
	);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<
		WorkableEndpointOutputs['subscriptionsDelete']
	>(`/subscriptions/${encodeURIComponent(valid.id)}`, ctx.key, account, {
		method: 'DELETE',
		retryOnRateLimit: false,
	});
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.subscriptionsDelete,
		// 204 No Content carries no body — validate the empty object instead.
		raw ?? {},
	);
	await logEventFromContext(
		ctx,
		'workable.subscriptions.delete',
		{ id: valid.id },
		'completed',
	);
	return response;
};
