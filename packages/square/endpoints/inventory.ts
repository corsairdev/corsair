import type { SquareEndpoints } from '../index';
import { callSquare } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** POST /v2/inventory/counts/batch-retrieve (BatchRetrieveInventoryCounts). */
export const batchGet: SquareEndpoints['inventoryBatchGet'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.inventoryBatchGet.parse(
		rawInput ?? {},
	);
	return callSquare(ctx, '/v2/inventory/counts/batch-retrieve', {
		method: 'POST',
		readOnly: true,
		body: input,
		output: SquareEndpointOutputSchemas.inventoryBatchGet,
		event: 'inventory.batchGet',
	});
};

/** GET /v2/inventory/{catalog_object_id} (RetrieveInventoryCount). */
export const get: SquareEndpoints['inventoryGet'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.inventoryGet.parse(rawInput);
	const { catalog_object_id, ...query } = input;
	return callSquare(ctx, '/v2/inventory/{catalog_object_id}', {
		query,
		path: { catalog_object_id },
		output: SquareEndpointOutputSchemas.inventoryGet,
		event: 'inventory.get',
		logged: { catalog_object_id },
	});
};
