import type { PolygonEndpoints } from '..';
import { queryArray, segment } from '../client';
import { call } from './call';
import {
	PolygonEndpointInputSchemas as Inputs,
	PolygonEndpointOutputSchemas as Outputs,
} from './types';

export const list: PolygonEndpoints['transactionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.list',
			input: Inputs.transactionsList,
			output: Outputs.transactionsList,
		},
		input,
		({
			status,
			customerId,
			walletId,
			virtualAccountId,
			depositAddressId,
			cashInId,
			createdAfter,
			createdBefore,
			search,
			limit,
			startingAfter,
			endingBefore,
		}) => ({
			method: 'GET',
			path: '/transactions',
			query: {
				status: queryArray(status),
				customerId,
				walletId,
				virtualAccountId,
				depositAddressId,
				cashInId,
				createdAfter,
				createdBefore,
				search,
				limit,
				startingAfter,
				endingBefore,
			},
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: PolygonEndpoints['transactionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.get',
			input: Inputs.transactionsGet,
			output: Outputs.transactionsGet,
		},
		input,
		({ transactionId }) => ({
			method: 'GET',
			path: `/transactions/${segment(transactionId)}`,
		}),
		{
			log: ({ transactionId }, result) => ({
				transactionId,
				status: result.status ?? undefined,
				subStatus: result.subStatus ?? undefined,
			}),
		},
	);

export const create: PolygonEndpoints['transactionsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.create',
			input: Inputs.transactionsCreate,
			output: Outputs.transactionsCreate,
			requiresIdempotencyKey: true,
		},
		input,
		({
			idempotencyKey: _ignored,
			quoteId,
			deviceFingerprint,
			webSessionId,
			metadata,
		}) => ({
			method: 'POST',
			path: '/transactions',
			body: { quoteId, deviceFingerprint, webSessionId, metadata },
		}),
		{
			log: (_, result) => ({
				transactionId: result.id ?? undefined,
				status: result.status ?? undefined,
			}),
		},
	);
