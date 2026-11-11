import type { EmailOctopusEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	EmailOctopusEndpointInputSchemas as Inputs,
	EmailOctopusEndpointOutputSchemas as Outputs,
} from './types';

export const create: EmailOctopusEndpoints['fieldsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fields.create',
			input: Inputs.fieldsCreate,
			output: Outputs.fieldsCreate,
		},
		input,
		({ list_id, ...body }) => ({
			method: 'POST',
			path: `/lists/${segment(list_id)}/fields`,
			body,
		}),
		{ log: ({ list_id, tag }) => ({ listId: list_id, tag }) },
	);

export const update: EmailOctopusEndpoints['fieldsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fields.update',
			input: Inputs.fieldsUpdate,
			output: Outputs.fieldsUpdate,
		},
		input,
		({ list_id, tag, label, type, fallback }) => ({
			method: 'PUT',
			path: `/lists/${segment(list_id)}/fields/${segment(tag)}`,
			body: { label, tag, type, fallback },
		}),
		{ log: ({ list_id, tag }) => ({ listId: list_id, tag }) },
	);

export const remove: EmailOctopusEndpoints['fieldsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fields.delete',
			input: Inputs.fieldsDelete,
			output: Outputs.fieldsDelete,
		},
		input,
		({ list_id, tag }) => ({
			method: 'DELETE',
			path: `/lists/${segment(list_id)}/fields/${segment(tag)}`,
		}),
		{
			shape: () => ({}),
			log: ({ list_id, tag }) => ({ listId: list_id, tag }),
		},
	);
