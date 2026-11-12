import type { MeloEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import { withNextPage } from './pagination';
import {
	MeloEndpointInputSchemas as Inputs,
	MeloEndpointOutputSchemas as Outputs,
} from './types';

export const list: MeloEndpoints['propertiesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'properties.list',
			input: Inputs.propertiesList,
			output: Outputs.propertiesList,
		},
		input,
		(query) => ({
			method: 'GET',
			path: '/documents/properties',
			query,
		}),
		{
			shape: (raw) => withNextPage(raw),
			log: (_, result) => ({
				count: result['hydra:member'].length,
				total: result['hydra:totalItems'] ?? undefined,
			}),
		},
	);

export const get: MeloEndpoints['propertiesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'properties.get',
			input: Inputs.propertiesGet,
			output: Outputs.propertiesGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/documents/properties/${segment(id)}`,
		}),
		{ log: ({ id }) => ({ propertyId: id }) },
	);

export const listSimilar: MeloEndpoints['propertiesListSimilar'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'properties.listSimilar',
			input: Inputs.propertiesListSimilar,
			output: Outputs.propertiesListSimilar,
		},
		input,
		({ id, ...query }) => ({
			method: 'GET',
			path: `/documents/properties/${segment(id)}/similar-properties`,
			query,
		}),
		{
			shape: (raw) => withNextPage(raw),
			log: ({ id }, result) => ({
				propertyId: id,
				count: result['hydra:member'].length,
			}),
		},
	);
