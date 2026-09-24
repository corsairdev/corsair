import { logEventFromContext } from 'corsair/core';
import { joinFieldMask, makeAuthenticatedPeopleRequest } from '../client';
import type { GoogleContactsEndpoints } from '../index';
import {
	DEFAULT_PERSON_FIELDS,
	persistContact,
	persistContacts,
} from './persist';
import type { GoogleContactsEndpointOutputs } from './types';

export const list: GoogleContactsEndpoints['contactsList'] = async (
	ctx,
	input,
) => {
	const personFields = input.personFields ?? DEFAULT_PERSON_FIELDS;
	const result = await makeAuthenticatedPeopleRequest<
		GoogleContactsEndpointOutputs['contactsList']
	>('/people/me/connections', ctx, {
		method: 'GET',
		query: {
			personFields: joinFieldMask(personFields),
			pageSize: input.pageSize,
			pageToken: input.pageToken,
			sortOrder: input.sortOrder,
			requestSyncToken: input.requestSyncToken,
			syncToken: input.syncToken,
		},
	});

	await persistContacts(ctx, result.connections, personFields);
	await logEventFromContext(
		ctx,
		'googlecontacts.contacts.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GoogleContactsEndpoints['contactsGet'] = async (
	ctx,
	input,
) => {
	const personFields = input.personFields ?? DEFAULT_PERSON_FIELDS;
	const result = await makeAuthenticatedPeopleRequest<
		GoogleContactsEndpointOutputs['contactsGet']
	>(`/${input.resourceName}`, ctx, {
		method: 'GET',
		query: { personFields: joinFieldMask(personFields) },
	});

	await persistContact(ctx, result, personFields);
	await logEventFromContext(
		ctx,
		'googlecontacts.contacts.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const search: GoogleContactsEndpoints['contactsSearch'] = async (
	ctx,
	input,
) => {
	const readMask = input.readMask ?? DEFAULT_PERSON_FIELDS;
	const result = await makeAuthenticatedPeopleRequest<
		GoogleContactsEndpointOutputs['contactsSearch']
	>('/people:searchContacts', ctx, {
		method: 'GET',
		query: {
			query: input.query,
			readMask: joinFieldMask(readMask),
			pageSize: input.pageSize,
		},
	});

	await persistContacts(
		ctx,
		result.results
			?.map((r) => r.person)
			.filter((p): p is NonNullable<typeof p> => !!p),
		readMask,
	);
	await logEventFromContext(
		ctx,
		'googlecontacts.contacts.search',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: GoogleContactsEndpoints['contactsCreate'] = async (
	ctx,
	input,
) => {
	const personFields = input.personFields ?? DEFAULT_PERSON_FIELDS;
	const result = await makeAuthenticatedPeopleRequest<
		GoogleContactsEndpointOutputs['contactsCreate']
	>('/people:createContact', ctx, {
		method: 'POST',
		body: { ...input.person },
		query: { personFields: joinFieldMask(personFields) },
	});

	await persistContact(ctx, result, personFields);
	await logEventFromContext(
		ctx,
		'googlecontacts.contacts.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: GoogleContactsEndpoints['contactsUpdate'] = async (
	ctx,
	input,
) => {
	const personFields = input.personFields ?? DEFAULT_PERSON_FIELDS;
	const result = await makeAuthenticatedPeopleRequest<
		GoogleContactsEndpointOutputs['contactsUpdate']
	>(`/${input.resourceName}:updateContact`, ctx, {
		method: 'PATCH',
		body: { etag: input.etag, ...input.person },
		query: {
			updatePersonFields: joinFieldMask(input.updatePersonFields),
			personFields: joinFieldMask(personFields),
		},
	});

	await persistContact(ctx, result, personFields);
	await logEventFromContext(
		ctx,
		'googlecontacts.contacts.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteContact: GoogleContactsEndpoints['contactsDelete'] = async (
	ctx,
	input,
) => {
	await makeAuthenticatedPeopleRequest<void>(
		`/${input.resourceName}:deleteContact`,
		ctx,
		{ method: 'DELETE' },
	);

	if (ctx.db.contacts) {
		try {
			await ctx.db.contacts.deleteByEntityId(input.resourceName);
		} catch (error) {
			console.warn('Failed to delete contact from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlecontacts.contacts.delete',
		{ ...input },
		'completed',
	);
};

type PhotoMutateResponse = {
	person?: GoogleContactsEndpointOutputs['contactsGet'];
};

export const updatePhoto: GoogleContactsEndpoints['contactsUpdatePhoto'] =
	async (ctx, input) => {
		const personFields = input.personFields ?? DEFAULT_PERSON_FIELDS;
		// updateContactPhoto takes the mask in the body; deleteContactPhoto
		// takes it in the query.
		const response = await makeAuthenticatedPeopleRequest<PhotoMutateResponse>(
			`/${input.resourceName}:updateContactPhoto`,
			ctx,
			{
				method: 'PATCH',
				body: {
					photoBytes: input.photoBytes,
					personFields: joinFieldMask(personFields),
				},
			},
		);

		if (!response.person) {
			throw new Error(
				'updateContactPhoto returned no person; check the personFields mask',
			);
		}

		await persistContact(ctx, response.person, personFields);
		await logEventFromContext(
			ctx,
			'googlecontacts.contacts.updatePhoto',
			{ ...input, photoBytes: '[redacted]' },
			'completed',
		);
		return response.person;
	};

export const deletePhoto: GoogleContactsEndpoints['contactsDeletePhoto'] =
	async (ctx, input) => {
		const personFields = input.personFields ?? DEFAULT_PERSON_FIELDS;
		const response = await makeAuthenticatedPeopleRequest<PhotoMutateResponse>(
			`/${input.resourceName}:deleteContactPhoto`,
			ctx,
			{
				method: 'DELETE',
				query: { personFields: joinFieldMask(personFields) },
			},
		);

		if (!response.person) {
			throw new Error(
				'deleteContactPhoto returned no person; check the personFields mask',
			);
		}

		await persistContact(ctx, response.person, personFields);
		await logEventFromContext(
			ctx,
			'googlecontacts.contacts.deletePhoto',
			{ ...input },
			'completed',
		);
		return response.person;
	};
