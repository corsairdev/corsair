import type { RetentlyEndpoints } from '..';
import { segment } from '../client';
import { attributesQuery, call } from './call';
import type { CustomersUpsertResponse } from './types';
import {
	RetentlyEndpointInputSchemas as Inputs,
	RetentlyEndpointOutputSchemas as Outputs,
} from './types';

export const list: RetentlyEndpoints['customersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.list',
			input: Inputs.customersList,
			output: Outputs.customersList,
		},
		input,
		({ email, page, limit, sort, startDate, endDate, attributes, match }) => ({
			method: 'GET',
			path: '/customers',
			query: {
				email,
				page,
				limit,
				sort,
				startDate,
				endDate,
				match,
				...attributesQuery(attributes),
			},
			replayable: true,
		}),
		{
			log: (_, result) => ({
				count: result.data?.subscribers?.length ?? 0,
				total: result.data?.total ?? undefined,
			}),
		},
	);

export const get: RetentlyEndpoints['customersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.get',
			input: Inputs.customersGet,
			output: Outputs.customersGet,
		},
		input,
		({ customerId }) => ({
			method: 'GET',
			path: `/customers/${segment(customerId)}`,
			replayable: true,
		}),
		{
			log: (_, result) => ({ found: Boolean(result.data?.id) }),
		},
	);

/** Counts the customers in either upsert answer shape. */
function upsertedCount(data: CustomersUpsertResponse['data']): number {
	if (!data) return 0;
	if (Array.isArray(data.subscribers)) return data.subscribers.length;
	return Object.keys(data).length;
}

export const upsert: RetentlyEndpoints['customersUpsert'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.upsert',
			input: Inputs.customersUpsert,
			output: Outputs.customersUpsert,
		},
		input,
		({ subscribers }) => ({
			method: 'POST',
			path: '/customers',
			body: { subscribers },
			// An upsert is idempotent, but the same batch is not resent: a retry
			// would create a second copy of every new customer.
			replayable: false,
		}),
		{
			log: (parsed, result) => ({
				sent: parsed.subscribers.length,
				returned: upsertedCount(result.data),
			}),
		},
	);

export const unsubscribe: RetentlyEndpoints['customersUnsubscribe'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customers.unsubscribe',
			input: Inputs.customersUnsubscribe,
			output: Outputs.customersUnsubscribe,
		},
		input,
		({ subscribers, message }) => ({
			method: 'POST',
			path: '/customers/unsubscribe',
			body: message === undefined ? { subscribers } : { subscribers, message },
			// Unsubscribing twice leaves the customer unsubscribed, so a retry is
			// safe.
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				requested: parsed.subscribers.length,
				unsubscribed:
					result.data?.filter((entry) => entry.unsubscribed === true).length ??
					0,
			}),
		},
	);

export const resubscribe: RetentlyEndpoints['customersResubscribe'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customers.resubscribe',
			input: Inputs.customersResubscribe,
			output: Outputs.customersResubscribe,
		},
		input,
		({ subscribers }) => ({
			method: 'POST',
			path: '/customers/resubscribe',
			body: { subscribers },
			// Documented as idempotent: an already-subscribed contact answers
			// already_subscribed rather than failing.
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				requested: parsed.subscribers.length,
				resubscribed:
					result.data?.filter((entry) => entry.status === 'resubscribed')
						.length ?? 0,
				skipped:
					result.data?.filter((entry) => entry.status === 'skipped').length ??
					0,
				notFound:
					result.data?.filter((entry) => entry.status === 'not_found').length ??
					0,
			}),
		},
	);

export const remove: RetentlyEndpoints['customersDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.delete',
			input: Inputs.customersDelete,
			output: Outputs.customersDelete,
		},
		input,
		({ subscribers }) => ({
			method: 'DELETE',
			path: '/customers',
			body: { subscribers },
			// The second call finds nothing left to delete and answers deleted
			// false, so a retry cannot destroy anything new.
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				requested: parsed.subscribers.length,
				deleted:
					result.data?.filter((entry) => entry.deleted === true).length ?? 0,
			}),
		},
	);
