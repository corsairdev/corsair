import type { ShippoEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	ShippoEndpointInputSchemas as Inputs,
	ShippoEndpointOutputSchemas as Outputs,
} from './types';

export const create: ShippoEndpoints['batchesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'batches.create',
			input: Inputs.batchesCreate,
			output: Outputs.batchesCreate,
		},
		input,
		({ shippo_account_id, ...body }) => ({
			method: 'POST',
			path: '/batches',
			body,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (parsed, result) => ({
				batchId: result.object_id ?? undefined,
				status: result.status ?? undefined,
				shipmentCount: parsed.batch_shipments.length,
			}),
		},
	);

export const get: ShippoEndpoints['batchesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'batches.get',
			input: Inputs.batchesGet,
			output: Outputs.batchesGet,
		},
		input,
		({ batch_id, page, results, shippo_account_id }) => ({
			method: 'GET',
			path: `/batches/${segment(batch_id)}`,
			query: { page, results },
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ batch_id }, result) => ({
				batchId: batch_id,
				status: result.status ?? undefined,
				labelCount: result.label_url?.length ?? 0,
			}),
		},
	);

export const addShipments: ShippoEndpoints['batchesAddShipments'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'batches.addShipments',
			input: Inputs.batchesAddShipments,
			output: Outputs.batchesAddShipments,
		},
		input,
		({ batch_id, shipments, shippo_account_id }) => ({
			method: 'POST',
			path: `/batches/${segment(batch_id)}/add_shipments`,
			// The request body is a bare array of batch shipments, not an object
			// wrapping one and not the batch shape.
			body: shipments,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ batch_id }, result) => ({
				batchId: batch_id,
				status: result.status ?? undefined,
			}),
		},
	);

export const removeShipments: ShippoEndpoints['batchesRemoveShipments'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'batches.removeShipments',
			input: Inputs.batchesRemoveShipments,
			output: Outputs.batchesRemoveShipments,
		},
		input,
		({ batch_id, shipments, shippo_account_id }) => ({
			method: 'POST',
			path: `/batches/${segment(batch_id)}/remove_shipments`,
			// A bare array of shipment ids.
			body: shipments,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ batch_id }, result) => ({
				batchId: batch_id,
				status: result.status ?? undefined,
			}),
		},
	);

/**
 * Buys every label in the batch. This spends money for each shipment and
 * answers `202`, so the labels arrive through `get` rather than here.
 */
export const purchase: ShippoEndpoints['batchesPurchase'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'batches.purchase',
			input: Inputs.batchesPurchase,
			output: Outputs.batchesPurchase,
		},
		input,
		({ batch_id, shippo_account_id }) => ({
			method: 'POST',
			path: `/batches/${segment(batch_id)}/purchase`,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ batch_id }, result) => ({
				batchId: batch_id,
				status: result.status ?? undefined,
			}),
		},
	);
