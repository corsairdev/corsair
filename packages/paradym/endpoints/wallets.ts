import type { ParadymEndpoints } from '..';
import { call } from './call';
import {
	ParadymEndpointInputSchemas as Inputs,
	ParadymEndpointOutputSchemas as Outputs,
	pageQuery,
} from './types';

export const list: ParadymEndpoints['walletsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'wallets.list',
			input: Inputs.walletsList,
			output: Outputs.walletsList,
		},
		input,
		(query) => ({
			method: 'GET',
			path: '/v1/wallets',
			query: {
				'search[name]': query.searchName,
				'filter[id]': query.filterId,
				'filter[name]': query.filterName,
				sort: query.sort,
				...pageQuery(query),
			},
		}),
		{ skipWallet: true, log: (_, page) => ({ count: page.data.length }) },
	);

export const create: ParadymEndpoints['walletsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'wallets.create',
			input: Inputs.walletsCreate,
			output: Outputs.walletsCreate,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/v1/wallets',
			body,
		}),
		{ skipWallet: true, log: (_, wallet) => ({ walletId: wallet.id }) },
	);

export const get: ParadymEndpoints['walletsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'wallets.get',
			input: Inputs.walletsGet,
			output: Outputs.walletsGet,
		},
		input,
		({ walletId }) => ({
			method: 'GET',
			path: `/v1/wallets/${encodeURIComponent(walletId)}`,
		}),
		{ skipWallet: true, log: (_, wallet) => ({ walletId: wallet.id }) },
	);

export const update: ParadymEndpoints['walletsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'wallets.update',
			input: Inputs.walletsUpdate,
			output: Outputs.walletsUpdate,
		},
		input,
		({ walletId, ...body }) => ({
			method: 'PATCH',
			path: `/v1/wallets/${encodeURIComponent(walletId)}`,
			body,
		}),
		{ skipWallet: true, log: (_, wallet) => ({ walletId: wallet.id }) },
	);
