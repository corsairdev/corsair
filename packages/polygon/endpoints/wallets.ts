import type { PolygonEndpoints } from '..';
import { queryArray, segment } from '../client';
import { call } from './call';
import {
	PolygonEndpointInputSchemas as Inputs,
	PolygonEndpointOutputSchemas as Outputs,
} from './types';

export const list: PolygonEndpoints['walletsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'wallets.list',
			input: Inputs.walletsList,
			output: Outputs.walletsList,
		},
		input,
		({
			customerId,
			type,
			search,
			orderBy,
			order,
			includeHidden,
			limit,
			startingAfter,
			endingBefore,
		}) => ({
			method: 'GET',
			path: '/wallets',
			query: {
				customerId,
				type,
				search,
				orderBy,
				order,
				includeHidden: queryArray(includeHidden),
				limit,
				startingAfter,
				endingBefore,
			},
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: PolygonEndpoints['walletsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'wallets.get',
			input: Inputs.walletsGet,
			output: Outputs.walletsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/wallets/${segment(id)}` }),
		{ log: ({ id }) => ({ walletId: id }) },
	);

export const create: PolygonEndpoints['walletsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'wallets.create',
			input: Inputs.walletsCreate,
			output: Outputs.walletsCreate,
			requiresIdempotencyKey: true,
		},
		input,
		({
			idempotencyKey: _ignored,
			customerId,
			type,
			details,
			label,
			metadata,
		}) => ({
			method: 'POST',
			path: '/wallets',
			body: { customerId, type, details, label, metadata },
		}),
		{
			log: (_, result) => ({
				walletId: result.id ?? result.walletId ?? undefined,
				operationId: result.operationId ?? undefined,
			}),
		},
	);

export const balance: PolygonEndpoints['walletsBalance'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'wallets.balance',
			input: Inputs.walletsBalance,
			output: Outputs.walletsBalance,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/wallets/${segment(id)}/balance` }),
		{
			log: ({ id }, result) => ({
				walletId: id,
				asset: result.data.asset ?? undefined,
				chain: result.data.chain ?? undefined,
			}),
		},
	);
