import type { SimpleroEndpoints } from '..';
import { segment } from '../client';
import type { UnknownJson } from '../json';
import { call, compact, dataId, without } from './shared';
import {
	SimpleroEndpointInputSchemas as Inputs,
	SimpleroEndpointOutputSchemas as Outputs,
} from './types';

export const list: SimpleroEndpoints['customersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.list',
			input: Inputs.customersList,
			output: Outputs.customersList,
		},
		input,
		(query) => ({ method: 'GET', path: '/api/v2/customers', query }),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: SimpleroEndpoints['customersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.get',
			input: Inputs.customersGet,
			output: Outputs.customersGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/api/v2/customers/${segment(id)}` }),
		{ log: ({ id }) => ({ customerId: id }) },
	);

export const create: SimpleroEndpoints['customersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.create',
			input: Inputs.customersCreate,
			output: Outputs.customersCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/api/v2/customers', body }),
		{ log: (_, result) => ({ customerId: dataId(result) }) },
	);

export const update: SimpleroEndpoints['customersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.update',
			input: Inputs.customersUpdate,
			output: Outputs.customersUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/api/v2/customers/${segment(parsed.id)}`,
			body: compact(without(parsed)),
		}),
		{ log: ({ id }) => ({ customerId: id }) },
	);

/** Add and remove share a route shape and a `{ success, message }` body. */
function tagAction(
	ctx: Parameters<SimpleroEndpoints['customersAddTag']>[0],
	action: 'add_tag' | 'remove_tag',
	input: UnknownJson, // unknown: raw caller input, parsed by call()
) {
	return call(
		ctx,
		{
			event: `customers.${action === 'add_tag' ? 'addTag' : 'removeTag'}`,
			input: Inputs.customersAddTag,
			output: Outputs.customersAddTag,
		},
		input,
		({ id, tag_id, tag_ids }) => ({
			method: 'POST',
			path: `/api/v2/customers/${segment(id)}/actions/${action}`,
			body: tag_id !== undefined ? { tag_id } : { tag_ids },
		}),
		{
			log: ({ id, tag_id, tag_ids }) => ({
				customerId: id,
				tags: tag_ids?.length ?? (tag_id !== undefined ? 1 : 0),
			}),
		},
	);
}

export const addTag: SimpleroEndpoints['customersAddTag'] = (ctx, input) =>
	tagAction(ctx, 'add_tag', input);

export const removeTag: SimpleroEndpoints['customersRemoveTag'] = (
	ctx,
	input,
) => tagAction(ctx, 'remove_tag', input);

/**
 * This action adds to the score and records the change in the customer's
 * history. `customers.update` replaces the score instead, so the two are not
 * interchangeable.
 */
export const adjustLeadScore: SimpleroEndpoints['customersAdjustLeadScore'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customers.adjustLeadScore',
			input: Inputs.customersAdjustLeadScore,
			output: Outputs.customersAdjustLeadScore,
		},
		input,
		// The spec's body is `{ amount, explanation }`.
		({ id, amount, explanation }) => ({
			method: 'POST',
			path: `/api/v2/customers/${segment(id)}/actions/adjust_lead_score`,
			body: { amount, explanation },
		}),
		// The score change is customer data, so only the id is logged.
		{ log: ({ id }) => ({ customerId: id }) },
	);
