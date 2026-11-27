import type { SegmentContext, SegmentEndpoints } from '..';
import { paginationQuery, pathSegment } from '../client';
import { call } from './call';
import {
	SegmentEndpointInputSchemas as Inputs,
	SegmentEndpointOutputSchemas as Outputs,
} from './types';

export const listDestinations: SegmentEndpoints['catalogListDestinations'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'catalog.listDestinations',
			input: Inputs.catalogListDestinations,
			output: Outputs.catalogListDestinations,
		},
		input,
		({ count, cursor }) => ({
			method: 'GET',
			path: '/catalog/destinations',
			query: paginationQuery(count, cursor),
		}),
		{
			log: (_, result) => ({ count: result.data.destinationsCatalog.length }),
		},
	);

// Resolves a `metadataId` for `destinations.create`.
export const getDestination: SegmentEndpoints['catalogGetDestination'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'catalog.getDestination',
			input: Inputs.catalogGetDestination,
			output: Outputs.catalogGetDestination,
		},
		input,
		({ destinationMetadataId }) => ({
			method: 'GET',
			path: `/catalog/destinations/${pathSegment(destinationMetadataId)}`,
		}),
		{ log: ({ destinationMetadataId }) => ({ destinationMetadataId }) },
	);

export const listSources: SegmentEndpoints['catalogListSources'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'catalog.listSources',
			input: Inputs.catalogListSources,
			output: Outputs.catalogListSources,
		},
		input,
		({ count, cursor }) => ({
			method: 'GET',
			path: '/catalog/sources',
			query: paginationQuery(count, cursor),
		}),
		{ log: (_, result) => ({ count: result.data.sourcesCatalog.length }) },
	);

// Resolves a `metadataId` for `sources.create`.
export const getSource: SegmentEndpoints['catalogGetSource'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'catalog.getSource',
			input: Inputs.catalogGetSource,
			output: Outputs.catalogGetSource,
		},
		input,
		({ sourceMetadataId }) => ({
			method: 'GET',
			path: `/catalog/sources/${pathSegment(sourceMetadataId)}`,
		}),
		{ log: ({ sourceMetadataId }) => ({ sourceMetadataId }) },
	);
