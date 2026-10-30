import { logEventFromContext } from 'corsair/core';
import { makeXeroRequest } from '../client';
import type { XeroEndpoints } from '../index';
import type { XeroEndpointOutputs } from './types';

export const create: XeroEndpoints['contactsCreate'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, ...data } = input;
	const response = await makeXeroRequest<XeroEndpointOutputs['contactsCreate']>(
		'Contacts',
		ctx.key,
		{
			method: 'PUT',
			body: { Contacts: [data] },
			tenantId,
		},
	);

	if (response.Contacts?.[0]?.ContactID && ctx.db?.contacts) {
		try {
			await ctx.db.contacts.upsertByEntityId(
				response.Contacts[0].ContactID,
				response.Contacts[0],
			);
		} catch (error) {
			console.warn('Failed to save contact to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'xero.contacts.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: XeroEndpoints['contactsList'] = async (ctx, input) => {
	const {
		tenantId = ctx.options.tenantId,
		page,
		where,
		order,
		searchTerm,
		includeArchived,
		summaryOnly,
	} = input;

	const query: Record<string, string | number | boolean | undefined> = {};
	if (page !== undefined) query.page = page;
	if (where) query.where = where;
	if (order) query.order = order;
	if (searchTerm) query.searchTerm = searchTerm;
	if (includeArchived !== undefined) query.includeArchived = includeArchived;
	if (summaryOnly !== undefined) query.summaryOnly = summaryOnly;

	const response = await makeXeroRequest<XeroEndpointOutputs['contactsList']>(
		'Contacts',
		ctx.key,
		{
			method: 'GET',
			query,
			tenantId,
		},
	);

	if (response.Contacts && ctx.db?.contacts) {
		try {
			for (const contact of response.Contacts) {
				await ctx.db.contacts.upsertByEntityId(contact.ContactID, contact);
			}
		} catch (error) {
			console.warn('Failed to save contacts to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'xero.contacts.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: XeroEndpoints['contactsUpdate'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, contactId, ...data } = input;
	const response = await makeXeroRequest<XeroEndpointOutputs['contactsUpdate']>(
		`Contacts/${contactId}`,
		ctx.key,
		{
			method: 'POST',
			body: { Contacts: [{ ContactID: contactId, ...data }] },
			tenantId,
		},
	);

	if (response.Contacts?.[0]?.ContactID && ctx.db?.contacts) {
		try {
			await ctx.db.contacts.upsertByEntityId(
				response.Contacts[0].ContactID,
				response.Contacts[0],
			);
		} catch (error) {
			console.warn('Failed to save contact update to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'xero.contacts.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const Contacts = {
	create,
	list,
	update,
};
