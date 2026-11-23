import { asRecord } from 'corsair/core';
import type { MoosendEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	MoosendEndpointInputSchemas as Inputs,
	MoosendEndpointOutputSchemas as Outputs,
} from './types';

/** Lists a mailing list's subscribers by status, one page at a time. */
export const list: MoosendEndpoints['subscribersList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'subscribers.list',
			input: Inputs.subscribersList,
			output: Outputs.subscribersList,
		},
		input,
		({ mailingListId, status, page, pageSize }) => ({
			replayable: true,
			method: 'GET',
			path: `/lists/${segment(mailingListId)}/subscribers/${segment(status)}.json`,
			query: { page, pageSize },
		}),
		{
			shape: (raw) => {
				const body = asRecord(raw);
				if (!body) {
					throw new Error('Moosend answered no paging context');
				}
				return { ...body };
			},
			log: (_, result) => ({ subscribers: result.subscribers.length }),
		},
	);

/** Finds a subscriber by email address. */
export const getByEmail: MoosendEndpoints['subscribersGetByEmail'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'subscribers.getByEmail',
			input: Inputs.subscribersGetByEmail,
			output: Outputs.subscribersGetByEmail,
		},
		input,
		({ mailingListId, email }) => ({
			replayable: true,
			method: 'GET',
			path: `/subscribers/${segment(mailingListId)}/view.json`,
			query: { email },
		}),
		{
			shape: (raw) => ({ subscriber: raw }),
			log: (_, result) => ({ subscriberId: result.subscriber.id ?? undefined }),
		},
	);

/** Finds a subscriber by its unique id. */
export const getById: MoosendEndpoints['subscribersGetById'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'subscribers.getById',
			input: Inputs.subscribersGetById,
			output: Outputs.subscribersGetById,
		},
		input,
		({ mailingListId, subscriberId }) => ({
			replayable: true,
			method: 'GET',
			path: `/subscribers/${segment(mailingListId)}/find/${segment(subscriberId)}.json`,
		}),
		{
			shape: (raw) => ({ subscriber: raw }),
			log: ({ subscriberId }) => ({ subscriberId }),
		},
	);

/**
 * Adds a subscriber, updating the existing one when the email is already on
 * the list (Moosend performs an upsert).
 */
export const subscribe: MoosendEndpoints['subscribersSubscribe'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'subscribers.subscribe',
			input: Inputs.subscribersSubscribe,
			output: Outputs.subscribersSubscribe,
		},
		input,
		({ mailingListId, email, name, customFields }) => ({
			method: 'POST',
			path: `/subscribers/${segment(mailingListId)}/subscribe.json`,
			// Body keys follow Moosend's request models (lowercase).
			body: { email, name, custom_fields: customFields },
			mediaType: 'application/json',
		}),
		{
			shape: (raw) => ({ subscriber: raw }),
			log: (_, result) => ({ subscriberId: result.subscriber.id ?? undefined }),
		},
	);

/**
 * Adds many subscribers in one call; Moosind skips invalid addresses
 * silently, so the answer reports only what landed.
 */
export const subscribeMany: MoosendEndpoints['subscribersSubscribeMany'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'subscribers.subscribeMany',
				input: Inputs.subscribersSubscribeMany,
				output: Outputs.subscribersSubscribeMany,
			},
			input,
			({ mailingListId, subscribers }) => ({
				method: 'POST',
				path: `/subscribers/${segment(mailingListId)}/subscribe_many.json`,
				body: {
					subscribers: subscribers.map((subscriber) => ({
						email: subscriber.email,
						name: subscriber.name,
						custom_fields: subscriber.customFields,
					})),
				},
				mediaType: 'application/json',
			}),
			{
				log: (parsed) => ({ subscribers: parsed.subscribers.length }),
			},
		);

export const update: MoosendEndpoints['subscribersUpdate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'subscribers.update',
			input: Inputs.subscribersUpdate,
			output: Outputs.subscribersUpdate,
		},
		input,
		({ mailingListId, subscriberId, email, name, customFields }) => ({
			method: 'POST',
			path: `/subscribers/${segment(mailingListId)}/update/${segment(subscriberId)}.json`,
			body: { email, name, custom_fields: customFields },
			mediaType: 'application/json',
		}),
		{
			shape: (raw) => ({ subscriber: raw }),
			log: ({ subscriberId }) => ({ subscriberId }),
		},
	);

/**
 * Unsubscribes an email from one mailing list, moving it to the suppression
 * list. Reversible: subscribe adds it back.
 */
export const unsubscribe: MoosendEndpoints['subscribersUnsubscribe'] = async (
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
		({ mailingListId, email }) => ({
			method: 'POST',
			path: `/subscribers/${segment(mailingListId)}/unsubscribe.json`,
			body: { email },
			mediaType: 'application/json',
		}),
		{
			log: ({ email }) => ({ unsubscribed: true }),
		},
	);

/**
 * Removes a subscriber from the mailing list permanently, without the
 * suppression list. Cannot be undone.
 */
export const remove: MoosendEndpoints['subscribersRemove'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'subscribers.remove',
			input: Inputs.subscribersRemove,
			output: Outputs.subscribersRemove,
		},
		input,
		({ mailingListId, email }) => ({
			method: 'POST',
			path: `/subscribers/${segment(mailingListId)}/remove.json`,
			body: { email },
			mediaType: 'application/json',
		}),
		{
			log: ({ email }) => ({ removed: true }),
		},
	);
