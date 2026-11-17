import type { SignwellEndpoints } from '..';
import { segment } from '../client';
import { call, deletion } from './shared';
import {
	SignwellEndpointInputSchemas as Inputs,
	SignwellEndpointOutputSchemas as Outputs,
} from './types';

export const get: SignwellEndpoints['templatesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.get',
			input: Inputs.templatesGet,
			output: Outputs.templatesGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/v1/document_templates/${segment(id)}`,
		}),
		{
			log: ({ id }, result) => ({
				templateId: id,
				status: result.status ?? undefined,
			}),
		},
	);

export const create: SignwellEndpoints['templatesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.create',
			input: Inputs.templatesCreate,
			output: Outputs.templatesCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/v1/document_templates', body }),
		{
			log: (parsed, result) => ({
				templateId: result.id,
				placeholders: parsed.placeholders.length,
			}),
		},
	);

export const update: SignwellEndpoints['templatesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.update',
			input: Inputs.templatesUpdate,
			output: Outputs.templatesUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/v1/document_templates/${segment(id)}`,
			body,
		}),
		{
			log: ({ id }) => ({ templateId: id }),
		},
	);

export const remove: SignwellEndpoints['templatesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.delete',
			input: Inputs.templatesDelete,
			output: Outputs.templatesDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/v1/document_templates/${segment(id)}`,
		}),
		{
			shape: (raw, { id }) => deletion(raw, 'templates.delete', id),
			log: ({ id }) => ({ templateId: id }),
		},
	);
