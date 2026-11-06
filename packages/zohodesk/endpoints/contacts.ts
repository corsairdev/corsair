import type { ZohoDeskContext, ZohoDeskEndpoints } from '..';
import { csv, syncBestEffort, zohoDeskCall } from './call';
import type { ZohoDeskEndpointOutputs } from './types';
import {
	ZohoDeskEndpointInputSchemas,
	ZohoDeskEndpointOutputSchemas,
} from './types';

type Contact = ZohoDeskEndpointOutputs['contactsGet'];

function idText(value: Contact['id']) {
	return value === null || value === undefined ? value : String(value);
}

async function syncContacts(
	ctx: ZohoDeskContext,
	contacts: readonly Contact[],
) {
	if (!ctx.db.contacts) return;
	await syncBestEffort('contacts', async () => {
		for (const contact of contacts) {
			const id = idText(contact.id);
			if (!id) continue;
			await ctx.db.contacts.upsertByEntityId(id, {
				id,
				firstName: contact.firstName,
				lastName: contact.lastName,
				email: contact.email,
				secondaryEmail: contact.secondaryEmail,
				phone: contact.phone,
				mobile: contact.mobile,
				type: contact.type,
				accountId: idText(contact.accountId),
				ownerId: idText(contact.ownerId),
				createdTime: contact.createdTime,
				webUrl: contact.webUrl,
			});
		}
	});
}

export const list: ZohoDeskEndpoints['contactsList'] = (ctx, input) =>
	zohoDeskCall(ctx, input, {
		event: 'zohodesk.contacts.list',
		input: ZohoDeskEndpointInputSchemas.contactsList,
		output: ZohoDeskEndpointOutputSchemas.contactsList,
		empty: { data: [] },
		toRequest: (parsed) => ({
			path: '/contacts',
			query: {
				from: parsed.from,
				limit: parsed.limit,
				viewId: parsed.viewId,
				filterId: parsed.filterId,
				sortBy: parsed.sortBy,
				include: csv(parsed.include),
				fields: csv(parsed.fields),
			},
		}),
		// See tickets.list: `fields` returns partial rows.
		sync: (result, parsed) =>
			parsed.fields ? Promise.resolve() : syncContacts(ctx, result.data),
	});

export const get: ZohoDeskEndpoints['contactsGet'] = (ctx, input) =>
	zohoDeskCall(ctx, input, {
		event: 'zohodesk.contacts.get',
		input: ZohoDeskEndpointInputSchemas.contactsGet,
		output: ZohoDeskEndpointOutputSchemas.contactsGet,
		toRequest: ({ contactId, include }) => ({
			path: `/contacts/${contactId}`,
			query: { include: csv(include) },
		}),
		sync: (result) => syncContacts(ctx, [result]),
	});

export const getByIds: ZohoDeskEndpoints['contactsGetByIds'] = (ctx, input) =>
	zohoDeskCall(ctx, input, {
		event: 'zohodesk.contacts.getByIds',
		input: ZohoDeskEndpointInputSchemas.contactsGetByIds,
		output: ZohoDeskEndpointOutputSchemas.contactsGetByIds,
		empty: { data: [] },
		toRequest: ({ ids }) => ({
			path: '/contacts/contactsByIds',
			query: { ids: csv(ids) },
		}),
		sync: (result) => syncContacts(ctx, result.data),
	});

export const listAccounts: ZohoDeskEndpoints['contactsListAccounts'] = (
	ctx,
	input,
) =>
	zohoDeskCall(ctx, input, {
		event: 'zohodesk.contacts.listAccounts',
		input: ZohoDeskEndpointInputSchemas.contactsListAccounts,
		output: ZohoDeskEndpointOutputSchemas.contactsListAccounts,
		empty: { data: [] },
		toRequest: ({ contactId, from, limit, sortBy, startsWith }) => ({
			path: `/contacts/${contactId}/accounts`,
			query: { from, limit, sortBy, startsWith },
		}),
	});
