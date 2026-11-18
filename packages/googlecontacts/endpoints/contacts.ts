import { logEventFromContext } from 'corsair/core';
import {
	joinFieldMask,
	makeAuthenticatedPeopleRequest,
	resourcePath,
} from '../client';
import type { GoogleContactsEndpoints } from '../index';
import {
	DEFAULT_PERSON_FIELDS,
	persistContact,
	persistContacts,
} from './persist';
import type { GoogleContactsEndpointOutputs } from './types';
import { GoogleContactsEndpointInputSchemas as Inputs } from './types';

export const list: GoogleContactsEndpoints['contactsList'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.contactsList.parse(rawInput);
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
		{},
		'completed',
	);
	return result;
};

export const get: GoogleContactsEndpoints['contactsGet'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.contactsGet.parse(rawInput);
	const personFields = input.personFields ?? DEFAULT_PERSON_FIELDS;
	const result = await makeAuthenticatedPeopleRequest<
		GoogleContactsEndpointOutputs['contactsGet']
	>(resourcePath('people', input.resourceName), ctx, {
		method: 'GET',
		query: { personFields: joinFieldMask(personFields) },
	});

	await persistContact(ctx, result, personFields);
	await logEventFromContext(
		ctx,
		'googlecontacts.contacts.get',
		{ resourceName: input.resourceName },
		'completed',
	);
	return result;
};

export const search: GoogleContactsEndpoints['contactsSearch'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.contactsSearch.parse(rawInput);
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
		{},
		'completed',
	);
	return result;
};

export const create: GoogleContactsEndpoints['contactsCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.contactsCreate.parse(rawInput);
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
		{ resourceName: result.resourceName },
		'completed',
	);
	return result;
};

export const update: GoogleContactsEndpoints['contactsUpdate'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.contactsUpdate.parse(rawInput);
	const personFields = input.personFields ?? DEFAULT_PERSON_FIELDS;
	const result = await makeAuthenticatedPeopleRequest<
		GoogleContactsEndpointOutputs['contactsUpdate']
	>(`${resourcePath('people', input.resourceName)}:updateContact`, ctx, {
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
		{ resourceName: input.resourceName },
		'completed',
	);
	return result;
};

export const deleteContact: GoogleContactsEndpoints['contactsDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.contactsDelete.parse(rawInput);
	await makeAuthenticatedPeopleRequest<void>(
		`${resourcePath('people', input.resourceName)}:deleteContact`,
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
		{ resourceName: input.resourceName },
		'completed',
	);
};

// A photo change should refresh the stored photoUrl, so the response mask
// always carries photos.
function withPhotos(fields: string[] | undefined): string[] {
	const base = fields ?? DEFAULT_PERSON_FIELDS;
	return base.includes('photos') ? base : [...base, 'photos'];
}

type PhotoMutateResponse = {
	person?: GoogleContactsEndpointOutputs['contactsGet'];
};

export const updatePhoto: GoogleContactsEndpoints['contactsUpdatePhoto'] =
	async (ctx, rawInput) => {
		const input = Inputs.contactsUpdatePhoto.parse(rawInput);
		const personFields = withPhotos(input.personFields);
		// updateContactPhoto takes the mask in the body; deleteContactPhoto
		// takes it in the query.
		const response = await makeAuthenticatedPeopleRequest<PhotoMutateResponse>(
			`${resourcePath('people', input.resourceName)}:updateContactPhoto`,
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
			{ resourceName: input.resourceName },
			'completed',
		);
		return response.person;
	};

export const deletePhoto: GoogleContactsEndpoints['contactsDeletePhoto'] =
	async (ctx, rawInput) => {
		const input = Inputs.contactsDeletePhoto.parse(rawInput);
		const personFields = withPhotos(input.personFields);
		const response = await makeAuthenticatedPeopleRequest<PhotoMutateResponse>(
			`${resourcePath('people', input.resourceName)}:deleteContactPhoto`,
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
			{ resourceName: input.resourceName },
			'completed',
		);
		return response.person;
	};
