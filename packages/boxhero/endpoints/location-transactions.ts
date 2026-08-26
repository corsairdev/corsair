import { logEventFromContext } from 'corsair/core';
import type { BoxheroEndpoints } from '..';
import { makeBoxheroRequest } from '../client';
import type { BoxheroEndpointOutputs } from './types';

export const listLocation: BoxheroEndpoints['transactionsListLocation'] =
	async (ctx, input) => {
		const query: Record<string, string | number | undefined> = {};
		if (input?.type) query.type = input.type;
		if (input?.cursor !== undefined) query.cursor = input.cursor;
		if (input?.limit !== undefined) query.limit = input.limit;

		const response = await makeBoxheroRequest<
			BoxheroEndpointOutputs['transactionsListLocation']
		>('/v1/location-txs', ctx.key, {
			method: 'GET',
			query,
		});

		await logEventFromContext(
			ctx,
			'boxhero.transactions.listLocation',
			input ?? {},
			'completed',
		);
		return response;
	};
