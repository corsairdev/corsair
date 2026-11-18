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

/** Google serves only these fields for other contacts. */
const DEFAULT_OTHER_CONTACT_FIELDS = [
	'names',
	'emailAddresses',
	'phoneNumbers',
];

export const list: GoogleContactsEndpoints['otherContactsList'] = async (
	ctx,
	input,
) => {
	const readMask = input.readMask ?? DEFAULT_OTHER_CONTACT_FIELDS;
	const result = await makeAuthenticatedPeopleRequest<
		GoogleContactsEndpointOutputs['otherContactsList']
	>('/otherContacts', ctx, {
		method: 'GET',
		query: {
			readMask: joinFieldMask(readMask),
			pageSize: input.pageSize,
			pageToken: input.pageToken,
			requestSyncToken: input.requestSyncToken,
			syncToken: input.syncToken,
		},
	});

	await persistContacts(ctx, result.otherContacts, readMask);
	await logEventFromContext(
		ctx,
		'googlecontacts.otherContacts.list',
		{},
		'completed',
	);
	return result;
};

export const search: GoogleContactsEndpoints['otherContactsSearch'] = async (
	ctx,
	input,
) => {
	const readMask = input.readMask ?? DEFAULT_OTHER_CONTACT_FIELDS;
	const result = await makeAuthenticatedPeopleRequest<
		GoogleContactsEndpointOutputs['otherContactsSearch']
	>('/otherContacts:search', ctx, {
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
		'googlecontacts.otherContacts.search',
		{},
		'completed',
	);
	return result;
};

export const copyToContacts: GoogleContactsEndpoints['otherContactsCopyToContacts'] =
	async (ctx, input) => {
		const personFields = input.personFields ?? DEFAULT_PERSON_FIELDS;
		const result = await makeAuthenticatedPeopleRequest<
			GoogleContactsEndpointOutputs['otherContactsCopyToContacts']
		>(
			`${resourcePath('otherContacts', input.resourceName)}:copyOtherContactToMyContactsGroup`,
			ctx,
			{
				method: 'POST',
				body: {
					copyMask: joinFieldMask(
						input.copyMask ?? ['names', 'emailAddresses', 'phoneNumbers'],
					),
					readMask: joinFieldMask(personFields),
				},
			},
		);

		// The copy lands under a new people/ id; leaving the otherContacts row
		// behind would surface the same human twice in a synced search.
		if (ctx.db.contacts) {
			try {
				await ctx.db.contacts.deleteByEntityId(input.resourceName);
			} catch (error) {
				console.warn('Failed to evict copied other contact:', error);
			}
		}

		await persistContact(ctx, result, personFields);
		await logEventFromContext(
			ctx,
			'googlecontacts.otherContacts.copyToContacts',
			{ resourceName: input.resourceName, copiedTo: result.resourceName },
			'completed',
		);
		return result;
	};
