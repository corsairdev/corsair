import type { ReamazeEndpoints } from '..';
import { pathSegment } from '../client';
import { call, queryOf, unwrapList, unwrapObject } from './call';
import {
	ReamazeEndpointInputSchemas as Inputs,
	ReamazeEndpointOutputSchemas as Outputs,
} from './types';

export const list: ReamazeEndpoints['responseTemplatesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'response_templates.list',
			input: Inputs.responseTemplatesList,
			output: Outputs.responseTemplatesList,
		},
		input,
		({ q, page }) => ({
			method: 'GET',
			path: '/response_templates',
			query: queryOf({ q, page }),
		}),
		{
			shape: (raw) => ({
				...unwrapObject(raw, 'response template list'),
				response_templates: unwrapList(
					raw,
					'response_templates',
					'response template list',
				),
			}),
			log: (_, result) => ({ count: result.response_templates.length }),
		},
	);

export const get: ReamazeEndpoints['responseTemplatesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'response_templates.get',
			input: Inputs.responseTemplatesGet,
			output: Outputs.responseTemplatesGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/response_templates/${pathSegment(id)}`,
		}),
		{
			shape: (raw) => unwrapObject(raw, 'response template'),
			log: (parsed) => ({ id: parsed.id }),
		},
	);

export const create: ReamazeEndpoints['responseTemplatesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'response_templates.create',
			input: Inputs.responseTemplatesCreate,
			output: Outputs.responseTemplatesCreate,
		},
		input,
		({ name, body, is_personal }) => ({
			method: 'POST',
			path: '/response_templates',
			body: { response_template: { name, body, is_personal } },
		}),
		{
			shape: (raw) => unwrapObject(raw, 'created response template'),
			log: (parsed) => ({ name: parsed.name }),
		},
	);

export const update: ReamazeEndpoints['responseTemplatesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'response_templates.update',
			input: Inputs.responseTemplatesUpdate,
			output: Outputs.responseTemplatesUpdate,
		},
		input,
		({ id, name, body, is_personal }) => ({
			method: 'PUT',
			path: `/response_templates/${pathSegment(id)}`,
			body: { response_template: { name, body, is_personal } },
		}),
		{
			shape: (raw) => unwrapObject(raw, 'updated response template'),
			log: (parsed) => ({ id: parsed.id }),
		},
	);
