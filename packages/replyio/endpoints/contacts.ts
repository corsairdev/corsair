import { logEventFromContext } from 'corsair/core';
import { makeReplyioRequest } from '../client';
import type { ReplyioEndpoint, ReplyioEndpointContext } from './context';
import type { ReplyioEndpointOutputs } from './types';

export const create: ReplyioEndpoint<'contactsCreate'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['contactsCreate']
	>('contacts', ctx.key, {
		method: 'POST',
		body: { ...input },
	});

	await logEventFromContext(
		ctx,
		'replyio.contacts.create',
		{ id: response.id },
		'completed',
	);
	return response;
};

export const get: ReplyioEndpoint<'contactsGet'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['contactsGet']
	>(`contacts/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'replyio.contacts.get',
		{ id: response.id },
		'completed',
	);
	return response;
};

export const update: ReplyioEndpoint<'contactsUpdate'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	const { id, ...body } = input;
	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['contactsUpdate']
	>(`contacts/${id}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	await logEventFromContext(
		ctx,
		'replyio.contacts.update',
		{ id: response.id },
		'completed',
	);
	return response;
};

export const deleteContact: ReplyioEndpoint<'contactsDelete'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	await makeReplyioRequest(`contacts/${input.id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'replyio.contacts.delete',
		{ id: input.id },
		'completed',
	);
	return { success: true };
};

export const list: ReplyioEndpoint<'contactsList'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input?.top !== undefined) query.top = input.top;
	if (input?.skip !== undefined) query.skip = input.skip;
	if (input?.email !== undefined) query.email = input.email;
	if (input?.linkedIn !== undefined) query.linkedIn = input.linkedIn;

	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['contactsList']
	>('contacts', ctx.key, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'replyio.contacts.list',
		{ top: input?.top, skip: input?.skip },
		'completed',
	);
	return response;
};

export const searchByEmail: ReplyioEndpoint<'contactsSearchByEmail'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {
		email: input.email,
	};
	if (input.top !== undefined) query.top = input.top;
	if (input.skip !== undefined) query.skip = input.skip;

	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['contactsSearchByEmail']
	>('contacts', ctx.key, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'replyio.contacts.searchByEmail',
		{ email: input.email },
		'completed',
	);
	return response;
};

export const getStatus: ReplyioEndpoint<'contactsGetStatus'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['contactsGetStatus']
	>(`contacts/${input.id}/statuses`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'replyio.contacts.getStatus',
		{ id: input.id },
		'completed',
	);
	return response;
};

export const setStatus: ReplyioEndpoint<'contactsSetStatus'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	// Optional sequenceId uses POST /v3/sequences/{id}/contacts/set-status-in-sequence.
	// Without it, the documented global POST /v3/contacts/set-status-in-sequence
	// updates enrollments across sequences.
	const path = input.sequenceId
		? `sequences/${input.sequenceId}/contacts/set-status-in-sequence`
		: 'contacts/set-status-in-sequence';
	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['contactsSetStatus']
	>(path, ctx.key, {
		method: 'POST',
		body: {
			contactIds: input.contactIds,
			statusInSequence: input.statusInSequence,
		},
	});

	await logEventFromContext(
		ctx,
		'replyio.contacts.setStatus',
		{ statusInSequence: input.statusInSequence },
		'completed',
	);
	return response;
};

export const clearStatus: ReplyioEndpoint<'contactsClearStatus'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	// Each clearable status is a separate Reply API call; per-contact failures
	// merge into one non-atomic dictionary (a later call overwrites an earlier
	// entry for the same contact id). resendEmails=false clears the bounced
	// flag without rescheduling the bounced step for retry.
	const statuses = input.statuses ?? ['optedOut', 'replied', 'bounced'];
	const merged: ReplyioEndpointOutputs['contactsClearStatus'] = {};

	if (statuses.includes('optedOut')) {
		const cleared = await makeReplyioRequest<
			ReplyioEndpointOutputs['contactsClearStatus']
		>('contacts/set-opted-out', ctx.key, {
			method: 'POST',
			body: { contactIds: input.contactIds, isOptedOut: false },
		});
		Object.assign(merged, cleared);
	}

	if (statuses.includes('replied')) {
		const cleared = await makeReplyioRequest<
			ReplyioEndpointOutputs['contactsClearStatus']
		>('contacts/set-replied', ctx.key, {
			method: 'POST',
			body: { contactIds: input.contactIds, isReplied: false },
		});
		Object.assign(merged, cleared);
	}

	if (statuses.includes('bounced')) {
		const cleared = await makeReplyioRequest<
			ReplyioEndpointOutputs['contactsClearStatus']
		>('contacts/set-bounced', ctx.key, {
			method: 'POST',
			body: {
				contactIds: input.contactIds,
				isBounced: false,
				resendEmails: false,
			},
		});
		Object.assign(merged, cleared);
	}

	await logEventFromContext(
		ctx,
		'replyio.contacts.clearStatus',
		{ statuses },
		'completed',
	);
	return merged;
};
