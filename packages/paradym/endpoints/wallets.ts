import { asRecord } from 'corsair/core';
import type { ParadymEndpoints } from '..';
import { buildParadymApiError } from '../client';
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
		// The API has no GET /v1/wallets/{id} (it answers 404); a wallet is
		// read through the list with filter[id].
		({ walletId }) => ({
			method: 'GET',
			path: '/v1/wallets',
			query: { 'filter[id]': walletId },
		}),
		{
			skipWallet: true,
			shape: (raw) => {
				const data = asRecord(raw)?.data;
				const wallet = Array.isArray(data) ? data[0] : undefined;
				if (!wallet) {
					throw buildParadymApiError('Paradym 404: wallet not found', {
						method: 'GET',
						path: '/v1/wallets',
						status: 404,
					});
				}
				return wallet;
			},
			log: (_, wallet) => ({ walletId: wallet.id }),
		},
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
