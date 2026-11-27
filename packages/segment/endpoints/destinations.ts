import type { SegmentEndpoints } from '..';
import { paginationQuery, pathSegment } from '../client';
import { call } from './call';
import {
	SegmentEndpointInputSchemas as Inputs,
	SegmentEndpointOutputSchemas as Outputs,
} from './types';

export const list: SegmentEndpoints['destinationsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'destinations.list',
			input: Inputs.destinationsList,
			output: Outputs.destinationsList,
		},
		input,
		({ count, cursor }) => ({
			method: 'GET',
			path: '/destinations',
			query: paginationQuery(count, cursor),
		}),
		{ log: (_, result) => ({ count: result.data.destinations.length }) },
	);

export const get: SegmentEndpoints['destinationsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'destinations.get',
			input: Inputs.destinationsGet,
			output: Outputs.destinationsGet,
		},
		input,
		({ destinationId }) => ({
			method: 'GET',
			path: `/destinations/${pathSegment(destinationId)}`,
		}),
		{ log: ({ destinationId }) => ({ destinationId }) },
	);

export const create: SegmentEndpoints['destinationsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'destinations.create',
			input: Inputs.destinationsCreate,
			output: Outputs.destinationsCreate,
		},
		input,
		({ sourceId, metadataId, enabled, name, settings }) => ({
			method: 'POST',
			path: '/destinations',
			body: { sourceId, metadataId, enabled, name, settings },
		}),
		{
			log: (_, result) => ({ destinationId: result.data.destination.id ?? '' }),
		},
	);

export const update: SegmentEndpoints['destinationsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'destinations.update',
			input: Inputs.destinationsUpdate,
			output: Outputs.destinationsUpdate,
		},
		input,
		({ destinationId, name, enabled, settings }) => ({
			method: 'PATCH',
			path: `/destinations/${pathSegment(destinationId)}`,
			body: { name, enabled, settings },
		}),
		{ log: ({ destinationId }) => ({ destinationId }) },
	);

export const remove: SegmentEndpoints['destinationsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'destinations.delete',
			input: Inputs.destinationsDelete,
			output: Outputs.destinationsDelete,
		},
		input,
		({ destinationId }) => ({
			method: 'DELETE',
			path: `/destinations/${pathSegment(destinationId)}`,
		}),
		{ log: ({ destinationId }) => ({ destinationId }) },
	);
