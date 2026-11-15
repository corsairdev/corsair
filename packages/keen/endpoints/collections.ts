import type { KeenEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	KeenEndpointInputSchemas as Inputs,
	KeenEndpointOutputSchemas as Outputs,
} from './types';

export const list: KeenEndpoints['collectionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'collections.list',
			input: Inputs.collectionsList,
			output: Outputs.collectionsList,
		},
		input,
		() => ({ method: 'GET', path: '/events' }),
		{ log: (_, result) => ({ count: result.length }) },
	);

export const get: KeenEndpoints['collectionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'collections.get',
			input: Inputs.collectionsGet,
			output: Outputs.collectionsGet,
		},
		input,
		({ collection }) => ({
			method: 'GET',
			path: `/events/${segment(collection)}`,
		}),
		{
			log: ({ collection }, result) => ({
				collection,
				properties: Object.keys(result.properties ?? {}).length,
			}),
		},
	);

// A property name can contain dots (`item.price`), which Keen keeps literal in
// this path rather than treating as nesting, so only one segment is encoded.
export const property: KeenEndpoints['propertiesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'properties.get',
			input: Inputs.propertiesGet,
			output: Outputs.propertiesGet,
		},
		input,
		({ collection, property: name }) => ({
			method: 'GET',
			path: `/events/${segment(collection)}/properties/${segment(name)}`,
		}),
		{
			log: ({ collection }, result) => ({
				collection,
				type: result.type ?? undefined,
			}),
		},
	);
