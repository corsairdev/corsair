import type { GatherupEndpoints } from '..';
import { definedQuery, segment } from '../client';
import { call, listShape } from './call';
import {
	GatherupEndpointInputSchemas as Inputs,
	GatherupEndpointOutputSchemas as Outputs,
} from './types';

export const list: GatherupEndpoints['customersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.list',
			input: Inputs.customersList,
			output: Outputs.customersList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/v2/customers/get',
			query: definedQuery({ ...parsed }),
		}),
		{
			shape: (raw, parsed) => listShape(raw, parsed),
			log: (_, result) => ({
				count: result.data.length,
				total: result.count ?? undefined,
			}),
		},
	);

export const get: GatherupEndpoints['customersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.get',
			input: Inputs.customersGet,
			output: Outputs.customersGet,
		},
		input,
		({ businessId, customerId }) => ({
			method: 'GET',
			path: '/api/v2/customer/get',
			query: definedQuery({ businessId, customerId: String(customerId) }),
		}),
		// The answer carries no `id`, so the ID asked for is logged.
		{ log: ({ customerId }) => ({ customerId: String(customerId) }) },
	);

// The create body uses `customer…` names, which is what the route binds.
export const create: GatherupEndpoints['customersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.create',
			input: Inputs.customersCreate,
			output: Outputs.customersCreate,
		},
		input,
		// GatherUp takes `sendFeedbackRequest` as 0 or 1. It is always sent, as 0
		// unless asked for, so creating a customer never messages them by default.
		({ sendFeedbackRequest, ...fields }) => ({
			method: 'POST',
			path: '/api/v2/customer/create',
			body: {
				...Object.fromEntries(
					Object.entries(fields).filter(([, value]) => value !== undefined),
				),
				sendFeedbackRequest: sendFeedbackRequest ? 1 : 0,
			},
		}),
		{
			// The address and phone are personal data, so only the ID is logged.
			log: (_, result) => ({
				customerId:
					result.customerId == null ? undefined : String(result.customerId),
			}),
		},
	);

export const update: GatherupEndpoints['customersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.update',
			input: Inputs.customersUpdate,
			output: Outputs.customersUpdate,
		},
		input,
		({ businessId, customerId, ...changes }) => ({
			method: 'PUT',
			path: '/api/v2/customer/update',
			body: {
				businessId,
				customerId,
				...Object.fromEntries(
					Object.entries(changes).filter(([, value]) => value !== undefined),
				),
			},
		}),
		{ log: ({ customerId }) => ({ customerId: String(customerId) }) },
	);

export const remove: GatherupEndpoints['customersRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.delete',
			input: Inputs.customersRemove,
			output: Outputs.customersRemove,
		},
		input,
		({ businessId, customerId }) => ({
			method: 'DELETE',
			path: '/api/v2/customer/delete',
			body: { businessId, customerId },
		}),
		{ log: ({ customerId }) => ({ customerId: String(customerId) }) },
	);

export const requestFeedback: GatherupEndpoints['feedbackRequest'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customers.requestFeedback',
			input: Inputs.feedbackRequest,
			output: Outputs.feedbackRequest,
		},
		input,
		// GatherUp defaults `ratingRevision` to 1, a revision of an earlier rating,
		// so a new request is asked for explicitly unless a revision was wanted.
		({ customerId, ratingRevision }) => ({
			method: 'POST',
			path: '/api/v2/customer/feedback/send',
			body: { customerId, ratingRevision: ratingRevision ? 1 : 0 },
		}),
		{ log: ({ customerId }) => ({ customerId: String(customerId) }) },
	);

export const feedbacks: GatherupEndpoints['feedbacksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'feedbacks.list',
			input: Inputs.feedbacksList,
			output: Outputs.feedbacksList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/v2/feedbacks/get',
			query: definedQuery({ ...parsed }),
		}),
		{
			shape: (raw, parsed) => listShape(raw, parsed),
			// A feedback carries what a reviewer wrote, so only counts are logged.
			log: (_, result) => ({
				count: result.data.length,
				total: result.count ?? undefined,
			}),
		},
	);

/** Encodes a customer ID into one path segment, when a route needs one. */
export function customerSegment(id: string | number): string {
	return segment(id);
}
