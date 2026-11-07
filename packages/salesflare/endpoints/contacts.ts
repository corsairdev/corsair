import { logEventFromContext } from 'corsair/core';
import type { SalesflareEndpoints } from '..';
import { makeSalesflareRequest } from '../client';
import { salesflarePathParameter } from './path';
import type { SalesflareEndpointOutputs } from './types';

export const listContacts: SalesflareEndpoints['listContacts'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['listContacts']
	>(ctx, '/contacts', { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'salesflare.contacts.listContacts',
		input,
		'completed',
	);
	return response;
};

export const createContact: SalesflareEndpoints['createContact'] = async (
	ctx,
	input,
) => {
	const { force, ...body } = input;
	const query = { force };
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['createContact']
	>(ctx, '/contacts', { method: 'POST', query: query, body: body });
	await logEventFromContext(
		ctx,
		'salesflare.contacts.createContact',
		input,
		'completed',
	);
	return response;
};

export const retrieveContact: SalesflareEndpoints['retrieveContact'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['retrieveContact']
	>(
		ctx,
		salesflarePathParameter(
			'/contacts/{contact_id}',
			'contact_id',
			input.contactId,
		),
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'salesflare.contacts.retrieveContact',
		input,
		'completed',
	);
	return response;
};

export const updateContact: SalesflareEndpoints['updateContact'] = async (
	ctx,
	input,
) => {
	const { contactId, force, ...body } = input;
	const query = { force };
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['updateContact']
	>(
		ctx,
		salesflarePathParameter(
			'/contacts/{contact_id}',
			'contact_id',
			input.contactId,
		),
		{ method: 'PUT', query: query, body: body },
	);
	await logEventFromContext(
		ctx,
		'salesflare.contacts.updateContact',
		input,
		'completed',
	);
	return response;
};

export const deleteContact: SalesflareEndpoints['deleteContact'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['deleteContact']
	>(
		ctx,
		salesflarePathParameter(
			'/contacts/{contact_id}',
			'contact_id',
			input.contactId,
		),
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'salesflare.contacts.deleteContact',
		input,
		'completed',
	);
	return response;
};
