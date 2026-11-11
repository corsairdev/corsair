import type { ShippoEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	ShippoEndpointInputSchemas as Inputs,
	ShippoEndpointOutputSchemas as Outputs,
} from './types';

export const list: ShippoEndpoints['parcelsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'parcels.list',
			input: Inputs.parcelsList,
			output: Outputs.parcelsList,
		},
		input,
		({ page, results, shippo_account_id }) => ({
			method: 'GET',
			path: '/parcels',
			query: { page, results },
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (_, result) => ({ count: result.results.length }),
		},
	);

export const get: ShippoEndpoints['parcelsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'parcels.get',
			input: Inputs.parcelsGet,
			output: Outputs.parcelsGet,
		},
		input,
		({ parcel_id, shippo_account_id }) => ({
			method: 'GET',
			path: `/parcels/${segment(parcel_id)}`,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ parcel_id }) => ({ parcelId: parcel_id }),
		},
	);

export const create: ShippoEndpoints['parcelsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'parcels.create',
			input: Inputs.parcelsCreate,
			output: Outputs.parcelsCreate,
		},
		input,
		({ shippo_account_id, ...body }) => ({
			method: 'POST',
			path: '/parcels',
			body,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (_, result) => ({ parcelId: result.object_id ?? undefined }),
		},
	);
