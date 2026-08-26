import { logEventFromContext } from 'corsair/core';
import { makeActiveCampaignRequest } from '../client';
import type { ActiveCampaignEndpoints } from '../index';
import {
	ActiveCampaignContactTag,
	ActiveCampaignTag,
} from '../schema/database';
import { auditPayload, listAuditPayload } from './logging';
import { evictChildren, evictRow, persistRow, persistRows } from './persist';
import {
	buildPaginationQuery,
	compactBody,
	compactQuery,
	resolveAccount,
} from './shared';
import type { ActiveCampaignEndpointOutputs } from './types';

export const list: ActiveCampaignEndpoints['tagsList'] = async (ctx, input) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['tagsList']
	>('tags', ctx.key, account, {
		method: 'GET',
		query: {
			...buildPaginationQuery(input),
			...compactQuery({ 'filters[search][contains]': input.search }),
		},
	});

	await persistRows(ctx.db.tags, ActiveCampaignTag, response.tags, 'tag');

	await logEventFromContext(
		ctx,
		'activecampaign.tags.list',
		listAuditPayload(input, ['limit', 'offset'], response.tags?.length ?? 0),
		'completed',
	);
	return response;
};

export const get: ActiveCampaignEndpoints['tagsGet'] = async (ctx, input) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['tagsGet']
	>(`tags/${input.id}`, ctx.key, account, { method: 'GET' });

	await persistRow(ctx.db.tags, ActiveCampaignTag, response.tag, 'tag');

	await logEventFromContext(
		ctx,
		'activecampaign.tags.get',
		auditPayload(input, ['id']),
		'completed',
	);
	return response;
};

export const create: ActiveCampaignEndpoints['tagsCreate'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['tagsCreate']
	>('tags', ctx.key, account, {
		method: 'POST',
		body: {
			tag: compactBody({
				tag: input.tag,
				tagType: input.tagType,
				description: input.description,
			}),
		},
	});

	await persistRow(ctx.db.tags, ActiveCampaignTag, response.tag, 'tag');

	await logEventFromContext(
		ctx,
		'activecampaign.tags.create',
		auditPayload(input, ['tag', 'tagType']),
		'completed',
	);
	return response;
};

export const update: ActiveCampaignEndpoints['tagsUpdate'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['tagsUpdate']
	>(`tags/${input.id}`, ctx.key, account, {
		method: 'PUT',
		body: {
			tag: compactBody({
				tag: input.tag,
				tagType: input.tagType,
				description: input.description,
			}),
		},
	});

	await persistRow(ctx.db.tags, ActiveCampaignTag, response.tag, 'tag');

	await logEventFromContext(
		ctx,
		'activecampaign.tags.update',
		auditPayload(input, ['id', 'tag', 'tagType']),
		'completed',
	);
	return response;
};

export const remove: ActiveCampaignEndpoints['tagsDelete'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	await makeActiveCampaignRequest<unknown>(
		`tags/${input.id}`,
		ctx.key,
		account,
		{
			method: 'DELETE',
		},
	);

	await evictRow(ctx.db.tags, input.id, 'tag');
	// Deleting a tag removes it from every contact upstream, so the cached
	// associations go with it.
	await evictChildren(ctx.db.contactTags, 'tag', input.id, 'contactTag');

	await logEventFromContext(
		ctx,
		'activecampaign.tags.delete',
		auditPayload(input, ['id']),
		'completed',
	);
	return { id: input.id };
};

export const addToContact: ActiveCampaignEndpoints['tagsAddToContact'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['tagsAddToContact']
	>('contactTags', ctx.key, account, {
		method: 'POST',
		body: { contactTag: { contact: input.contact, tag: input.tag } },
	});

	await persistRow(
		ctx.db.contactTags,
		ActiveCampaignContactTag,
		response.contactTag,
		'contactTag',
	);

	await logEventFromContext(
		ctx,
		'activecampaign.tags.addToContact',
		auditPayload(input, ['contact', 'tag']),
		'completed',
	);
	return response;
};

/**
 * Removes a tag from a contact.
 *
 * The id is the contactTag association id, not the tag id - deleting by tag id
 * would delete the tag itself for every contact. Only the association row is
 * evicted; the tag stays in the mirror because it still exists upstream.
 */
export const removeFromContact: ActiveCampaignEndpoints['tagsRemoveFromContact'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		await makeActiveCampaignRequest<unknown>(
			`contactTags/${input.id}`,
			ctx.key,
			account,
			{ method: 'DELETE' },
		);

		await evictRow(ctx.db.contactTags, input.id, 'contactTag');

		await logEventFromContext(
			ctx,
			'activecampaign.tags.removeFromContact',
			auditPayload(input, ['id']),
			'completed',
		);
		return { id: input.id };
	};

export const listContactTags: ActiveCampaignEndpoints['contactTagsList'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['contactTagsList']
		>('contactTags', ctx.key, account, {
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
			'activecampaign.contactTags.list',
			listAuditPayload(
				input,
				['limit', 'offset'],
				response.contactTags?.length ?? 0,
			),
			'completed',
		);
		return response;
	};
