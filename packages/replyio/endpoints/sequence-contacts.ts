import { logEventFromContext } from 'corsair/core';
import { makeReplyioRequest } from '../client';
import type { ReplyioEndpoint, ReplyioEndpointContext } from './context';
import type { ReplyioEndpointOutputs } from './types';

export const add: ReplyioEndpoint<'sequenceContactsAdd'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	const body: Record<string, string | number | boolean | number[] | null> = {
		contactIds: input.contactIds,
	};
	if (input.removeFromExisting !== undefined)
		body.removeFromExisting = input.removeFromExisting;
	if (input.startStepId !== undefined) body.startStepId = input.startStepId;
	if (input.ignoreStepDelay !== undefined)
		body.ignoreStepDelay = input.ignoreStepDelay;
	if (input.startFrom !== undefined) body.startFrom = input.startFrom;

	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['sequenceContactsAdd']
	>(`sequences/${input.sequenceId}/contact-links/bulk`, ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'replyio.sequenceContacts.add',
		{ sequenceId: input.sequenceId },
		'completed',
	);
	return response;
};

export const remove: ReplyioEndpoint<'sequenceContactsRemove'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	await makeReplyioRequest(
		`sequences/${input.sequenceId}/contact-links/${input.contactId}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'replyio.sequenceContacts.remove',
		{ sequenceId: input.sequenceId, contactId: input.contactId },
		'completed',
	);
	return { success: true };
};

export const bulkRemove: ReplyioEndpoint<'sequenceContactsBulkRemove'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['sequenceContactsBulkRemove']
	>(`sequences/${input.sequenceId}/contact-links/bulk-delete`, ctx.key, {
		method: 'POST',
		body: { contactIds: input.contactIds },
	});

	await logEventFromContext(
		ctx,
		'replyio.sequenceContacts.bulkRemove',
		{ sequenceId: input.sequenceId },
		'completed',
	);
	return response;
};

export const listExtended: ReplyioEndpoint<
	'sequenceContactsListExtended'
> = async (ctx: ReplyioEndpointContext, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.top !== undefined) query.top = input.top;
	if (input.skip !== undefined) query.skip = input.skip;
	if (input.additionalColumns !== undefined)
		query.additionalColumns = input.additionalColumns.join(',');

	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['sequenceContactsListExtended']
	>(`sequences/${input.sequenceId}/contacts/state`, ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'replyio.sequenceContacts.listExtended',
		{ sequenceId: input.sequenceId },
		'completed',
	);
	return response;
};
