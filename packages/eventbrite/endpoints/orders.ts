import type { EventbriteEndpoints } from '..';
import { segment } from '../client';
import { call, commaList } from './call';
import {
	EventbriteEndpointInputSchemas as Inputs,
	EventbriteEndpointOutputSchemas as Outputs,
} from './types';

export const get: EventbriteEndpoints['ordersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'orders.get',
			input: Inputs.ordersGet,
			output: Outputs.ordersGet,
		},
		input,
		({ order_id }) => ({
			method: 'GET',
			path: `/orders/${segment(order_id)}/`,
		}),
		{
			// Order bodies carry the buyer's name, email and cost breakdown.
			log: ({ order_id }) => ({ orderId: order_id }),
		},
	);

export const listByOrganization: EventbriteEndpoints['ordersListByOrganization'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'orders.listByOrganization',
				input: Inputs.ordersListByOrganization,
				output: Outputs.ordersListByOrganization,
			},
			input,
			({
				organization_id,
				status,
				changed_since,
				only_emails,
				exclude_emails,
				page_size,
				continuation,
				page,
			}) => ({
				method: 'GET',
				path: `/organizations/${segment(organization_id)}/orders/`,
				query: {
					status,
					changed_since,
					only_emails: commaList(only_emails),
					exclude_emails: commaList(exclude_emails),
					page_size,
					continuation,
					page,
				},
			}),
			{
				log: ({ organization_id, status }, result) => ({
					organizationId: organization_id,
					status,
					count: result.orders.length,
				}),
			},
		);

export const listByEvent: EventbriteEndpoints['ordersListByEvent'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'orders.listByEvent',
			input: Inputs.ordersListByEvent,
			output: Outputs.ordersListByEvent,
		},
		input,
		({
			event_id,
			status,
			changed_since,
			last_item_seen,
			only_emails,
			exclude_emails,
			refund_request_statuses,
			page_size,
			continuation,
			page,
		}) => ({
			method: 'GET',
			path: `/events/${segment(event_id)}/orders/`,
			query: {
				status,
				changed_since,
				last_item_seen,
				only_emails: commaList(only_emails),
				exclude_emails: commaList(exclude_emails),
				refund_request_statuses: commaList(refund_request_statuses),
				page_size,
				continuation,
				page,
			},
		}),
		{
			log: ({ event_id, status }, result) => ({
				eventId: event_id,
				status,
				count: result.orders.length,
			}),
		},
	);

export const listByUser: EventbriteEndpoints['ordersListByUser'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'orders.listByUser',
			input: Inputs.ordersListByUser,
			output: Outputs.ordersListByUser,
		},
		input,
		({ user_id, page_size, continuation, page }) => ({
			method: 'GET',
			path: `/users/${segment(user_id)}/orders/`,
			query: { page_size, continuation, page },
		}),
		{
			log: ({ user_id }, result) => ({
				userId: user_id,
				count: result.orders.length,
			}),
		},
	);
