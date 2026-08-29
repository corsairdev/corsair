import { logEventFromContext } from 'corsair/core';
import { makeSynthflowAiRequest } from '../client';
import type { SynthflowAiEndpoints } from '../index';
import type { SynthflowAiEndpointOutputs } from './types';

export const create: SynthflowAiEndpoints['contactsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['contactsCreate']
	>('contacts', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'synthflowai.contacts.create',
		{ name: input.name, phone_number: input.phone_number },
		'completed',
	);

	return response;
};

export const list: SynthflowAiEndpoints['contactsList'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.limit !== undefined) query.limit = input.limit;
	if (input?.offset !== undefined) query.offset = input.offset;
	if (input?.search !== undefined) query.search = input.search;

	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['contactsList']
	>('contacts', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'synthflowai.contacts.list',
		input ? { limit: input.limit, offset: input.offset } : {},
		'completed',
	);

	return response;
};

export const get: SynthflowAiEndpoints['contactsGet'] = async (ctx, input) => {
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['contactsGet']
	>(`contacts/${input.contact_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'synthflowai.contacts.get',
		{ contact_id: input.contact_id },
		'completed',
	);

	return response;
};

export const update: SynthflowAiEndpoints['contactsUpdate'] = async (
	ctx,
	input,
) => {
	const { contact_id, ...body } = input;
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['contactsUpdate']
	>(`contacts/${contact_id}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	await logEventFromContext(
		ctx,
		'synthflowai.contacts.update',
		{ contact_id },
		'completed',
	);

	return response;
};

export const deleteContact: SynthflowAiEndpoints['contactsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['contactsDelete']
	>(`contacts/${input.contact_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'synthflowai.contacts.delete',
		{ contact_id: input.contact_id },
		'completed',
	);

	return response;
};
