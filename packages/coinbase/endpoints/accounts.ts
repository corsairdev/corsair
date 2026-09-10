import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { CoinbaseEndpoints } from '..';
import { makeCoinbaseRequest } from '../client';
import { CoinbaseAccount, CoinbasePagination } from '../schema';

const DataEnvelope = <T extends z.ZodType>(data: T) => z.object({ data });

export const listAccounts: CoinbaseEndpoints['accountsList'] = async (
	ctx,
	input,
) => {
	const response = await makeCoinbaseRequest('/v2/accounts', ctx.key, {
		schema: z.object({
			pagination: CoinbasePagination.optional(),
			data: z.array(CoinbaseAccount),
		}),
		query: {
			limit: input.limit,
			starting_after: input.starting_after,
			ending_before: input.ending_before,
			order: input.order,
		},
	});
	await logEventFromContext(ctx, 'coinbase.accounts.list', input, 'completed');
	return response;
};

export const getAccount: CoinbaseEndpoints['accountsGet'] = async (
	ctx,
	input,
) => {
	const envelope = await makeCoinbaseRequest(
		`/v2/accounts/${encodeURIComponent(input.account_id)}`,
		ctx.key,
		{ schema: DataEnvelope(CoinbaseAccount) },
	);
	await logEventFromContext(ctx, 'coinbase.accounts.get', input, 'completed');
	return envelope.data;
};
