import { logEventFromContext } from 'corsair/core';
import type { OutlookEndpoints } from '..';
import { makeOutlookRequest } from '../client';
import type { OutlookEndpointOutputs } from './types';

const userPath = (userId?: string) => (userId ? `/users/${userId}` : '/me');

// ── DB record helper ──────────────────────────────────────────────────────────

const toContactRecord = (
	contact: OutlookEndpointOutputs['contactsCreate'],
) => ({
	// id is asserted non-null — all callers guard with `if (result.id)` before invoking this helper
	id: contact.id!,
	displayName: contact.displayName,
	givenName: contact.givenName,
	surname: contact.surname,
	emailAddresses: contact.emailAddresses?.length
		? JSON.stringify(contact.emailAddresses)
		: undefined,
	mobilePhone: contact.mobilePhone ?? undefined,
	businessPhones: contact.businessPhones?.join(','),
	jobTitle: contact.jobTitle ?? undefined,
	companyName: contact.companyName ?? undefined,
	department: contact.department ?? undefined,
	officeLocation: contact.officeLocation ?? undefined,
	parentFolderId: contact.parentFolderId,
	createdAt: contact.createdDateTime
		? new Date(contact.createdDateTime)
		: undefined,
});

// ── Endpoints ─────────────────────────────────────────────────────────────────

export const createContact: OutlookEndpoints['contactsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeOutlookRequest<
		OutlookEndpointOutputs['contactsCreate']
	>(`${userPath(input.user_id)}/contacts`, ctx.key, {
		method: 'POST',
		body: {
			...(input.givenName && { givenName: input.givenName }),
			...(input.surname && { surname: input.surname }),
			...(input.displayName && { displayName: input.displayName }),
			...(input.emailAddresses?.length && {
				emailAddresses: input.emailAddresses,
			}),
			...(input.mobilePhone && { mobilePhone: input.mobilePhone }),
			...(input.homePhone && { homePhones: [input.homePhone] }),
			...(input.businessPhones?.length && {
				businessPhones: input.businessPhones,
			}),
			...(input.jobTitle && { jobTitle: input.jobTitle }),
			...(input.companyName && { companyName: input.companyName }),
			...(input.department && { department: input.department }),
			...(input.officeLocation && { officeLocation: input.officeLocation }),
			...(input.birthday && { birthday: input.birthday }),
			...(input.notes && { personalNotes: input.notes }),
			...(input.categories?.length && { categories: input.categories }),
		},
	});

	if (result.id && ctx.db.contacts) {
		try {
			await ctx.db.contacts.upsertByEntityId(
				result.id,
				toContactRecord(result),
			);
		} catch (error) {
			console.warn('Failed to save contact to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.contacts.create',
		{ displayName: input.displayName ?? input.givenName },
		'completed',
	);
	return result;
};

export const listContacts: OutlookEndpoints['contactsList'] = async (
	ctx,
	input,
) => {
	const base = userPath(input.user_id);
	const folderPath = input.contact_folder_id
		? `/contactFolders/${input.contact_folder_id}`
		: '';

	const result = await makeOutlookRequest<
		OutlookEndpointOutputs['contactsList']
	>(`${base}${folderPath}/contacts`, ctx.key, {
		query: {
			...(input.top && { $top: input.top }),
			...(input.skip && { $skip: input.skip }),
			...(input.filter && { $filter: input.filter }),
			...(input.select?.length && { $select: input.select.join(',') }),
			...(input.orderby?.length && { $orderby: input.orderby.join(',') }),
		},
	});

	if (result.value?.length && ctx.db.contacts) {
		try {
			for (const contact of result.value) {
				if (contact.id) {
					await ctx.db.contacts.upsertByEntityId(
						contact.id,
						toContactRecord(contact),
					);
				}
			}
		} catch (error) {
			console.warn('Failed to save contacts to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.contacts.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const updateContact: OutlookEndpoints['contactsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeOutlookRequest<
		OutlookEndpointOutputs['contactsUpdate']
	>(`${userPath(input.user_id)}/contacts/${input.contact_id}`, ctx.key, {
		method: 'PATCH',
		body: {
			...(input.givenName && { givenName: input.givenName }),
			...(input.surname && { surname: input.surname }),
			...(input.displayName && { displayName: input.displayName }),
			...(input.emailAddresses && { emailAddresses: input.emailAddresses }),
			...(input.mobilePhone && { mobilePhone: input.mobilePhone }),
			...(input.homePhones && { homePhones: input.homePhones }),
			...(input.businessPhones && { businessPhones: input.businessPhones }),
			...(input.jobTitle && { jobTitle: input.jobTitle }),
			...(input.companyName && { companyName: input.companyName }),
			...(input.department && { department: input.department }),
			...(input.officeLocation && { officeLocation: input.officeLocation }),
			...(input.birthday && { birthday: input.birthday }),
			...(input.notes && { personalNotes: input.notes }),
			...(input.categories && { categories: input.categories }),
		},
	});

	if (result.id && ctx.db.contacts) {
		try {
			await ctx.db.contacts.upsertByEntityId(
				result.id,
				toContactRecord(result),
			);
		} catch (error) {
			console.warn('Failed to update contact in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.contacts.update',
		{ contact_id: input.contact_id },
		'completed',
	);
	return result;
};

export const deleteContact: OutlookEndpoints['contactsDelete'] = async (
	ctx,
	input,
) => {
	await makeOutlookRequest<void>(
		`${userPath(input.user_id)}/contacts/${input.contact_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (ctx.db.contacts) {
		try {
			await ctx.db.contacts.deleteByEntityId(input.contact_id);
		} catch (error) {
			console.warn('Failed to delete contact from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.contacts.delete',
		{ contact_id: input.contact_id },
		'completed',
	);
	return { success: true };
};
