import { logEventFromContext } from 'corsair/core';
import { makeActiveCampaignRequest } from '../client';
import type { ActiveCampaignEndpoints } from '../index';
import {
	ActiveCampaignContact,
	ActiveCampaignContactList,
	ActiveCampaignContactTag,
} from '../schema/database';
import { auditPayload, listAuditPayload } from './logging';
import { evictRow, persistRow, persistRows } from './persist';
import { buildPaginationQuery, compactBody, compactQuery } from './shared';
import type { ActiveCampaignEndpointOutputs } from './types';

/**
 * The account slug half of the credential. Supplied as a plugin option, or
 * resolved from the stored key material.
 */
async function resolveAccount(ctx: {
	options: { account?: string };
	keys: { get_account: () => Promise<string | null | undefined> };
}): Promise<string> {
	return ctx.options.account ?? (await ctx.keys.get_account()) ?? '';
}

export const list: ActiveCampaignEndpoints['contactsList'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['contactsList']
	>('contacts', ctx.key, account, {
		method: 'GET',
		query: {
			...buildPaginationQuery(input),
			...compactQuery({
				email: input.email,
				search: input.search,
				listid: input.listid,
				tagid: input.tagid,
				segmentid: input.segmentid,
				status: input.status,
				id_greater: input.id_greater,
				'orders[id]': input.orders_id,
			}),
		},
	});

	await persistRows(
		ctx.db.contacts,
		ActiveCampaignContact,
		response.contacts,
		'contact',
	);

	await logEventFromContext(
		ctx,
		'activecampaign.contacts.list',
		listAuditPayload(
			input,
			['limit', 'offset', 'listid', 'tagid', 'segmentid', 'status'],
			response.contacts?.length ?? 0,
		),
		'completed',
	);
	return response;
};

export const get: ActiveCampaignEndpoints['contactsGet'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['contactsGet']
	>(`contacts/${input.id}`, ctx.key, account, { method: 'GET' });

	await persistRow(
		ctx.db.contacts,
		ActiveCampaignContact,
		response.contact,
		'contact',
	);

	await logEventFromContext(
		ctx,
		'activecampaign.contacts.get',
		auditPayload(input, ['id']),
		'completed',
	);
	return response;
};

/**
 * Looks a contact up by email. ActiveCampaign has no dedicated find route -
 * the collection accepts an `email` filter and returns a (possibly empty)
 * array.
 */
export const find: ActiveCampaignEndpoints['contactsFind'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['contactsFind']
	>('contacts', ctx.key, account, {
		method: 'GET',
		query: { email: input.email },
	});

	await persistRows(
		ctx.db.contacts,
		ActiveCampaignContact,
		response.contacts,
		'contact',
	);

	// The email is the search term and is personal data; only the result count
	// is recorded.
	await logEventFromContext(
		ctx,
		'activecampaign.contacts.find',
		{ matched: response.contacts?.length ?? 0, fields: ['email'] },
		'completed',
	);
	return response;
};

/**
 * Creates a contact, or updates it if the email already exists.
 *
 * ActiveCampaign exposes this as `POST /contact/sync` - a singular path,
 * unlike the plural `contacts` collection used everywhere else.
 */
export const createOrUpdate: ActiveCampaignEndpoints['contactsCreateOrUpdate'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['contactsCreateOrUpdate']
		>('contact/sync', ctx.key, account, {
			method: 'POST',
			body: {
				contact: compactBody({
					email: input.email,
					firstName: input.firstName,
					lastName: input.lastName,
					phone: input.phone,
					fieldValues: input.fieldValues,
				}),
			},
		});

		await persistRow(
			ctx.db.contacts,
			ActiveCampaignContact,
			response.contact,
			'contact',
		);

		await logEventFromContext(
			ctx,
			'activecampaign.contacts.createOrUpdate',
			auditPayload(input, []),
			'completed',
		);
		return response;
	};

export const update: ActiveCampaignEndpoints['contactsUpdate'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['contactsUpdate']
	>(`contacts/${input.id}`, ctx.key, account, {
		method: 'PUT',
		body: {
			contact: compactBody({
				email: input.email,
				firstName: input.firstName,
				lastName: input.lastName,
				phone: input.phone,
				fieldValues: input.fieldValues,
			}),
		},
	});

	await persistRow(
		ctx.db.contacts,
		ActiveCampaignContact,
		response.contact,
		'contact',
	);

	await logEventFromContext(
		ctx,
		'activecampaign.contacts.update',
		auditPayload(input, ['id']),
		'completed',
	);
	return response;
};

export const remove: ActiveCampaignEndpoints['contactsDelete'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	await makeActiveCampaignRequest<unknown>(
		`contacts/${input.id}`,
		ctx.key,
		account,
		{ method: 'DELETE' },
	);

	await evictRow(ctx.db.contacts, input.id, 'contact');

	await logEventFromContext(
		ctx,
		'activecampaign.contacts.delete',
		auditPayload(input, ['id']),
		'completed',
	);
	return { id: input.id };
};

export const getLists: ActiveCampaignEndpoints['contactsGetLists'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['contactsGetLists']
	>(`contacts/${input.id}/contactLists`, ctx.key, account, {
		method: 'GET',
		query: buildPaginationQuery(input),
	});

	await persistRows(
		ctx.db.contactLists,
		ActiveCampaignContactList,
		response.contactLists,
		'contactList',
	);

	await logEventFromContext(
		ctx,
		'activecampaign.contacts.getLists',
		listAuditPayload(
			input,
			['id', 'limit', 'offset'],
			response.contactLists?.length ?? 0,
		),
		'completed',
	);
	return response;
};

export const getTags: ActiveCampaignEndpoints['contactsGetTags'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['contactsGetTags']
	>(`contacts/${input.id}/contactTags`, ctx.key, account, {
		method: 'GET',
		query: buildPaginationQuery(input),
	});

	await persistRows(
		ctx.db.contactTags,
		ActiveCampaignContactTag,
		response.contactTags,
		'contactTag',
	);

	await logEventFromContext(
		ctx,
		'activecampaign.contacts.getTags',
		listAuditPayload(
			input,
			['id', 'limit', 'offset'],
			response.contactTags?.length ?? 0,
		),
		'completed',
	);
	return response;
};

/**
 * The remaining contact sub-resources return rows belonging to resource groups
 * outside this PR's scope, so they are returned to the caller but not
 * mirrored - caching a shape this plugin does not model would store rows that
 * nothing can read back reliably.
 */
function subResource<
	K extends
		| 'contactsGetFieldValues'
		| 'contactsGetAutomations'
		| 'contactsGetGeoIps'
		| 'contactsGetScoreValues'
		| 'contactsGetDeals',
>(path: string, event: string): ActiveCampaignEndpoints[K] {
	return (async (
		ctx: Parameters<ActiveCampaignEndpoints[K]>[0],
		input: { id: string; limit?: number; offset?: number },
	) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs[K]
		>(`contacts/${input.id}/${path}`, ctx.key, account, {
			method: 'GET',
			query: buildPaginationQuery(input),
		});

		await logEventFromContext(
			ctx,
			event,
			auditPayload(input, ['id', 'limit', 'offset']),
			'completed',
		);
		return response;
	}) as ActiveCampaignEndpoints[K];
}

export const getFieldValues = subResource<'contactsGetFieldValues'>(
	'fieldValues',
	'activecampaign.contacts.getFieldValues',
);
export const getAutomations = subResource<'contactsGetAutomations'>(
	'contactAutomations',
	'activecampaign.contacts.getAutomations',
);
export const getGeoIps = subResource<'contactsGetGeoIps'>(
	'geoIps',
	'activecampaign.contacts.getGeoIps',
);
export const getScoreValues = subResource<'contactsGetScoreValues'>(
	'scoreValues',
	'activecampaign.contacts.getScoreValues',
);
export const getDeals = subResource<'contactsGetDeals'>(
	'deals',
	'activecampaign.contacts.getDeals',
);
