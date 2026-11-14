import type { KeenEndpoints } from '..';
import { segment } from '../client';
import { call, deletedResult } from './call';
import {
	KeenEndpointInputSchemas as Inputs,
	KeenEndpointOutputSchemas as Outputs,
} from './types';

export const list: KeenEndpoints['savedQueriesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'savedQueries.list',
			input: Inputs.savedQueriesList,
			output: Outputs.savedQueriesList,
		},
		input,
		() => ({ method: 'GET', path: '/queries/saved' }),
		{
			// Keen answers a bare array of definitions; it is wrapped as
			// `{ queries }` so the output can grow fields later.
			shape: (raw) => (Array.isArray(raw) ? { queries: raw } : raw),
			log: (_, result) => ({ count: result.queries.length }),
		},
	);

export const get: KeenEndpoints['savedQueriesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'savedQueries.get',
			input: Inputs.savedQueriesGet,
			output: Outputs.savedQueriesGet,
		},
		input,
		({ queryName }) => ({
			method: 'GET',
			path: `/queries/saved/${segment(queryName)}`,
		}),
		{ log: (_, result) => ({ queryName: result.query_name }) },
	);

// Creating a saved query is a PUT keyed by name, so sending the same name
// twice replaces the definition instead of adding a second one.
export const create: KeenEndpoints['savedQueriesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'savedQueries.create',
			input: Inputs.savedQueriesCreate,
			output: Outputs.savedQueriesCreate,
		},
		input,
		({ queryName, query, refresh_rate, metadata }) => ({
			method: 'PUT',
			path: `/queries/saved/${segment(queryName)}`,
			body: Object.fromEntries(
				Object.entries({ query, refresh_rate, metadata }).filter(
					([, value]) => value !== undefined,
				),
			),
		}),
		{ log: ({ queryName }) => ({ queryName }) },
	);

export const result: KeenEndpoints['savedQueriesResult'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'savedQueries.result',
			input: Inputs.savedQueriesResult,
			output: Outputs.savedQueriesResult,
		},
		input,
		({ queryName }) => ({
			method: 'GET',
			path: `/queries/saved/${segment(queryName)}/result`,
		}),
		{ log: (_, value) => ({ queryName: value.query_name }) },
	);

export const remove: KeenEndpoints['savedQueriesRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'savedQueries.delete',
			input: Inputs.savedQueriesRemove,
			output: Outputs.savedQueriesRemove,
		},
		input,
		({ queryName }) => ({
			method: 'DELETE',
			path: `/queries/saved/${segment(queryName)}`,
		}),
		{
			shape: () => deletedResult(),
			log: ({ queryName }) => ({ queryName }),
		},
	);
