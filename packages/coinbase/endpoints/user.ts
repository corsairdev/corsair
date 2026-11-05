import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { CoinbaseEndpoints } from '..';
import { makeCoinbaseRequest } from '../client';
import { CoinbaseUser } from '../schema';
import { requireCoinbaseEndpointKey } from './shared';

const DataEnvelope = <T extends z.ZodType>(data: T) => z.object({ data });

export const getUser: CoinbaseEndpoints['userGet'] = async (ctx, input) => {
	const envelope = await makeCoinbaseRequest(
		'/v2/user',
		requireCoinbaseEndpointKey(ctx),
		{
			schema: DataEnvelope(CoinbaseUser),
		},
	);
	await logEventFromContext(ctx, 'coinbase.user.get', input, 'completed');
	return envelope.data;
};
