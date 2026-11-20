import type { PersonaEndpoints } from '..';
import { call } from './call';
import {
	PersonaEndpointInputSchemas as Inputs,
	PersonaEndpointOutputSchemas as Outputs,
} from './types';

export const list: PersonaEndpoints['inquiryTemplatesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'inquiryTemplates.list',
			input: Inputs.inquiryTemplatesList,
			output: Outputs.inquiryTemplatesList,
		},
		input,
		() => ({ method: 'GET', path: '/inquiry-templates' }),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const get: PersonaEndpoints['inquiryTemplatesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'inquiryTemplates.get',
			input: Inputs.inquiryTemplatesGet,
			output: Outputs.inquiryTemplatesGet,
		},
		input,
		({ inquiryTemplateId }) => ({
			method: 'GET',
			path: `/inquiry-templates/${encodeURIComponent(inquiryTemplateId)}`,
		}),
		{ log: (_, result) => ({ templateId: result.data?.id ?? undefined }) },
	);

export const listVersions: PersonaEndpoints['inquiryTemplateVersionsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'inquiryTemplateVersions.list',
			input: Inputs.inquiryTemplateVersionsList,
			output: Outputs.inquiryTemplateVersionsList,
		},
		input,
		() => ({ method: 'GET', path: '/inquiry-template-versions' }),
		{ log: (_, page) => ({ count: page.data.length }) },
	);
