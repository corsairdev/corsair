import { asRecord } from 'corsair/core';
import type { ESignaturesEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	ESignaturesEndpointInputSchemas as Inputs,
	ESignaturesEndpointOutputSchemas as Outputs,
} from './types';

export const list: ESignaturesEndpoints['templatesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.list',
			input: Inputs.templatesList,
			output: Outputs.templatesList,
		},
		input,
		() => ({
			method: 'GET',
			path: '/templates',
		}),
		{
			// The list comes back as `data` with no paging parameter.
			shape: (raw) => ({ templates: asRecord(raw)?.data ?? [] }),
			log: (_, result) => ({ count: result.templates.length }),
		},
	);

export const get: ESignaturesEndpoints['templatesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.get',
			input: Inputs.templatesGet,
			output: Outputs.templatesGet,
		},
		input,
		({ template_id }) => ({
			method: 'GET',
			path: `/templates/${segment(template_id)}`,
		}),
		{
			shape: (raw) => ({ template: asRecord(raw)?.data }),
			log: ({ template_id }) => ({ templateId: template_id }),
		},
	);

export const create: ESignaturesEndpoints['templatesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.create',
			input: Inputs.templatesCreate,
			output: Outputs.templatesCreate,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/templates',
			body,
		}),
		{
			// The docs show `data` as a one-row array; the live API answers
			// `{ status: 'created', data: { template_id, ... } }`. Both are read.
			shape: (raw) => {
				const data = asRecord(raw)?.data;
				return {
					template_id: asRecord(Array.isArray(data) ? data[0] : data)
						?.template_id,
				};
			},
			log: ({ title }, result) => ({
				templateId: result.template_id,
				titleLength: title.length,
			}),
		},
	);

export const deleteTemplate: ESignaturesEndpoints['templatesDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.delete',
			input: Inputs.templatesDelete,
			output: Outputs.templatesDelete,
		},
		input,
		({ template_id }) => ({
			method: 'POST',
			path: `/templates/${segment(template_id)}/delete`,
		}),
		{
			log: ({ template_id }) => ({ templateId: template_id }),
		},
	);
