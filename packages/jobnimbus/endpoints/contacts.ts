import { logEventFromContext } from 'corsair/core';
import type { JobNimbusEndpoints } from '..';
import { compactQuery, makeJobNimbusRequest } from '../client';
import {
	JobNimbusEndpointInputSchemas,
	JobNimbusEndpointOutputSchemas,
} from './types';

export const contactsCreate: JobNimbusEndpoints['contactsCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.contactsCreate.parse(input);

	const response = await makeJobNimbusRequest<unknown>('/contacts', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.contactsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.contacts.create',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const contactsUpdate: JobNimbusEndpoints['contactsUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.contactsUpdate.parse(input);
	const { jnid, ...body } = parsedInput;

	const response = await makeJobNimbusRequest<unknown>(
		`/contacts/${encodeURIComponent(jnid)}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.contactsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.contacts.update',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const contactsDelete: JobNimbusEndpoints['contactsDelete'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.contactsDelete.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		`/contacts/${encodeURIComponent(parsedInput.jnid)}`,
		ctx.key,
		{
			method: 'PUT',
			body: { is_active: false },
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.contactsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.contacts.delete',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const contactsGet: JobNimbusEndpoints['contactsGet'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.contactsGet.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		`/contacts/${encodeURIComponent(parsedInput.jnid)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.contactsGet.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.contacts.get',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const contactsList: JobNimbusEndpoints['contactsList'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.contactsList.parse(input);

	const response = await makeJobNimbusRequest<unknown>('/contacts', ctx.key, {
		method: 'GET',
		query: compactQuery({
			size: parsedInput.size,
			from: parsedInput.from,
			sort_field: parsedInput.sort,
			sort_direction: parsedInput.direction,
			actor: parsedInput.actor,
		}),
	});

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.contactsList.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.contacts.list',
		{ count: parsed.results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const Contacts = {
	create: contactsCreate,
	update: contactsUpdate,
	delete: contactsDelete,
	get: contactsGet,
	list: contactsList,
};
