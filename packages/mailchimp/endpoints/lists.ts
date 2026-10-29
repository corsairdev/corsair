import { logEventFromContext } from 'corsair/core';

import { makeMailchimpRequest } from '../client';
import type { MailchimpEndpoints } from '../index';
import type { MailchimpEndpointOutputs } from './types';

export const list: MailchimpEndpoints['listsList'] = async (ctx, input) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['listsList']
	>('/lists', ctx.key, {
		method: 'GET',
		query: {
			count: input?.count,
			offset: input?.offset,
			fields: input?.fields?.join(','),
			exclude_fields: input?.exclude_fields?.join(','),
		},
	});

	if (ctx.db.lists && Array.isArray(response?.lists)) {
		for (const list of response.lists) {
			try {
				await ctx.db.lists.upsertByEntityId(list.id, { ...list });
			} catch {
				// Best-effort persistence.
			}
		}
	}

	await logEventFromContext(
		ctx,
		'mailchimp.lists.list',
		{ ...(input ?? {}) },
		'completed',
	);
	return response;
};

export const get: MailchimpEndpoints['listsGet'] = async (ctx, input) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['listsGet']
	>(`/lists/${input.list_id}`, ctx.key, {
		method: 'GET',
		query: {
			fields: input.fields?.join(','),
			exclude_fields: input.exclude_fields?.join(','),
		},
	});

	if (response?.id && ctx.db.lists) {
		try {
			await ctx.db.lists.upsertByEntityId(response.id, { ...response });
		} catch {
			// Persistence is best-effort; never fail the request on a DB error.
		}
	}

	await logEventFromContext(
		ctx,
		'mailchimp.lists.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: MailchimpEndpoints['listsCreate'] = async (ctx, input) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['listsCreate']
	>('/lists', ctx.key, { method: 'POST', body: { ...input } });

	await logEventFromContext(
		ctx,
		'mailchimp.lists.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: MailchimpEndpoints['listsUpdate'] = async (ctx, input) => {
	const { list_id, ...body } = input;
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['listsUpdate']
	>(`/lists/${list_id}`, ctx.key, { method: 'PATCH', body });

	await logEventFromContext(
		ctx,
		'mailchimp.lists.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const remove: MailchimpEndpoints['listsRemove'] = async (ctx, input) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['listsRemove']
	>(`/lists/${input.list_id}`, ctx.key, { method: 'DELETE' });

	if (ctx.db.lists) {
		try {
			await ctx.db.lists.deleteByEntityId(input.list_id);
		} catch {
			// Persistence is best-effort; the remote deletion already succeeded.
		}
	}

	await logEventFromContext(
		ctx,
		'mailchimp.lists.remove',
		{ ...input },
		'completed',
	);
	return response;
};
