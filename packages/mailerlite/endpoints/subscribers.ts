import type { MailerLiteEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	MailerLiteEndpointInputSchemas as Inputs,
	MailerLiteEndpointOutputSchemas as Outputs,
} from './types';

export const list: MailerLiteEndpoints['subscribersList'] = (ctx, input) =>
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
			path: '/subscribers',
			query: {
				'filter[status]': parsed.filterStatus,
				'filter[group]': parsed.filterGroup,
				limit: parsed.limit,
				cursor: parsed.cursor,
				sort: parsed.sort,
				include: parsed.include,
			},
			replayable: true,
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				nextCursor: result.meta.next_cursor ?? undefined,
			}),
		},
	);

export const get: MailerLiteEndpoints['subscribersGet'] = (ctx, input) =>
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
			path: `/subscribers/${segment(subscriberId)}`,
			replayable: true,
		}),
		{ log: (_, result) => ({ subscriberId: result.data.id }) },
	);

export const upsert: MailerLiteEndpoints['subscribersUpsert'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subscribers.upsert',
			input: Inputs.subscribersUpsert,
			output: Outputs.subscribersUpsert,
		},
		input,
		({
			email,
			fields,
			groups,
			status,
			subscribed_at,
			ip_address,
			opted_in_at,
			optin_ip,
			unsubscribed_at,
			resubscribe,
			double_optin,
			notes,
		}) => ({
			method: 'POST',
			path: '/subscribers',
			body: {
				email,
				fields,
				groups,
				status,
				subscribed_at,
				ip_address,
				opted_in_at,
				optin_ip,
				unsubscribed_at,
				resubscribe,
				double_optin,
				notes,
			},
			// Upserts on email, so a repeat answers the same subscriber.
			replayable: true,
		}),
		{ log: (_, result) => ({ subscriberId: result.data.id }) },
	);

export const update: MailerLiteEndpoints['subscribersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subscribers.update',
			input: Inputs.subscribersUpdate,
			output: Outputs.subscribersUpdate,
		},
		input,
		({
			subscriberId,
			email,
			fields,
			groups,
			status,
			subscribed_at,
			ip_address,
			opted_in_at,
			optin_ip,
			unsubscribed_at,
		}) => ({
			method: 'PUT',
			path: `/subscribers/${segment(subscriberId)}`,
			body: {
				email,
				fields,
				groups,
				status,
				subscribed_at,
				ip_address,
				opted_in_at,
				optin_ip,
				unsubscribed_at,
			},
			replayable: false,
		}),
		{ log: (_, result) => ({ subscriberId: result.data.id }) },
	);

export const remove: MailerLiteEndpoints['subscribersDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subscribers.delete',
			input: Inputs.subscribersDelete,
			output: Outputs.subscribersDelete,
		},
		input,
		({ subscriberId }) => ({
			method: 'DELETE',
			path: `/subscribers/${segment(subscriberId)}`,
			replayable: false,
		}),
		{
			// The delete answers 204 with no body; the result is derived here.
			shape: (_, { subscriberId }) => ({ deleted: true, id: subscriberId }),
			log: (_, result) => ({ subscriberId: result.id }),
		},
	);

export const addToGroup: MailerLiteEndpoints['subscribersAddToGroup'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'subscribers.addToGroup',
			input: Inputs.subscribersAddToGroup,
			output: Outputs.subscribersAddToGroup,
		},
		input,
		({ subscriberId, groupId }) => ({
			method: 'POST',
			path: `/subscribers/${segment(subscriberId)}/groups/${segment(groupId)}`,
			replayable: false,
		}),
		{ log: (_, result) => ({ subscriberId: result.data.id }) },
	);

export const removeFromGroup: MailerLiteEndpoints['subscribersRemoveFromGroup'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'subscribers.removeFromGroup',
				input: Inputs.subscribersRemoveFromGroup,
				output: Outputs.subscribersRemoveFromGroup,
			},
			input,
			({ subscriberId, groupId }) => ({
				method: 'DELETE',
				path: `/subscribers/${segment(subscriberId)}/groups/${segment(groupId)}`,
				replayable: false,
			}),
			{
				// The unassign answers 204 with no body.
				shape: (_, { subscriberId }) => ({ deleted: true, id: subscriberId }),
				log: (_, result) => ({ subscriberId: result.id }),
			},
		);
