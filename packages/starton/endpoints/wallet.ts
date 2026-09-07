import { logEventFromContext } from 'corsair/core';
import type { StartonEndpoints } from '..';
import { makeStartonRequest } from '../client';
import { StartonEndpointOutputSchemas } from './types';

export const create: StartonEndpoints['walletCreate'] = async (ctx, input) => {
	const response = await makeStartonRequest<unknown>(
		'v3/kms/wallet',
		ctx.key,
		// Provisions a new wallet on every success — never replay it.
		{ method: 'POST', body: input, replayable: false },
	);
	// Validate the provider payload before returning it as typed data.
	const wallet = StartonEndpointOutputSchemas.walletCreate.parse(response);
	await logEventFromContext(
		ctx,
		'starton.wallet.create',
		{ kmsId: input.kmsId, name: input.name },
		'completed',
	);
	return wallet;
};

export const list: StartonEndpoints['walletList'] = async (ctx, input) => {
	const response = await makeStartonRequest<unknown>('v3/kms/wallet', ctx.key, {
		method: 'GET',
		query: { ...input },
	});
	const page = StartonEndpointOutputSchemas.walletList.parse(response);
	await logEventFromContext(
		ctx,
		'starton.wallet.list',
		{ count: page.items.length },
		'completed',
	);
	return page;
};
