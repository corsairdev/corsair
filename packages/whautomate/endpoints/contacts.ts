import { logEventFromContext } from 'corsair/core';
import type { WhautomateHandler } from '../client';
import { makeWhautomateRequest, resolveApiHost } from '../client';

import type {
	WhautomateEndpointInputs,
	WhautomateEndpointOutputs,
} from './types';
import { WhautomateEndpointOutputSchemas } from './types';

export const addContact: WhautomateHandler<
	WhautomateEndpointInputs['addContact'],
	WhautomateEndpointOutputs['addContact']
> = async (ctx, input) => {
	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['addContact']
	>(
		await resolveApiHost(ctx),
		ctx.key,
		'/contacts',
		WhautomateEndpointOutputSchemas.addContact,
		{
			method: 'POST',
			body: input,
		},
	);

	await logEventFromContext(ctx, 'whautomate.contacts.add', {}, 'completed');
	return result;
};

export const getContacts: WhautomateHandler<
	WhautomateEndpointInputs['getContacts'],
	WhautomateEndpointOutputs['getContacts']
> = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page !== undefined) query.page = input.page;
	if (input.limit !== undefined) query.limit = input.limit;
	if (input.search !== undefined) query.search = input.search;
	if (input.segmentId !== undefined) query.segmentId = input.segmentId;

	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['getContacts']
	>(
		await resolveApiHost(ctx),
		ctx.key,
		'/contacts',
		WhautomateEndpointOutputSchemas.getContacts,
		{
			method: 'GET',
			query,
		},
	);

	await logEventFromContext(
		ctx,
		'whautomate.contacts.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const getMessagesOfContact: WhautomateHandler<
	WhautomateEndpointInputs['getMessagesOfContact'],
	WhautomateEndpointOutputs['getMessagesOfContact']
> = async (ctx, input) => {
	const { contactId, ...rest } = input;
	const query: Record<string, string | number | boolean | undefined> = {};
	if (rest.page !== undefined) query.page = rest.page;
	if (rest.limit !== undefined) query.limit = rest.limit;
	if (rest.startDate !== undefined) query.startDate = rest.startDate;
	if (rest.endDate !== undefined) query.endDate = rest.endDate;

	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['getMessagesOfContact']
	>(
		await resolveApiHost(ctx),
		ctx.key,
		`/messages/${contactId}`,
		WhautomateEndpointOutputSchemas.getMessagesOfContact,
		{
			method: 'GET',
			query,
		},
	);

	await logEventFromContext(
		ctx,
		'whautomate.contacts.messages',
		{ ...input },
		'completed',
	);
	return result;
};

export const Contacts = {
	addContact,
	getContacts,
	getMessagesOfContact,
};
