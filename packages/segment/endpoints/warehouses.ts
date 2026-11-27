import type { SegmentEndpoints } from '..';
import { paginationQuery, pathSegment } from '../client';
import { call } from './call';
import {
	SegmentEndpointInputSchemas as Inputs,
	SegmentEndpointOutputSchemas as Outputs,
} from './types';

export const list: SegmentEndpoints['warehousesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'warehouses.list',
			input: Inputs.warehousesList,
			output: Outputs.warehousesList,
		},
		input,
		({ count, cursor }) => ({
			method: 'GET',
			path: '/warehouses',
			query: paginationQuery(count, cursor),
		}),
		{ log: (_, result) => ({ count: result.data.warehouses.length }) },
	);

export const get: SegmentEndpoints['warehousesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'warehouses.get',
			input: Inputs.warehousesGet,
			output: Outputs.warehousesGet,
		},
		input,
		({ warehouseId }) => ({
			method: 'GET',
			path: `/warehouses/${pathSegment(warehouseId)}`,
		}),
		{ log: ({ warehouseId }) => ({ warehouseId }) },
	);

export const getConnectionState: SegmentEndpoints['warehousesGetConnectionState'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'warehouses.getConnectionState',
				input: Inputs.warehousesGetConnectionState,
				output: Outputs.warehousesGetConnectionState,
			},
			input,
			({ warehouseId }) => ({
				method: 'GET',
				path: `/warehouses/${pathSegment(warehouseId)}/connection-state`,
			}),
			{
				log: ({ warehouseId }, result) => ({
					warehouseId,
					state: result.data.connectionState,
				}),
			},
		);

export const listConnectedSources: SegmentEndpoints['warehousesListConnectedSources'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'warehouses.listConnectedSources',
				input: Inputs.warehousesListConnectedSources,
				output: Outputs.warehousesListConnectedSources,
			},
			input,
			({ warehouseId, count, cursor }) => ({
				method: 'GET',
				path: `/warehouses/${pathSegment(warehouseId)}/connected-sources`,
				query: paginationQuery(count, cursor),
			}),
			{
				log: ({ warehouseId }, result) => ({
					warehouseId,
					count: result.data.sources.length,
				}),
			},
		);

// Synchronous: answers CONNECTED or FAILED in the same response.
export const validate: SegmentEndpoints['warehousesValidate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'warehouses.validate',
			input: Inputs.warehousesValidate,
			output: Outputs.warehousesValidate,
		},
		input,
		({ metadataId, settings }) => ({
			method: 'POST',
			path: '/warehouses/validation',
			body: { metadataId, settings },
		}),
		{ log: (_, result) => ({ state: result.data.status }) },
	);

export const create: SegmentEndpoints['warehousesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'warehouses.create',
			input: Inputs.warehousesCreate,
			output: Outputs.warehousesCreate,
		},
		input,
		({ metadataId, name, enabled, settings, disconnectAllSources }) => ({
			method: 'POST',
			path: '/warehouses',
			body: { metadataId, name, enabled, settings, disconnectAllSources },
		}),
		{ log: (_, result) => ({ warehouseId: result.data.warehouse.id ?? '' }) },
	);

export const update: SegmentEndpoints['warehousesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'warehouses.update',
			input: Inputs.warehousesUpdate,
			output: Outputs.warehousesUpdate,
		},
		input,
		({ warehouseId, name, enabled, settings }) => ({
			method: 'PATCH',
			path: `/warehouses/${pathSegment(warehouseId)}`,
			body: { name, enabled, settings },
		}),
		{ log: ({ warehouseId }) => ({ warehouseId }) },
	);

export const addSourceConnection: SegmentEndpoints['warehousesAddSourceConnection'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'warehouses.addSourceConnection',
				input: Inputs.warehousesAddSourceConnection,
				output: Outputs.warehousesAddSourceConnection,
			},
			input,
			({ warehouseId, sourceId }) => ({
				method: 'POST',
				path: `/warehouses/${pathSegment(warehouseId)}/connected-sources/${pathSegment(sourceId)}`,
			}),
			{ log: ({ warehouseId, sourceId }) => ({ warehouseId, sourceId }) },
		);

export const remove: SegmentEndpoints['warehousesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'warehouses.delete',
			input: Inputs.warehousesDelete,
			output: Outputs.warehousesDelete,
		},
		input,
		({ warehouseId }) => ({
			method: 'DELETE',
			path: `/warehouses/${pathSegment(warehouseId)}`,
		}),
		{ log: ({ warehouseId }) => ({ warehouseId }) },
	);

export const removeSourceConnection: SegmentEndpoints['warehousesRemoveSourceConnection'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'warehouses.removeSourceConnection',
				input: Inputs.warehousesRemoveSourceConnection,
				output: Outputs.warehousesRemoveSourceConnection,
			},
			input,
			({ warehouseId, sourceId }) => ({
				method: 'DELETE',
				path: `/warehouses/${pathSegment(warehouseId)}/connected-sources/${pathSegment(sourceId)}`,
			}),
			{ log: ({ warehouseId, sourceId }) => ({ warehouseId, sourceId }) },
		);
