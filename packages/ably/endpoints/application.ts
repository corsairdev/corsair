import { logEventFromContext } from 'corsair/core';
import { makeAblyRequest } from '../client';
import type { AblyEndpoints } from '../index';
import type { AblyEndpointOutputs } from './types';

export const getServiceTime: AblyEndpoints['getServiceTime'] = async (ctx) => {
	const result = await makeAblyRequest<AblyEndpointOutputs['getServiceTime']>(
		'time',
		ctx.key,
	);

	await logEventFromContext(
		ctx,
		'ably.application.getServiceTime',
		{},
		'completed',
	);
	return result;
};

export const getStats: AblyEndpoints['getStats'] = async (ctx, input) => {
	const result = await makeAblyRequest<AblyEndpointOutputs['getStats']>(
		'stats',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ably.application.getStats',
		input,
		'completed',
	);
	return result;
};

export const requestAccessToken: AblyEndpoints['requestAccessToken'] = async (
	ctx,
	input,
) => {
	const { keyName, ...body } = input;

	const result = await makeAblyRequest<
		AblyEndpointOutputs['requestAccessToken']
	>(`keys/${encodeURIComponent(keyName)}/requestToken`, ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'ably.application.requestAccessToken',
		{ keyName },
		'completed',
	);

	return result;
};
