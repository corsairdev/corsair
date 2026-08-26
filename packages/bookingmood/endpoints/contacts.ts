import { logEventFromContext } from 'corsair/core';
import { makeBookingmoodRequest } from '../client';
import type { BookingmoodEndpoints } from '../index';
import type {
	ContactsCreateResponse,
	ContactsDeleteResponse,
	ContactsGetResponse,
	ContactsListResponse,
	ContactsUpdateResponse,
} from './types';

export const get: BookingmoodEndpoints['contactsGet'] = async (ctx, input) => {
	const res = await makeBookingmoodRequest<
		ContactsGetResponse | ContactsListResponse
	>('contacts', ctx.key, {
		method: 'GET',
		query: { id: `eq.${input.id}`, select: '*' },
	});

	const contact = Array.isArray(res) ? res[0] : res;
	if (contact && ctx.db.contacts) {
		try {
			await ctx.db.contacts.upsertByEntityId(contact.id, {
				id: contact.id,
				name: contact.name,
				email: contact.email,
				phone: contact.phone,
				created_at: contact.created_at ? new Date(contact.created_at) : null,
				updated_at: contact.updated_at ? new Date(contact.updated_at) : null,
			});
		} catch (error) {
			console.warn('Failed to save contact to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'bookingmood.contacts.get',
		{ ...input },
		'completed',
	);
	return contact ?? { id: input.id };
};

export const list: BookingmoodEndpoints['contactsList'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {
		select: '*',
	};
	if (input?.limit) query.limit = input.limit;
	if (input?.offset) query.offset = input.offset;

	const res = await makeBookingmoodRequest<ContactsListResponse>(
		'contacts',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const contacts = Array.isArray(res) ? res : [];
	if (ctx.db.contacts) {
		try {
			for (const contact of contacts) {
				await ctx.db.contacts.upsertByEntityId(contact.id, {
					id: contact.id,
					name: contact.name,
					email: contact.email,
					phone: contact.phone,
					created_at: contact.created_at ? new Date(contact.created_at) : null,
					updated_at: contact.updated_at ? new Date(contact.updated_at) : null,
				});
			}
		} catch (error) {
			console.warn('Failed to save contacts to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'bookingmood.contacts.list',
		{ ...input },
		'completed',
	);
	return contacts;
};

export const create: BookingmoodEndpoints['contactsCreate'] = async (
	ctx,
	input,
) => {
	const res = await makeBookingmoodRequest<
		ContactsCreateResponse | ContactsCreateResponse[]
	>('contacts', ctx.key, {
		method: 'POST',
		body: input,
	});

	const created = Array.isArray(res) ? res[0]! : res;
	if (created && ctx.db.contacts) {
		try {
			await ctx.db.contacts.upsertByEntityId(created.id, {
				id: created.id,
				name: created.name,
				email: created.email,
				phone: created.phone,
				created_at: created.created_at ? new Date(created.created_at) : null,
				updated_at: created.updated_at ? new Date(created.updated_at) : null,
			});
		} catch (error) {
			console.warn('Failed to save created contact to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'bookingmood.contacts.create',
		{ ...input },
		'completed',
	);
	return created;
};

export const update: BookingmoodEndpoints['contactsUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const res = await makeBookingmoodRequest<
		ContactsUpdateResponse | ContactsUpdateResponse[]
	>('contacts', ctx.key, {
		method: 'PATCH',
		query: { id: `eq.${id}` },
		body,
	});

	const updated = Array.isArray(res) ? res[0]! : (res ?? { id, ...body });
	if (updated && ctx.db.contacts) {
		try {
			await ctx.db.contacts.upsertByEntityId(updated.id, {
				id: updated.id,
				name: updated.name,
				email: updated.email,
				phone: updated.phone,
				created_at: updated.created_at ? new Date(updated.created_at) : null,
				updated_at: updated.updated_at ? new Date(updated.updated_at) : null,
			});
		} catch (error) {
			console.warn('Failed to save updated contact to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'bookingmood.contacts.update',
		{ ...input },
		'completed',
	);
	return updated;
};

export const deleteContact: BookingmoodEndpoints['contactsDelete'] = async (
	ctx,
	input,
) => {
	await makeBookingmoodRequest<ContactsDeleteResponse>('contacts', ctx.key, {
		method: 'DELETE',
		query: { id: `eq.${input.id}` },
	});

	if (ctx.db.contacts) {
		try {
			await ctx.db.contacts.deleteByEntityId(input.id);
		} catch (error) {
			console.warn('Failed to delete contact from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'bookingmood.contacts.delete',
		{ ...input },
		'completed',
	);
	return { success: true, id: input.id };
};
