import type { StoryblokEndpoints } from '..';
import { segment } from '../client';
import { call, confirmDeletion } from './shared';
import {
	StoryblokEndpointInputSchemas as Inputs,
	StoryblokEndpointOutputSchemas as Outputs,
} from './types';

export const list: StoryblokEndpoints['datasourcesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'datasources.list',
			input: Inputs.datasourcesList,
			output: Outputs.datasourcesList,
		},
		input,
		(query) => ({ method: 'GET', path: '/datasources', query }),
		{ log: (_, result) => ({ count: result.datasources.length }) },
	);

export const get: StoryblokEndpoints['datasourcesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'datasources.get',
			input: Inputs.datasourcesGet,
			output: Outputs.datasourcesGet,
		},
		input,
		({ datasource_id }) => ({
			method: 'GET',
			path: `/datasources/${segment(datasource_id)}`,
		}),
		{ log: ({ datasource_id }) => ({ datasourceId: datasource_id }) },
	);

export const create: StoryblokEndpoints['datasourcesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'datasources.create',
			input: Inputs.datasourcesCreate,
			output: Outputs.datasourcesCreate,
		},
		input,
		(datasource) => ({
			method: 'POST',
			path: '/datasources',
			body: { datasource },
		}),
		{
			log: (_, result) => ({ datasourceId: result.datasource.id ?? undefined }),
		},
	);

export const update: StoryblokEndpoints['datasourcesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'datasources.update',
			input: Inputs.datasourcesUpdate,
			output: Outputs.datasourcesUpdate,
		},
		input,
		({ datasource_id, ...datasource }) => ({
			method: 'PUT',
			path: `/datasources/${segment(datasource_id)}`,
			body: { datasource },
		}),
		{ log: ({ datasource_id }) => ({ datasourceId: datasource_id }) },
	);

export const remove: StoryblokEndpoints['datasourcesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'datasources.delete',
			input: Inputs.datasourcesDelete,
			output: Outputs.datasourcesDelete,
		},
		input,
		({ datasource_id }) => ({
			method: 'DELETE',
			path: `/datasources/${segment(datasource_id)}`,
		}),
		{
			// A bodyless 204 (or the wrapped record) confirms the delete.
			shape: (raw, { datasource_id }) =>
				confirmDeletion(raw, 'datasource', datasource_id),
			log: ({ datasource_id }) => ({ datasourceId: datasource_id }),
		},
	);
