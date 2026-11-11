import type { ShippoEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	ShippoEndpointInputSchemas as Inputs,
	ShippoEndpointOutputSchemas as Outputs,
} from './types';

export const list: ShippoEndpoints['addressesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'addresses.list',
			input: Inputs.addressesList,
			output: Outputs.addressesList,
		},
		input,
		({ page, results, shippo_account_id }) => ({
			method: 'GET',
			path: '/addresses',
			query: { page, results },
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (_, result) => ({ count: result.results.length }),
		},
	);

export const get: ShippoEndpoints['addressesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'addresses.get',
			input: Inputs.addressesGet,
			output: Outputs.addressesGet,
		},
		input,
		({ address_id, shippo_account_id }) => ({
			method: 'GET',
			path: `/addresses/${segment(address_id)}`,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ address_id }) => ({ addressId: address_id }),
		},
	);

export const create: ShippoEndpoints['addressesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'addresses.create',
			input: Inputs.addressesCreate,
			output: Outputs.addressesCreate,
		},
		input,
		({ shippo_account_id, ...body }) => ({
			method: 'POST',
			path: '/addresses',
			body,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (parsed, result) => ({
				addressId: result.object_id ?? undefined,
				// The country and whether it validated, never the street line.
				country: parsed.country,
				isComplete: result.is_complete ?? undefined,
			}),
		},
	);

/**
 * `GET /addresses/{id}/validate` re-runs validation on a stored address and
 * answers with the address, whose `validation_results` carries the verdict.
 */
export const validate: ShippoEndpoints['addressesValidate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'addresses.validate',
			input: Inputs.addressesValidate,
			output: Outputs.addressesValidate,
		},
		input,
		({ address_id, shippo_account_id }) => ({
			method: 'GET',
			path: `/addresses/${segment(address_id)}/validate`,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ address_id }, result) => ({
				addressId: address_id,
				isValid: result.validation_results?.is_valid ?? undefined,
				isComplete: result.is_complete ?? undefined,
			}),
		},
	);
