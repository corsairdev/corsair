import { asRecord } from 'corsair/core';
import type { EventbriteEndpoints } from '..';
import { segment } from '../client';
import { call, commaList } from './call';
import {
	EventbriteEndpointInputSchemas as Inputs,
	EventbriteEndpointOutputSchemas as Outputs,
} from './types';

export const get: EventbriteEndpoints['discountGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'discounts.get',
			input: Inputs.discountGet,
			output: Outputs.discountGet,
		},
		input,
		({ discount_id }) => ({
			method: 'GET',
			path: `/discounts/${segment(discount_id)}/`,
		}),
		{
			// Codes are bearer secrets at checkout; log the id only.
			log: ({ discount_id }) => ({ discountId: discount_id }),
		},
	);

export const create: EventbriteEndpoints['discountCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'discounts.create',
			input: Inputs.discountCreate,
			output: Outputs.discountCreate,
		},
		input,
		({ organization_id, discount }) => ({
			method: 'POST',
			path: `/organizations/${segment(organization_id)}/discounts/`,
			body: { discount },
		}),
		{
			log: ({ organization_id }, result) => ({
				organizationId: organization_id,
				discountId: result.id ?? undefined,
				type: result.type ?? undefined,
			}),
		},
	);

export const update: EventbriteEndpoints['discountUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'discounts.update',
			input: Inputs.discountUpdate,
			output: Outputs.discountUpdate,
		},
		input,
		({ discount_id, discount }) => ({
			method: 'POST',
			path: `/discounts/${segment(discount_id)}/`,
			body: { discount },
		}),
		{
			log: ({ discount_id }) => ({ discountId: discount_id }),
		},
	);

/**
 * `scope` is required, and `event` scope also needs `event_id`; Eventbrite
 * rejects `event_id` with `multi_events` scope. Both rules live in the input
 * schema so no request is spent on a documented 400.
 */
export const list: EventbriteEndpoints['discountsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'discounts.list',
			input: Inputs.discountsList,
			output: Outputs.discountsList,
		},
		input,
		({
			organization_id,
			scope,
			event_id,
			code_filter,
			code,
			type,
			ticket_group_id,
			hold_ids,
			order_by,
			page_size,
			continuation,
			page,
		}) => ({
			method: 'GET',
			path: `/organizations/${segment(organization_id)}/discounts/`,
			query: {
				scope,
				event_id,
				code_filter,
				code,
				type,
				ticket_group_id,
				hold_ids: commaList(hold_ids),
				order_by,
				page_size,
				continuation,
				page,
			},
		}),
		{
			log: ({ organization_id, scope }, result) => ({
				organizationId: organization_id,
				scope,
				count: result.discounts.length,
			}),
		},
	);

export const remove: EventbriteEndpoints['discountDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'discounts.delete',
			input: Inputs.discountDelete,
			output: Outputs.discountDelete,
		},
		input,
		({ discount_id }) => ({
			method: 'DELETE',
			path: `/discounts/${segment(discount_id)}/`,
		}),
		{
			// This route answers with the deleted discount itself, not
			// `{ deleted: true }`; the flag is derived so callers read one shape.
			shape: (raw) => ({ deleted: asRecord(raw) !== null, discount: raw }),
			log: ({ discount_id }) => ({ discountId: discount_id }),
		},
	);
