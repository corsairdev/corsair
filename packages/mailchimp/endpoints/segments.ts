import { logEventFromContext } from 'corsair/core';

import { makeMailchimpRequest } from '../client';
import type { MailchimpEndpoints } from '../index';
import { subscriberHash } from '../utils';
import type { MailchimpEndpointOutputs } from './types';

export const list: MailchimpEndpoints['segmentsList'] = async (ctx, input) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['segmentsList']
	>(`/lists/${input.list_id}/segments`, ctx.key, {
		method: 'GET',
		query: { count: input.count, offset: input.offset },
	});

	await logEventFromContext(
		ctx,
		'mailchimp.segments.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: MailchimpEndpoints['segmentsGet'] = async (ctx, input) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['segmentsGet']
	>(`/lists/${input.list_id}/segments/${input.segment_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'mailchimp.segments.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: MailchimpEndpoints['segmentsCreate'] = async (
	ctx,
	input,
) => {
	const { list_id, ...body } = input;
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['segmentsCreate']
	>(`/lists/${list_id}/segments`, ctx.key, { method: 'POST', body });

	await logEventFromContext(
		ctx,
		'mailchimp.segments.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: MailchimpEndpoints['segmentsUpdate'] = async (
	ctx,
	input,
) => {
	const { list_id, segment_id, ...body } = input;
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['segmentsUpdate']
	>(`/lists/${list_id}/segments/${segment_id}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	await logEventFromContext(
		ctx,
		'mailchimp.segments.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const remove: MailchimpEndpoints['segmentsRemove'] = async (
	ctx,
	input,
) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['segmentsRemove']
	>(`/lists/${input.list_id}/segments/${input.segment_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'mailchimp.segments.remove',
		{ ...input },
		'completed',
	);
	return response;
};

export const listMembers: MailchimpEndpoints['segmentsListMembers'] = async (
	ctx,
	input,
) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['segmentsListMembers']
	>(`/lists/${input.list_id}/segments/${input.segment_id}/members`, ctx.key, {
		method: 'GET',
		query: { count: input.count, offset: input.offset },
	});

	await logEventFromContext(
		ctx,
		'mailchimp.segments.listMembers',
		{ ...input },
		'completed',
	);
	return response;
};

export const addMember: MailchimpEndpoints['segmentsAddMember'] = async (
	ctx,
	input,
) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['segmentsAddMember']
	>(`/lists/${input.list_id}/segments/${input.segment_id}/members`, ctx.key, {
		method: 'POST',
		body: { email_address: input.email_address },
	});

	await logEventFromContext(
		ctx,
		'mailchimp.segments.addMember',
		{ ...input },
		'completed',
	);
	return response;
};

export const removeMember: MailchimpEndpoints['segmentsRemoveMember'] = async (
	ctx,
	input,
) => {
	const hash = subscriberHash(input.subscriber_hash);
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['segmentsRemoveMember']
	>(
		`/lists/${input.list_id}/segments/${input.segment_id}/members/${hash}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'mailchimp.segments.removeMember',
		{ ...input },
		'completed',
	);
	return response;
};
