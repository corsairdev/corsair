import type { StoryblokEndpoints } from '..';
import { segment } from '../client';
import { call } from './shared';
import {
	StoryblokEndpointInputSchemas as Inputs,
	StoryblokEndpointOutputSchemas as Outputs,
} from './types';

export const list: StoryblokEndpoints['componentsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'components.list',
			input: Inputs.componentsList,
			output: Outputs.componentsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/components', query }),
		{ log: (_, result) => ({ count: result.components.length }) },
	);

export const create: StoryblokEndpoints['componentsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'components.create',
			input: Inputs.componentsCreate,
			output: Outputs.componentsCreate,
		},
		input,
		(component) => ({
			method: 'POST',
			path: '/components',
			body: { component },
		}),
		{ log: (_, result) => ({ componentId: result.component.id ?? undefined }) },
	);

export const update: StoryblokEndpoints['componentsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'components.update',
			input: Inputs.componentsUpdate,
			output: Outputs.componentsUpdate,
		},
		input,
		({ component_id, ...component }) => ({
			method: 'PUT',
			path: `/components/${segment(component_id)}`,
			body: { component },
		}),
		{ log: ({ component_id }) => ({ componentId: component_id }) },
	);

export const remove: StoryblokEndpoints['componentsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'components.delete',
			input: Inputs.componentsDelete,
			output: Outputs.componentsDelete,
		},
		input,
		({ component_id }) => ({
			method: 'DELETE',
			path: `/components/${segment(component_id)}`,
		}),
		{ log: ({ component_id }) => ({ componentId: component_id }) },
	);
