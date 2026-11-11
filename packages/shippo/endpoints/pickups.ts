import type { ShippoEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	ShippoEndpointInputSchemas as Inputs,
	ShippoEndpointOutputSchemas as Outputs,
} from './types';

export const create: ShippoEndpoints['pickupsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pickups.create',
			input: Inputs.pickupsCreate,
			output: Outputs.pickupsCreate,
		},
		input,
		({ shippo_account_id, ...body }) => ({
			method: 'POST',
			path: '/pickups',
			body,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (parsed, result) => ({
				pickupId: result.object_id ?? undefined,
				status: result.status ?? undefined,
				carrierAccount: parsed.carrier_account,
			}),
		},
	);

export const listManifests: ShippoEndpoints['manifestsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'manifests.list',
			input: Inputs.manifestsList,
			output: Outputs.manifestsList,
		},
		input,
		({ page, results, shippo_account_id }) => ({
			method: 'GET',
			path: '/manifests',
			query: { page, results },
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (_, result) => ({ count: result.results.length }),
		},
	);

export const getManifest: ShippoEndpoints['manifestsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'manifests.get',
			input: Inputs.manifestsGet,
			output: Outputs.manifestsGet,
		},
		input,
		({ manifest_id, shippo_account_id }) => ({
			method: 'GET',
			path: `/manifests/${segment(manifest_id)}`,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ manifest_id }, result) => ({
				manifestId: manifest_id,
				status: result.status ?? undefined,
			}),
		},
	);

export const createManifest: ShippoEndpoints['manifestsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'manifests.create',
			input: Inputs.manifestsCreate,
			output: Outputs.manifestsCreate,
		},
		input,
		({ shippo_account_id, ...body }) => ({
			method: 'POST',
			path: '/manifests',
			body,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (parsed, result) => ({
				manifestId: result.object_id ?? undefined,
				status: result.status ?? undefined,
				transactionCount: parsed.transactions.length,
			}),
		},
	);
