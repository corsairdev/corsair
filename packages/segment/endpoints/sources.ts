import type { SegmentEndpoints } from '..';
import { paginationQuery, pathSegment } from '../client';
import { call } from './call';
import {
	SegmentEndpointInputSchemas as Inputs,
	SegmentEndpointOutputSchemas as Outputs,
} from './types';

export const list: SegmentEndpoints['sourcesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sources.list',
			input: Inputs.sourcesList,
			output: Outputs.sourcesList,
		},
		input,
		({ count, cursor }) => ({
			method: 'GET',
			path: '/sources',
			query: paginationQuery(count, cursor),
		}),
		{ log: (_, result) => ({ count: result.data.sources.length }) },
	);

export const get: SegmentEndpoints['sourcesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sources.get',
			input: Inputs.sourcesGet,
			output: Outputs.sourcesGet,
		},
		input,
		({ sourceId }) => ({
			method: 'GET',
			path: `/sources/${pathSegment(sourceId)}`,
		}),
		{ log: ({ sourceId }) => ({ sourceId }) },
	);

export const create: SegmentEndpoints['sourcesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sources.create',
			input: Inputs.sourcesCreate,
			output: Outputs.sourcesCreate,
		},
		input,
		({ slug, metadataId, enabled, settings, disconnectAllWarehouses }) => ({
			method: 'POST',
			path: '/sources',
			body: {
				slug,
				metadataId,
				enabled,
				settings,
				disconnectAllWarehouses,
			},
		}),
		{ log: (_, result) => ({ sourceId: result.data.source.id ?? '' }) },
	);

export const update: SegmentEndpoints['sourcesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sources.update',
			input: Inputs.sourcesUpdate,
			output: Outputs.sourcesUpdate,
		},
		input,
		({ sourceId, name, enabled, slug, settings }) => ({
			method: 'PATCH',
			path: `/sources/${pathSegment(sourceId)}`,
			body: { name, enabled, slug, settings },
		}),
		{ log: ({ sourceId }) => ({ sourceId }) },
	);

export const remove: SegmentEndpoints['sourcesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sources.delete',
			input: Inputs.sourcesDelete,
			output: Outputs.sourcesDelete,
		},
		input,
		({ sourceId }) => ({
			method: 'DELETE',
			path: `/sources/${pathSegment(sourceId)}`,
		}),
		{ log: ({ sourceId }) => ({ sourceId }) },
	);

export const listConnectedDestinations: SegmentEndpoints['sourcesListConnectedDestinations'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'sources.listConnectedDestinations',
				input: Inputs.sourcesListConnectedDestinations,
				output: Outputs.sourcesListConnectedDestinations,
			},
			input,
			({ sourceId, count, cursor }) => ({
				method: 'GET',
				path: `/sources/${pathSegment(sourceId)}/connected-destinations`,
				query: paginationQuery(count, cursor),
			}),
			{
				log: ({ sourceId }, result) => ({
					sourceId,
					count: result.data.destinations.length,
				}),
			},
		);

export const listConnectedWarehouses: SegmentEndpoints['sourcesListConnectedWarehouses'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'sources.listConnectedWarehouses',
				input: Inputs.sourcesListConnectedWarehouses,
				output: Outputs.sourcesListConnectedWarehouses,
			},
			input,
			({ sourceId, count, cursor }) => ({
				method: 'GET',
				path: `/sources/${pathSegment(sourceId)}/connected-warehouses`,
				query: paginationQuery(count, cursor),
			}),
			{
				log: ({ sourceId }, result) => ({
					sourceId,
					count: result.data.warehouses.length,
				}),
			},
		);

export const updateSchemaSettings: SegmentEndpoints['sourcesUpdateSchemaSettings'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'sources.updateSchemaSettings',
				input: Inputs.sourcesUpdateSchemaSettings,
				output: Outputs.sourcesUpdateSchemaSettings,
			},
			input,
			({ sourceId, settings }) => ({
				method: 'PATCH',
				path: `/sources/${pathSegment(sourceId)}/settings`,
				body: settings,
			}),
			{ log: ({ sourceId }) => ({ sourceId }) },
		);

// Returns the updated Source: `writeKeys` now includes the new key. This
// mints a credential, so it is a write, not a read.
export const createWriteKey: SegmentEndpoints['sourcesCreateWriteKey'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'sources.createWriteKey',
			input: Inputs.sourcesCreateWriteKey,
			output: Outputs.sourcesCreateWriteKey,
		},
		input,
		({ sourceId }) => ({
			method: 'POST',
			path: `/sources/${pathSegment(sourceId)}/writekey`,
		}),
		{ log: ({ sourceId }) => ({ sourceId }) },
	);

export const removeWriteKey: SegmentEndpoints['sourcesRemoveWriteKey'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'sources.removeWriteKey',
			input: Inputs.sourcesRemoveWriteKey,
			output: Outputs.sourcesRemoveWriteKey,
		},
		input,
		({ sourceId, writeKey }) => ({
			method: 'DELETE',
			path: `/sources/${pathSegment(sourceId)}/writekey/${pathSegment(writeKey)}`,
		}),
		{ log: ({ sourceId }) => ({ sourceId }) },
	);
