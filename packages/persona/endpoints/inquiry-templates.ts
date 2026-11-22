import type { PersonaEndpoints } from '..';
import { call, pageQuery, segment } from './call';
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
		(page) => ({
			method: 'GET',
			path: '/inquiry-templates',
			query: pageQuery(page),
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				hasMore: Boolean(result.links?.next),
			}),
		},
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
			path: `/inquiry-templates/${segment(inquiryTemplateId)}`,
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
		({ inquiryTemplateId, ...page }) => ({
			method: 'GET',
			path: '/inquiry-template-versions',
			query: {
				...pageQuery(page),
				'filter[inquiry-template-id]': inquiryTemplateId,
			},
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				hasMore: Boolean(result.links?.next),
			}),
		},
	);
