import { asRecord } from 'corsair/core';
import type { CraftmypdfEndpoints } from '..';
import { call } from './call';
import { nextOffsetFor, readList } from './pages';
import {
	CRAFTMYPDF_DEFAULT_PAGE_SIZE,
	CraftmypdfEndpointInputSchemas as Inputs,
	CraftmypdfEndpointOutputSchemas as Outputs,
} from './types';

export const getInfo: CraftmypdfEndpoints['accountGetInfo'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.getInfo',
			input: Inputs.accountGetInfo,
			output: Outputs.accountGetInfo,
		},
		input,
		() => ({ method: 'GET', path: '/get-account-info' }),
	);

export const list: CraftmypdfEndpoints['transactionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.list',
			input: Inputs.transactionsList,
			output: Outputs.transactionsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/list-transactions',
			query: { limit: parsed.limit, offset: parsed.offset },
		}),
		{
			shape: (raw, parsed) => {
				const transactions = readList(raw, 'transactions');
				const limit = parsed.limit ?? CRAFTMYPDF_DEFAULT_PAGE_SIZE;
				return {
					...asRecord(raw),
					transactions,
					next_offset: nextOffsetFor(
						transactions.length,
						limit,
						parsed.offset ?? 0,
					),
				};
			},
			log: (_, result) => ({ count: result.transactions.length }),
		},
	);
