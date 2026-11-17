import type { PolygonEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	PolygonEndpointInputSchemas as Inputs,
	PolygonEndpointOutputSchemas as Outputs,
} from './types';

export const create: PolygonEndpoints['quotesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'quotes.create',
			input: Inputs.quotesCreate,
			output: Outputs.quotesCreate,
			requiresIdempotencyKey: true,
		},
		input,
		({
			idempotencyKey: _ignored,
			customerId,
			source,
			destination,
			sponsorGas,
			metadata,
		}) => ({
			method: 'POST',
			path: '/quotes',
			body: { customerId, source, destination, sponsorGas, metadata },
		}),
		{
			log: (_, result) => ({
				quoteId: result.id ?? undefined,
				status: result.status ?? undefined,
			}),
		},
	);

export const get: PolygonEndpoints['quotesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'quotes.get',
			input: Inputs.quotesGet,
			output: Outputs.quotesGet,
		},
		input,
		({ quoteId }) => ({
			method: 'GET',
			path: `/quotes/${segment(quoteId)}`,
		}),
		{
			log: ({ quoteId }, result) => ({
				quoteId,
				status: result.status ?? undefined,
			}),
		},
	);
