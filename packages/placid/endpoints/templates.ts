import type { PlacidEndpoints } from '..';
import { segment } from '../client';
import { call, callDelete } from './call';
import {
	PlacidEndpointInputSchemas as Inputs,
	PlacidEndpointOutputSchemas as Outputs,
} from './types';

export const list: PlacidEndpoints['templatesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.list',
			input: Inputs.templatesList,
			output: Outputs.templatesList,
		},
		input,
		(parsed) => ({ method: 'GET', path: '/templates', query: parsed }),
		{
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const create: PlacidEndpoints['templatesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.create',
			input: Inputs.templatesCreate,
			output: Outputs.templatesCreate,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/templates', body: parsed }),
		{
			log: (_, result) => ({ uuid: result.uuid }),
		},
	);

export const get: PlacidEndpoints['templatesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.get',
			input: Inputs.templatesGet,
			output: Outputs.templatesGet,
		},
		input,
		({ template_uuid }) => ({
			method: 'GET',
			path: `/templates/${segment(template_uuid)}`,
		}),
		{
			log: (_, result) => ({ uuid: result.uuid }),
		},
	);

export const update: PlacidEndpoints['templatesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.update',
			input: Inputs.templatesUpdate,
			output: Outputs.templatesUpdate,
		},
		input,
		({ template_uuid, ...body }) => ({
			method: 'PATCH',
			path: `/templates/${segment(template_uuid)}`,
			body,
		}),
		{
			log: ({ template_uuid }) => ({ uuid: template_uuid }),
		},
	);

export const remove: PlacidEndpoints['templatesDelete'] = (ctx, input) =>
	callDelete(
		ctx,
		{
			event: 'templates.delete',
			input: Inputs.templatesDelete,
			output: Outputs.templatesDelete,
		},
		input,
		({ template_uuid }) => ({
			method: 'DELETE',
			path: `/templates/${segment(template_uuid)}`,
		}),
		({ template_uuid }) => ({ success: true as const, template_uuid }),
		({ template_uuid }) => ({ uuid: template_uuid }),
	);
