import { logEventFromContext } from 'corsair/core';
import type { StartonEndpoints } from '..';
import { makeStartonRequest } from '../client';
import type { StartonWallet } from '../schema/database';
import type { WalletListResponse } from './types';

export const create: StartonEndpoints['walletCreate'] = async (ctx, input) => {
	const response = await makeStartonRequest<StartonWallet>(
		'v3/kms/wallet',
		ctx.key,
		{ method: 'POST', body: input },
	);
	await logEventFromContext(
		ctx,
		'starton.wallet.create',
		{ kmsId: input.kmsId, name: input.name },
		'completed',
	);
	return response;
};

export const list: StartonEndpoints['walletList'] = async (ctx, input) => {
	const response = await makeStartonRequest<WalletListResponse>(
		'v3/kms/wallet',
		ctx.key,
		{ method: 'GET', query: { ...input } },
	);
	await logEventFromContext(
		ctx,
		'starton.wallet.list',
		{ count: response.items?.length ?? 0 },
		'completed',
	);
	return response;
};
