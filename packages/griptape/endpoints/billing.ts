import { logEventFromContext } from 'corsair/core';
import type { GriptapeEndpointOutputs, GriptapeEndpoints } from '..';
import { makeGriptapeRequest } from '../client';

export const managementUrl: GriptapeEndpoints['billingManagementUrl'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['billingManagementUrl']
	>('billing/management-url', ctx.key, {
		method: 'POST',
	});

	await logEventFromContext(
		ctx,
		'griptape.billing.managementUrl',
		{ ...input },
		'completed',
	);

	return response;
};

export const creditBalance: GriptapeEndpoints['creditsBalance'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['creditsBalance']
	>('credits/balance', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.billing.creditBalance',
		{ ...input },
		'completed',
	);

	return response;
};

export const usage: GriptapeEndpoints['usageGet'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['usageGet']
	>('usage', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.billing.usage',
		{ ...input },
		'completed',
	);

	return response;
};

export const config: GriptapeEndpoints['configGet'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['configGet']
	>('config', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.billing.config',
		{ ...input },
		'completed',
	);

	return response;
};
