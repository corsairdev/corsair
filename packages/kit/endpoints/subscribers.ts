import type { KitEndpoints } from '..';
import { definedQuery, segment } from '../client';
import { call } from './call';
import {
	KitEndpointInputSchemas as Inputs,
	KitEndpointOutputSchemas as Outputs,
} from './types';

/** Kit takes a list as one comma-separated value. */
function joined(values: readonly string[] | undefined): string | undefined {
	return values && values.length > 0 ? values.join(',') : undefined;
}

export const list: KitEndpoints['subscribersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subscribers.list',
			input: Inputs.subscribersList,
			output: Outputs.subscribersList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v4/subscribers',
			query: definedQuery({
				after: parsed.after,
				before: parsed.before,
				per_page: parsed.per_page,
				status: parsed.status,
				email_address: parsed.email_address,
				include: joined(parsed.include),
				include_total_count: parsed.include_total_count,
				slim: parsed.slim,
				sort_field: parsed.sort_field,
				sort_order: parsed.sort_order,
				created_after: parsed.created_after,
				created_before: parsed.created_before,
				updated_after: parsed.updated_after,
				updated_before: parsed.updated_before,
			}),
		}),
		{ log: (_, result) => ({ count: result.subscribers.length }) },
	);

export const get: KitEndpoints['subscribersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subscribers.get',
			input: Inputs.subscribersGet,
			output: Outputs.subscribersGet,
		},
		input,
		({ subscriberId }) => ({
			method: 'GET',
			path: `/v4/subscribers/${segment(subscriberId)}`,
		}),
		{ log: (_, result) => ({ subscriberId: result.subscriber.id }) },
	);

// Creating an address that already exists returns the existing subscriber
// rather than a duplicate, so this is safe to repeat.
export const create: KitEndpoints['subscribersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subscribers.create',
			input: Inputs.subscribersCreate,
			output: Outputs.subscribersCreate,
		},
		input,
		({ email_address, first_name, state, fields }) => ({
			method: 'POST',
			path: '/v4/subscribers',
			body: Object.fromEntries(
				Object.entries({ email_address, first_name, state, fields }).filter(
					([, value]) => value !== undefined,
				),
			),
		}),
		{
			log: (_, result) => ({
				subscriberId: result.subscriber.id,
				state: result.subscriber.state ?? undefined,
				warnings: result.warnings?.length ?? 0,
			}),
		},
	);

export const update: KitEndpoints['subscribersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subscribers.update',
			input: Inputs.subscribersUpdate,
			output: Outputs.subscribersUpdate,
		},
		input,
		({ subscriberId, ...body }) => ({
			method: 'PUT',
			path: `/v4/subscribers/${segment(subscriberId)}`,
			body: Object.fromEntries(
				Object.entries(body).filter(([, value]) => value !== undefined),
			),
		}),
		{ log: ({ subscriberId }) => ({ subscriberId }) },
	);

export const unsubscribe: KitEndpoints['subscribersUnsubscribe'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'subscribers.unsubscribe',
			input: Inputs.subscribersUnsubscribe,
			output: Outputs.subscribersUnsubscribe,
		},
		input,
		({ subscriberId }) => ({
			method: 'POST',
			path: `/v4/subscribers/${segment(subscriberId)}/unsubscribe`,
			body: {},
		}),
		{
			// A 204 carries nothing, so the answer states what was asked for.
			shape: (_, { subscriberId }) => ({
				success: true,
				subscriber_id: subscriberId,
			}),
			log: ({ subscriberId }) => ({ subscriberId }),
		},
	);
