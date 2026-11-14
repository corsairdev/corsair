import type { PostmarkEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	PostmarkEndpointInputSchemas as Inputs,
	PostmarkEndpointOutputSchemas as Outputs,
} from './types';

export const list: PostmarkEndpoints['templatesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.list',
			input: Inputs.templatesList,
			output: Outputs.templatesList,
		},
		input,
		({ Count, Offset, TemplateType }) => ({
			method: 'GET',
			path: '/templates',
			query: { Count, Offset, TemplateType },
		}),
		{ log: (_, result) => ({ count: result.Templates.length }) },
	);

export const get: PostmarkEndpoints['templatesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.get',
			input: Inputs.templatesGet,
			output: Outputs.templatesGet,
		},
		input,
		({ idOrAlias }) => ({
			method: 'GET',
			path: `/templates/${segment(idOrAlias)}`,
		}),
		{ log: (_, result) => ({ templateId: result.TemplateId ?? undefined }) },
	);

export const create: PostmarkEndpoints['templatesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.create',
			input: Inputs.templatesCreate,
			output: Outputs.templatesCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/templates', body }),
		{ log: (_, result) => ({ templateId: result.TemplateId ?? undefined }) },
	);

export const update: PostmarkEndpoints['templatesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.update',
			input: Inputs.templatesUpdate,
			output: Outputs.templatesUpdate,
		},
		input,
		({ idOrAlias, ...body }) => ({
			method: 'PUT',
			path: `/templates/${segment(idOrAlias)}`,
			body,
		}),
		{ log: (_, result) => ({ templateId: result.TemplateId ?? undefined }) },
	);

export const remove: PostmarkEndpoints['templatesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.delete',
			input: Inputs.templatesDelete,
			output: Outputs.templatesDelete,
		},
		input,
		({ idOrAlias }) => ({
			method: 'DELETE',
			path: `/templates/${segment(idOrAlias)}`,
		}),
		{ log: (_, result) => ({ message: result.Message ?? undefined }) },
	);

export const validate: PostmarkEndpoints['templatesValidate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.validate',
			input: Inputs.templatesValidate,
			output: Outputs.templatesValidate,
		},
		input,
		(body) => ({ method: 'POST', path: '/templates/validate', body }),
		{ log: (_, result) => ({ valid: result.AllContentIsValid }) },
	);
