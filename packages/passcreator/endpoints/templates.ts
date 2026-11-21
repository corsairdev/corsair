import type { PasscreatorEndpoints } from '..';
import { call, expectEmpty } from './call';
import {
	PasscreatorEndpointInputSchemas as Inputs,
	PasscreatorEndpointOutputSchemas as Outputs,
} from './types';

export const list: PasscreatorEndpoints['templatesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.list',
			input: Inputs.templatesList,
			output: Outputs.templatesList,
		},
		input,
		() => ({ method: 'GET', path: '/api/pass-template' }),
		{ log: (_, templates) => ({ count: templates.length }) },
	);

export const fields: PasscreatorEndpoints['templatesFields'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.fields',
			input: Inputs.templatesFields,
			output: Outputs.templatesFields,
		},
		input,
		({ templateUid }) => ({
			method: 'GET',
			path: `/api/pass-template/${encodeURIComponent(templateUid)}`,
			query: { zapierStyle: true },
		}),
		{ log: () => ({}) },
	);

export const copy: PasscreatorEndpoints['templatesCopy'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.copy',
			input: Inputs.templatesCopy,
			output: Outputs.templatesCopy,
		},
		input,
		({ templateUid, ...body }) => ({
			method: 'POST',
			path: `/api/pass-template/copy/${encodeURIComponent(templateUid)}`,
			body,
		}),
		{
			log: (_, template) => ({ templateUid: template.identifier ?? undefined }),
		},
	);

export const remove: PasscreatorEndpoints['templatesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.delete',
			input: Inputs.templatesDelete,
			output: Outputs.templatesDelete,
		},
		input,
		({ templateUid }) => ({
			method: 'DELETE',
			path: `/api/pass-template/${encodeURIComponent(templateUid)}`,
		}),
		{
			// The API answers 200 with no body.
			shape: (raw, { templateUid }) => {
				expectEmpty(raw, 'templates.delete');
				return { templateUid, success: true };
			},
			log: (_, result) => ({ success: result.success }),
		},
	);

export const movePass: PasscreatorEndpoints['templatesMovePass'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.movePass',
			input: Inputs.templatesMovePass,
			output: Outputs.templatesMovePass,
		},
		input,
		({ passUid, targetTemplateIdentifier }) => ({
			method: 'POST',
			path: `/api/v2/pass/${encodeURIComponent(passUid)}/movetotemplate/${encodeURIComponent(targetTemplateIdentifier)}`,
		}),
		{ log: (_, result) => ({ success: result.success }) },
	);
