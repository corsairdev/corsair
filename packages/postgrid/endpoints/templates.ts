import type { PostgridEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	PostgridEndpointInputSchemas as Inputs,
	PostgridEndpointOutputSchemas as Outputs,
} from './types';

export const list: PostgridEndpoints['templatesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.list',
			input: Inputs.templatesList,
			output: Outputs.templatesList,
		},
		input,
		({ skip, limit, search }) => ({
			method: 'GET',
			path: '/templates',
			query: { skip, limit, search },
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: PostgridEndpoints['templatesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.get',
			input: Inputs.templatesGet,
			output: Outputs.templatesGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/templates/${segment(id)}` }),
		{ log: ({ id }) => ({ templateId: id }) },
	);

export const create: PostgridEndpoints['templatesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.create',
			input: Inputs.templatesCreate,
			output: Outputs.templatesCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/templates', body }),
		{ log: (_, result) => ({ templateId: result.id ?? undefined }) },
	);

export const update: PostgridEndpoints['templatesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.update',
			input: Inputs.templatesUpdate,
			output: Outputs.templatesUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'POST',
			path: `/templates/${segment(id)}`,
			body,
		}),
		{ log: ({ id }) => ({ templateId: id }) },
	);

export const remove: PostgridEndpoints['templatesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.delete',
			input: Inputs.templatesDelete,
			output: Outputs.templatesDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/templates/${segment(id)}` }),
		{ log: ({ id }) => ({ templateId: id }) },
	);
