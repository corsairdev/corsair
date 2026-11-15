import type { KitEndpoints } from '..';
import { definedQuery, segment } from '../client';
import { call } from './call';
import {
	KitEndpointInputSchemas as Inputs,
	KitEndpointOutputSchemas as Outputs,
} from './types';

export const list: KitEndpoints['customFieldsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customFields.list',
			input: Inputs.customFieldsList,
			output: Outputs.customFieldsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v4/custom_fields',
			query: definedQuery({
				after: parsed.after,
				before: parsed.before,
				per_page: parsed.per_page,
				include_total_count: parsed.include_total_count,
			}),
		}),
		{ log: (_, result) => ({ count: result.custom_fields.length }) },
	);

export const create: KitEndpoints['customFieldsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customFields.create',
			input: Inputs.customFieldsCreate,
			output: Outputs.customFieldsCreate,
		},
		input,
		({ label }) => ({
			method: 'POST',
			path: '/v4/custom_fields',
			body: { label },
		}),
		{ log: (_, result) => ({ customFieldId: result.custom_field.id }) },
	);

export const update: KitEndpoints['customFieldsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customFields.update',
			input: Inputs.customFieldsUpdate,
			output: Outputs.customFieldsUpdate,
		},
		input,
		({ customFieldId, label }) => ({
			method: 'PUT',
			path: `/v4/custom_fields/${segment(customFieldId)}`,
			body: { label },
		}),
		{ log: ({ customFieldId }) => ({ customFieldId }) },
	);
