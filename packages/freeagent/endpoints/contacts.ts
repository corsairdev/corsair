import { logEventFromContext } from 'corsair/core';
import type { FreeAgentEndpoints } from '..';
import { makeFreeAgentPaginatedRequest, makeFreeAgentRequest } from '../client';
import {
	FreeAgentEndpointInputSchemas,
	FreeAgentEndpointOutputSchemas,
} from './types';

export const list: FreeAgentEndpoints['contactsList'] = async (ctx, input) => {
	const parsed = FreeAgentEndpointInputSchemas.contactsList.parse(input);
	const response = await makeFreeAgentPaginatedRequest(
		'/v2/contacts',
		ctx.key,
		parsed.query ?? {},
		FreeAgentEndpointOutputSchemas.contactsList.omit({ pagination: true }),
	);
	const output = FreeAgentEndpointOutputSchemas.contactsList.parse({
		...response.data,
		pagination: response.pagination,
	});
	await logEventFromContext(
		ctx,
		'freeagent.contacts.list',
		{ count: output.contacts.length },
		'completed',
	);
	return output;
};

export const get: FreeAgentEndpoints['contactsGet'] = async (ctx, input) => {
	const parsed = FreeAgentEndpointInputSchemas.contactsGet.parse(input);
	const response = await makeFreeAgentRequest(
		`/v2/contacts/${encodeURIComponent(parsed.id)}`,
		ctx.key,
	);
	return FreeAgentEndpointOutputSchemas.contactsGet.parse(response);
};

export const create: FreeAgentEndpoints['contactsCreate'] = async (
	ctx,
	input,
) => {
	const parsed = FreeAgentEndpointInputSchemas.contactsCreate.parse(input);
	const response = await makeFreeAgentRequest('/v2/contacts', ctx.key, {
		method: 'POST',
		body: { contact: parsed.contact },
	});
	return FreeAgentEndpointOutputSchemas.contactsCreate.parse(response);
};

export const update: FreeAgentEndpoints['contactsUpdate'] = async (
	ctx,
	input,
) => {
	const parsed = FreeAgentEndpointInputSchemas.contactsUpdate.parse(input);
	const response = await makeFreeAgentRequest(
		`/v2/contacts/${encodeURIComponent(parsed.id)}`,
		ctx.key,
		{ method: 'PUT', body: { contact: parsed.contact } },
	);
	return FreeAgentEndpointOutputSchemas.contactsUpdate.parse(response);
};

export const remove: FreeAgentEndpoints['contactsDelete'] = async (
	ctx,
	input,
) => {
	const parsed = FreeAgentEndpointInputSchemas.contactsDelete.parse(input);
	const response = await makeFreeAgentRequest(
		`/v2/contacts/${encodeURIComponent(parsed.id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	return FreeAgentEndpointOutputSchemas.contactsDelete.parse(response);
};
