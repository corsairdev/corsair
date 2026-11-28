import type { ShotstackEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import type {
	TemplatesCreateInput,
	TemplatesDeleteInput,
	TemplatesGetInput,
	TemplatesRenderInput,
	TemplatesUpdateInput,
} from './types';
import {
	ShotstackEndpointInputSchemas,
	ShotstackEndpointOutputSchemas,
} from './types';

export const list: ShotstackEndpoints['templatesList'] = async (
	ctx,
	rawInput,
) => {
	return call(
		ctx,
		{
			event: 'templates.list',
			input: ShotstackEndpointInputSchemas.templatesList,
			output: ShotstackEndpointOutputSchemas.templatesList,
		},
		rawInput,
		() => ({ method: 'GET', service: 'edit', path: '/templates' }),
		{
			log: (_input, result) => ({
				owner: result.response.owner,
				count: result.response.templates.length,
			}),
		},
	);
};

export const get: ShotstackEndpoints['templatesGet'] = async (
	ctx,
	rawInput,
) => {
	return call(
		ctx,
		{
			event: 'templates.get',
			input: ShotstackEndpointInputSchemas.templatesGet,
			output: ShotstackEndpointOutputSchemas.templatesGet,
		},
		rawInput,
		(input: TemplatesGetInput) => ({
			method: 'GET',
			service: 'edit',
			path: `/templates/${segment(input.id)}`,
		}),
	);
};

export const create: ShotstackEndpoints['templatesCreate'] = async (
	ctx,
	rawInput,
) => {
	return call(
		ctx,
		{
			event: 'templates.create',
			input: ShotstackEndpointInputSchemas.templatesCreate,
			output: ShotstackEndpointOutputSchemas.templatesCreate,
		},
		rawInput,
		(input: TemplatesCreateInput) => ({
			method: 'POST',
			service: 'edit',
			path: '/templates',
			body: { name: input.name, template: input.template },
		}),
		{
			log: (_input, result) => ({ templateId: result.response.id }),
		},
	);
};

export const update: ShotstackEndpoints['templatesUpdate'] = async (
	ctx,
	rawInput,
) => {
	return call(
		ctx,
		{
			event: 'templates.update',
			input: ShotstackEndpointInputSchemas.templatesUpdate,
			output: ShotstackEndpointOutputSchemas.templatesUpdate,
		},
		rawInput,
		(input: TemplatesUpdateInput) => ({
			method: 'PUT',
			service: 'edit',
			path: `/templates/${segment(input.id)}`,
			body: { name: input.name, template: input.template },
		}),
		{
			log: (input) => ({ templateId: input.id }),
		},
	);
};

// `delete` is a reserved word, so the function is `remove`.
export const remove: ShotstackEndpoints['templatesDelete'] = async (
	ctx,
	rawInput,
) => {
	return call(
		ctx,
		{
			event: 'templates.delete',
			input: ShotstackEndpointInputSchemas.templatesDelete,
			output: ShotstackEndpointOutputSchemas.templatesDelete,
		},
		rawInput,
		(input: TemplatesDeleteInput) => ({
			method: 'DELETE',
			service: 'edit',
			path: `/templates/${segment(input.id)}`,
		}),
		{
			shape: (raw) => raw ?? {},
		},
	);
};

export const render: ShotstackEndpoints['templatesRender'] = async (
	ctx,
	rawInput,
) => {
	return call(
		ctx,
		{
			event: 'templates.render',
			input: ShotstackEndpointInputSchemas.templatesRender,
			output: ShotstackEndpointOutputSchemas.templatesRender,
		},
		rawInput,
		(input: TemplatesRenderInput) => ({
			method: 'POST',
			service: 'edit',
			path: '/templates/render',
			body: { id: input.id, merge: input.merge },
		}),
		{
			log: (_input, result) => ({
				renderId: result.response.id,
			}),
		},
	);
};
