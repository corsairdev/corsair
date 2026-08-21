import { logEventFromContext } from 'corsair/core';
import { makeActiveCampaignRequest } from '../client';
import type { ActiveCampaignEndpoints } from '../index';
import {
	ActiveCampaignContactList,
	ActiveCampaignList,
	ActiveCampaignListGroup,
} from '../schema/database';
import { auditPayload, listAuditPayload } from './logging';
import { evictRow, persistRow, persistRows } from './persist';
import {
	buildPaginationQuery,
	compactBody,
	compactQuery,
	resolveAccount,
} from './shared';
import type { ActiveCampaignEndpointOutputs } from './types';

export const list: ActiveCampaignEndpoints['listsList'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['listsList']
	>('lists', ctx.key, account, {
		method: 'GET',
		query: {
			...buildPaginationQuery(input),
			// ActiveCampaign filters list names through a `filters[name]` key
			// rather than a bare `name` parameter.
			...compactQuery({ 'filters[name]': input.name }),
		},
	});

	await persistRows(ctx.db.lists, ActiveCampaignList, response.lists, 'list');

	await logEventFromContext(
		ctx,
		'activecampaign.lists.list',
		listAuditPayload(input, ['limit', 'offset'], response.lists?.length ?? 0),
		'completed',
	);
	return response;
};

export const get: ActiveCampaignEndpoints['listsGet'] = async (ctx, input) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['listsGet']
	>(`lists/${input.id}`, ctx.key, account, { method: 'GET' });

	await persistRow(ctx.db.lists, ActiveCampaignList, response.list, 'list');

	await logEventFromContext(
		ctx,
		'activecampaign.lists.get',
		auditPayload(input, ['id']),
		'completed',
	);
	return response;
};

export const create: ActiveCampaignEndpoints['listsCreate'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['listsCreate']
	>('lists', ctx.key, account, {
		method: 'POST',
		body: {
			list: compactBody({
				name: input.name,
				stringid: input.stringid,
				sender_url: input.sender_url,
				sender_reminder: input.sender_reminder,
				// Sent explicitly rather than omitted: ActiveCampaign's documented
				// default for send_last_broadcast is true, which would mail the
				// account's most recent broadcast to every new subscriber. A
				// fail-safe default has to be sent, because omission inherits the
				// provider's default rather than ours.
				send_last_broadcast: input.send_last_broadcast ?? false,
				carboncopy: input.carboncopy,
				subscription_notify: input.subscription_notify,
				unsubscription_notify: input.unsubscription_notify,
				user: input.user,
			}),
		},
	});

	await persistRow(ctx.db.lists, ActiveCampaignList, response.list, 'list');

	await logEventFromContext(
		ctx,
		'activecampaign.lists.create',
		auditPayload(input, ['name', 'stringid', 'send_last_broadcast']),
		'completed',
	);
	return response;
};

export const remove: ActiveCampaignEndpoints['listsDelete'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	await makeActiveCampaignRequest<unknown>(
		`lists/${input.id}`,
		ctx.key,
		account,
		{ method: 'DELETE' },
	);

	await evictRow(ctx.db.lists, input.id, 'list');

	await logEventFromContext(
		ctx,
		'activecampaign.lists.delete',
		auditPayload(input, ['id']),
		'completed',
	);
	return { id: input.id };
};

export const listContactLists: ActiveCampaignEndpoints['contactListsList'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['contactListsList']
		>('contactLists', ctx.key, account, {
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
			'activecampaign.contactLists.list',
			listAuditPayload(
				input,
				['limit', 'offset'],
				response.contactLists?.length ?? 0,
			),
			'completed',
		);
		return response;
	};

/**
 * Subscribes (status 1) or unsubscribes (status 2) a contact.
 *
 * The association row is not deleted on an unsubscribe - ActiveCampaign keeps
 * it so the history survives - so this never evicts from the mirror.
 */
export const updateSubscription: ActiveCampaignEndpoints['listsUpdateSubscription'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['listsUpdateSubscription']
		>('contactLists', ctx.key, account, {
			method: 'POST',
			body: {
				contactList: {
					list: input.list,
					contact: input.contact,
					status: input.status,
				},
			},
		});

		await persistRow(
			ctx.db.contactLists,
			ActiveCampaignContactList,
			response.contactList,
			'contactList',
		);

		await logEventFromContext(
			ctx,
			'activecampaign.lists.updateSubscription',
			auditPayload(input, ['list', 'contact', 'status']),
			'completed',
		);
		return response;
	};

/**
 * Grants a user group a set of permissions over a list.
 *
 * ActiveCampaign derives the individual permission flags from the account's
 * defaults; this endpoint only takes the list and the group.
 */
export const createListGroup: ActiveCampaignEndpoints['listGroupsCreate'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['listGroupsCreate']
		>('listGroups', ctx.key, account, {
			method: 'POST',
			body: {
				listGroup: { listid: input.listid, groupid: input.groupid },
			},
		});

		await persistRow(
			ctx.db.listGroups,
			ActiveCampaignListGroup,
			response.listGroup,
			'listGroup',
		);

		await logEventFromContext(
			ctx,
			'activecampaign.listGroups.create',
			auditPayload(input, ['listid', 'groupid']),
			'completed',
		);
		return response;
	};
