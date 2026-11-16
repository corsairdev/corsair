import type { SuitedashEndpoints } from '..';
import { segment } from '../client';
import { call } from './shared';
import {
	SuitedashEndpointInputSchemas as Inputs,
	SuitedashEndpointOutputSchemas as Outputs,
} from './types';

export const list: SuitedashEndpoints['projectsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.list',
			input: Inputs.projectsList,
			output: Outputs.projectsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/projects', query }),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: SuitedashEndpoints['projectsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.get',
			input: Inputs.projectsGet,
			output: Outputs.projectsGet,
		},
		input,
		({ type, identifier, meta }) => ({
			method: 'GET',
			// The lookup mode is part of the path, not a query: `uid`, `name`,
			// `contains_the_following` or `most_recent`.
			path: `/project/${segment(type)}/${segment(identifier)}`,
			query: { meta },
		}),
		// A name lookup can hold a client's name, so only the uid is logged.
		{
			log: ({ type }, result) => ({
				lookup: type,
				projectUid: result.data.uid ?? undefined,
			}),
		},
	);

export const update: SuitedashEndpoints['projectsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.update',
			input: Inputs.projectsUpdate,
			output: Outputs.projectsUpdate,
		},
		input,
		({ type, identifier, ...body }) => ({
			method: 'PUT',
			path: `/project/${segment(type)}/${segment(identifier)}`,
			body,
		}),
		// A name lookup can hold a client's name, so only the uid is logged.
		{
			log: ({ type }, result) => ({
				lookup: type,
				projectUid: result.data.uid ?? undefined,
			}),
		},
	);

export const meta: SuitedashEndpoints['projectsMeta'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.meta',
			input: Inputs.projectsMeta,
			output: Outputs.projectsMeta,
		},
		input,
		() => ({ method: 'GET', path: '/project/meta' }),
		{ log: (_, result) => ({ count: Object.keys(result).length }) },
	);
