import { logEventFromContext } from 'corsair/core';

import { makeMailchimpRequest } from '../client';
import type { MailchimpEndpoints } from '../index';
import type { MailchimpEndpointOutputs } from './types';

export const list: MailchimpEndpoints['mergeFieldsList'] = async (
	ctx,
	input,
) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['mergeFieldsList']
	>(`/lists/${input.list_id}/merge-fields`, ctx.key, {
		method: 'GET',
		query: { count: input.count, offset: input.offset },
	});

	await logEventFromContext(
		ctx,
		'mailchimp.mergeFields.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: MailchimpEndpoints['mergeFieldsGet'] = async (ctx, input) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['mergeFieldsGet']
	>(`/lists/${input.list_id}/merge-fields/${input.merge_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'mailchimp.mergeFields.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: MailchimpEndpoints['mergeFieldsCreate'] = async (
	ctx,
	input,
) => {
	const { list_id, ...body } = input;
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['mergeFieldsCreate']
	>(`/lists/${list_id}/merge-fields`, ctx.key, { method: 'POST', body });

	await logEventFromContext(
		ctx,
		'mailchimp.mergeFields.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: MailchimpEndpoints['mergeFieldsUpdate'] = async (
	ctx,
	input,
) => {
	const { list_id, merge_id, ...body } = input;
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['mergeFieldsUpdate']
	>(`/lists/${list_id}/merge-fields/${merge_id}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	await logEventFromContext(
		ctx,
		'mailchimp.mergeFields.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const remove: MailchimpEndpoints['mergeFieldsRemove'] = async (
	ctx,
	input,
) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['mergeFieldsRemove']
	>(`/lists/${input.list_id}/merge-fields/${input.merge_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'mailchimp.mergeFields.remove',
		{ ...input },
		'completed',
	);
	return response;
};
