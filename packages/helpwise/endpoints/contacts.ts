import { logEventFromContext } from 'corsair/core';
import type { HelpwiseEndpoint } from '..';
import { makeHelpwiseRequest } from '../client';
import type {
	ContactsCreateResponse,
	ContactsGetResponse,
	ContactsListResponse,
	ContactsSearchResponse,
	ContactsUpdateResponse,
} from './types';
import {
	HelpwiseEndpointInputSchemas,
	HelpwiseEndpointOutputSchemas,
} from './types';

export const list: HelpwiseEndpoint<'contacts.list'> = async (ctx, input) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['contacts.list'].parse(input);

	const query: Record<string, string | number | undefined> = {};
	if (parsedInput.limit !== undefined) query.limit = parsedInput.limit;
	if (parsedInput.offset !== undefined) query.offset = parsedInput.offset;

	const response = await makeHelpwiseRequest<ContactsListResponse>(
		'/contacts',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);
	const parsed = HelpwiseEndpointOutputSchemas['contacts.list'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.contacts.list',
		{ count: parsed.results?.length ?? 0 },
		'completed',
	);
	return parsed;
};

export const get: HelpwiseEndpoint<'contacts.get'> = async (ctx, input) => {
	const parsedInput = HelpwiseEndpointInputSchemas['contacts.get'].parse(input);
	const response = await makeHelpwiseRequest<ContactsGetResponse>(
		`/contacts/${encodeURIComponent(parsedInput.contactId)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed = HelpwiseEndpointOutputSchemas['contacts.get'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.contacts.get',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const create: HelpwiseEndpoint<'contacts.create'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['contacts.create'].parse(input);
	const response = await makeHelpwiseRequest<ContactsCreateResponse>(
		'/contacts',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['contacts.create'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.contacts.create',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const update: HelpwiseEndpoint<'contacts.update'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['contacts.update'].parse(input);
	const { contactId, ...body } = parsedInput;

	const response = await makeHelpwiseRequest<ContactsUpdateResponse>(
		`/contacts/${encodeURIComponent(contactId)}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['contacts.update'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.contacts.update',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const search: HelpwiseEndpoint<'contacts.search'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['contacts.search'].parse(input);

	const query: Record<string, string | number | undefined> = {
		term: parsedInput.term,
	};
	if (parsedInput.limit !== undefined) query.limit = parsedInput.limit;
	if (parsedInput.offset !== undefined) query.offset = parsedInput.offset;

	const response = await makeHelpwiseRequest<ContactsSearchResponse>(
		'/contacts/search',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['contacts.search'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.contacts.search',
		{ count: (parsed.result ?? parsed.results)?.length ?? 0 },
		'completed',
	);
	return parsed;
};
