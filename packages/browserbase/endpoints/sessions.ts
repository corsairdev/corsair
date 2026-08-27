import { logEventFromContext } from 'corsair/core';
import type { BrowserbaseEndpoints } from '..';
import { makeBrowserbaseRequest } from '../client';
import type { BrowserbaseEndpointOutputs } from './types';

export const create: BrowserbaseEndpoints['sessionsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeBrowserbaseRequest<
		BrowserbaseEndpointOutputs['sessionsCreate']
	>('sessions', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'browserbase.sessions.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const list: BrowserbaseEndpoints['sessionsList'] = async (
	ctx,
	input,
) => {
	const response = await makeBrowserbaseRequest<
		BrowserbaseEndpointOutputs['sessionsList']
	>('sessions', ctx.key, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'browserbase.sessions.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const get: BrowserbaseEndpoints['sessionsGet'] = async (ctx, input) => {
	const response = await makeBrowserbaseRequest<
		BrowserbaseEndpointOutputs['sessionsGet']
	>(`sessions/${input.id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'browserbase.sessions.get',
		{ ...input },
		'completed',
	);

	return response;
};
