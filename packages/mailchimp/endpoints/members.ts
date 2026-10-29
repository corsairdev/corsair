import { logEventFromContext } from 'corsair/core';

import { makeMailchimpRequest } from '../client';
import type { MailchimpEndpoints } from '../index';
import { subscriberHash } from '../utils';
import type { MailchimpEndpointOutputs } from './types';

export const list: MailchimpEndpoints['membersList'] = async (ctx, input) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['membersList']
	>(`/lists/${input.list_id}/members`, ctx.key, {
		method: 'GET',
		query: {
			status: input.status,
			count: input.count,
			offset: input.offset,
			fields: input.fields?.join(','),
			exclude_fields: input.exclude_fields?.join(','),
		},
	});

	if (ctx.db.members && Array.isArray(response?.members)) {
		for (const member of response.members) {
			try {
				await ctx.db.members.upsertByEntityId(member.id, {
					...member,
					list_id: member.list_id ?? input.list_id,
				});
			} catch {
				// Best-effort persistence.
			}
		}
	}

	await logEventFromContext(
		ctx,
		'mailchimp.members.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: MailchimpEndpoints['membersGet'] = async (ctx, input) => {
	const hash = subscriberHash(input.subscriber_hash);
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['membersGet']
	>(`/lists/${input.list_id}/members/${hash}`, ctx.key, { method: 'GET' });

	if (response?.id && ctx.db.members) {
		try {
			await ctx.db.members.upsertByEntityId(response.id, {
				...response,
				list_id: response.list_id ?? input.list_id,
			});
		} catch {
			// Best-effort persistence.
		}
	}

	await logEventFromContext(
		ctx,
		'mailchimp.members.get',
		{ ...input },
		'completed',
	);
	return response;
};

// PUT is an upsert: creates the member, or updates an existing one.
export const upsert: MailchimpEndpoints['membersUpsert'] = async (
	ctx,
	input,
) => {
	const { list_id, email_address, ...rest } = input;
	const hash = subscriberHash(email_address);
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['membersUpsert']
	>(`/lists/${list_id}/members/${hash}`, ctx.key, {
		method: 'PUT',
		body: { email_address, ...rest },
	});

	await logEventFromContext(
		ctx,
		'mailchimp.members.upsert',
		{ ...input },
		'completed',
	);
	return response;
};

export const add: MailchimpEndpoints['membersAdd'] = async (ctx, input) => {
	const { list_id, ...body } = input;
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['membersAdd']
	>(`/lists/${list_id}/members`, ctx.key, { method: 'POST', body });

	await logEventFromContext(
		ctx,
		'mailchimp.members.add',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: MailchimpEndpoints['membersUpdate'] = async (
	ctx,
	input,
) => {
	const { list_id, subscriber_hash, ...body } = input;
	const hash = subscriberHash(subscriber_hash);
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['membersUpdate']
	>(`/lists/${list_id}/members/${hash}`, ctx.key, { method: 'PATCH', body });

	await logEventFromContext(
		ctx,
		'mailchimp.members.update',
		{ ...input },
		'completed',
	);
	return response;
};

// DELETE archives the member (recoverable).
export const archive: MailchimpEndpoints['membersArchive'] = async (
	ctx,
	input,
) => {
	const hash = subscriberHash(input.subscriber_hash);
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['membersArchive']
	>(`/lists/${input.list_id}/members/${hash}`, ctx.key, { method: 'DELETE' });

	if (ctx.db.members) {
		try {
			await ctx.db.members.deleteByEntityId(hash);
		} catch {
			// Persistence is best-effort; the remote archive already succeeded.
		}
	}

	await logEventFromContext(
		ctx,
		'mailchimp.members.archive',
		{ ...input },
		'completed',
	);
	return response;
};

// Permanently and irreversibly deletes the member.
export const remove: MailchimpEndpoints['membersRemove'] = async (
	ctx,
	input,
) => {
	const hash = subscriberHash(input.subscriber_hash);
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['membersRemove']
	>(
		`/lists/${input.list_id}/members/${hash}/actions/delete-permanent`,
		ctx.key,
		{ method: 'POST' },
	);

	if (ctx.db.members) {
		try {
			await ctx.db.members.deleteByEntityId(hash);
		} catch {
			// Persistence is best-effort; the remote deletion already succeeded.
		}
	}

	await logEventFromContext(
		ctx,
		'mailchimp.members.remove',
		{ ...input },
		'completed',
	);
	return response;
};

export const search: MailchimpEndpoints['membersSearch'] = async (
	ctx,
	input,
) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['membersSearch']
	>('/search-members', ctx.key, {
		method: 'GET',
		query: { query: input.query, list_id: input.list_id },
	});

	await logEventFromContext(
		ctx,
		'mailchimp.members.search',
		{ ...input },
		'completed',
	);
	return response;
};

export const listTags: MailchimpEndpoints['membersListTags'] = async (
	ctx,
	input,
) => {
	const hash = subscriberHash(input.subscriber_hash);
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['membersListTags']
	>(`/lists/${input.list_id}/members/${hash}/tags`, ctx.key, {
		method: 'GET',
		query: { count: input.count, offset: input.offset },
	});

	await logEventFromContext(
		ctx,
		'mailchimp.members.listTags',
		{ ...input },
		'completed',
	);
	return response;
};

export const updateTags: MailchimpEndpoints['membersUpdateTags'] = async (
	ctx,
	input,
) => {
	const hash = subscriberHash(input.subscriber_hash);
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['membersUpdateTags']
	>(`/lists/${input.list_id}/members/${hash}/tags`, ctx.key, {
		method: 'POST',
		body: { tags: input.tags },
	});

	await logEventFromContext(
		ctx,
		'mailchimp.members.updateTags',
		{ ...input },
		'completed',
	);
	return response;
};
