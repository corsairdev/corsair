import { logEventFromContext } from 'corsair/core';
import { makeWhautomateRequest } from '../client';
import type { WhautomateEndpoints } from '../index';
import type { WhautomateEndpointOutputs } from './types';

export const addContact: WhautomateEndpoints['addContact'] = async (
	ctx,
	input,
) => {
	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['addContact']
	>(ctx.options.apiHost!, ctx.key, '/contacts', {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'whautomate.contacts.add',
		{ ...input },
		'completed',
	);
	return result;
};

export const getContacts: WhautomateEndpoints['getContacts'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page) query.page = input.page;
	if (input.limit) query.limit = input.limit;
	if (input.search) query.search = input.search;
	if (input.segmentId) query.segmentId = input.segmentId;

	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['getContacts']
	>(ctx.options.apiHost!, ctx.key, '/contacts', {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'whautomate.contacts.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const getMessagesOfContact: WhautomateEndpoints['getMessagesOfContact'] =
	async (ctx, input) => {
		const { contactId, ...rest } = input;
		const query: Record<string, string | number | boolean | undefined> = {};
		if (rest.page) query.page = rest.page;
		if (rest.limit) query.limit = rest.limit;
		if (rest.startDate) query.startDate = rest.startDate;
		if (rest.endDate) query.endDate = rest.endDate;

		const result = await makeWhautomateRequest<
			WhautomateEndpointOutputs['getMessagesOfContact']
		>(ctx.options.apiHost!, ctx.key, `/contacts/${contactId}/messages`, {
			method: 'GET',
			query,
		});

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
