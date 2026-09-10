import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { CoinbaseEndpoints } from '..';
import { makeCoinbaseRequest } from '../client';
import { CoinbasePagination, CoinbaseTransaction } from '../schema';

const DataEnvelope = <T extends z.ZodType>(data: T) => z.object({ data });

export const listTransactions: CoinbaseEndpoints['transactionsList'] = async (
	ctx,
	input,
) => {
	const { account_id, ...query } = input;
	const response = await makeCoinbaseRequest(
		`/v2/accounts/${encodeURIComponent(account_id)}/transactions`,
		ctx.key,
		{
			schema: z.object({
				pagination: CoinbasePagination.optional(),
				data: z.array(CoinbaseTransaction),
			}),
			query: {
				limit: query.limit,
				starting_after: query.starting_after,
				ending_before: query.ending_before,
				order: query.order,
			},
		},
	);
	await logEventFromContext(
		ctx,
		'coinbase.transactions.list',
		input,
		'completed',
	);
	return response;
};

export const getTransaction: CoinbaseEndpoints['transactionsGet'] = async (
	ctx,
	input,
) => {
	const envelope = await makeCoinbaseRequest(
		`/v2/accounts/${encodeURIComponent(input.account_id)}/transactions/${encodeURIComponent(input.transaction_id)}`,
		ctx.key,
		{ schema: DataEnvelope(CoinbaseTransaction) },
	);
	await logEventFromContext(
		ctx,
		'coinbase.transactions.get',
		input,
		'completed',
	);
	return envelope.data;
};
