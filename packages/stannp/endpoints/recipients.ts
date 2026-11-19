import type { StannpEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	StannpEndpointInputSchemas as Inputs,
	StannpEndpointOutputSchemas as Outputs,
} from './types';

export const list: StannpEndpoints['recipientsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'recipients.list',
			input: Inputs.recipientsList,
			output: Outputs.recipientsList,
		},
		input,
		({ group_id, offset, limit }, base) => ({
			method: 'GET',
			base,
			path: '/v1/recipients/list',
			query: { group_id, offset, limit },
		}),
		{
			log: (_, result) => ({ count: result.length }),
		},
	);

export const get: StannpEndpoints['recipientsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'recipients.get',
			input: Inputs.recipientsGet,
			output: Outputs.recipientsGet,
		},
		input,
		({ id }, base) => ({
			method: 'GET',
			base,
			path: `/v1/recipients/get/${segment(id)}`,
		}),
		{
			// Names and addresses stay out of the log; the id identifies the row.
			log: (_, result) => ({ id: result.id ?? undefined }),
		},
	);

export const create: StannpEndpoints['recipientsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'recipients.create',
			input: Inputs.recipientsCreate,
			output: Outputs.recipientsCreate,
		},
		input,
		(
			{
				group_id,
				title,
				firstname,
				lastname,
				company,
				job_title,
				address1,
				address2,
				address3,
				city,
				county,
				postcode,
				zipcode,
				country,
				email,
				phone_number,
				ref_id,
				on_duplicate,
				test_level,
				customFields,
				idempotencyKey,
			},
			base,
		) => ({
			method: 'POST',
			base,
			path: '/v1/recipients/new',
			form: {
				group_id,
				title,
				firstname,
				lastname,
				company,
				job_title,
				address1,
				address2,
				address3,
				city,
				county,
				postcode,
				zipcode,
				country,
				email,
				phone_number,
				ref_id,
				on_duplicate,
				test_level,
				...customFields,
			},
			idempotencyKey,
		}),
		{
			log: (_, result) => ({
				id: result.id ?? undefined,
				valid: result.valid ?? undefined,
			}),
		},
	);

// `delete` is a reserved word, so the function is named remove and the
// nested map registers it under the delete key.
export const remove: StannpEndpoints['recipientsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'recipients.delete',
			input: Inputs.recipientsDelete,
			output: Outputs.recipientsDelete,
		},
		input,
		({ id }, base) => ({
			method: 'POST',
			base,
			path: '/v1/recipients/delete',
			form: { id },
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

export const importFile: StannpEndpoints['recipientsImport'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'recipients.import',
			input: Inputs.recipientsImport,
			output: Outputs.recipientsImport,
		},
		input,
		(
			{ file, group_id, duplicates, no_headings, mappings, idempotencyKey },
			base,
		) => ({
			method: 'POST',
			base,
			path: '/v1/recipients/import',
			form: { file, group_id, duplicates, no_headings, mappings },
			idempotencyKey,
		}),
		{
			log: ({ group_id }, result) => ({ groupId: group_id, batch: result }),
		},
	);
