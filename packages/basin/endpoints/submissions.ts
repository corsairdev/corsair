import { logEventFromContext } from 'corsair/core';
import type { BasinEndpoints } from '..';
import { makeBasinRequest } from '../client';
import { BasinEndpointOutputSchemas } from './types';

export const list: BasinEndpoints['submissionsList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input?.form_id !== undefined) query.form_id = input.form_id;
	if (input?.filter_by !== undefined) query.filter_by = input.filter_by;
	if (input?.query !== undefined) query.query = input.query;
	if (input?.order_by !== undefined) query.order_by = input.order_by;
	if (input?.date_range !== undefined) query.date_range = input.date_range;
	if (input?.page !== undefined) query.page = input.page;

	const res = await makeBasinRequest<unknown>('submissions', ctx.key, {
		method: 'GET',
		query,
	});
	const response = BasinEndpointOutputSchemas.submissionsList.parse(res);
	await logEventFromContext(
		ctx,
		'basin.submissions.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: BasinEndpoints['submissionsGet'] = async (ctx, input) => {
	const res = await makeBasinRequest<unknown>(
		`submissions/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const response = BasinEndpointOutputSchemas.submissionsGet.parse(res);
	await logEventFromContext(
		ctx,
		'basin.submissions.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteSubmission: BasinEndpoints['submissionsDelete'] = async (
	ctx,
	input,
) => {
	const res = await makeBasinRequest<unknown>(
		`submissions/${input.id}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	const response = BasinEndpointOutputSchemas.submissionsDelete.parse(res);
	await logEventFromContext(
		ctx,
		'basin.submissions.delete',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: BasinEndpoints['submissionsUpdate'] = async (
	ctx,
	input,
) => {
	const { id, submission, spam, read, trash } = input;
	const body = submission
		? { submission }
		: {
				submission: {
					...(spam !== undefined ? { spam } : {}),
					...(read !== undefined ? { read } : {}),
					...(trash !== undefined ? { trash } : {}),
				},
			};

	const res = await makeBasinRequest<unknown>(`submissions/${id}`, ctx.key, {
		method: 'PATCH',
		body: body as Record<string, unknown>,
	});
	const response = BasinEndpointOutputSchemas.submissionsUpdate.parse(res);
	await logEventFromContext(
		ctx,
		'basin.submissions.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const markSpam: BasinEndpoints['submissionsMarkSpam'] = async (
	ctx,
	input,
) => {
	const res = await makeBasinRequest<unknown>(
		`submissions/${input.id}`,
		ctx.key,
		{
			method: 'PATCH',
			body: { submission: { spam: true } },
		},
	);
	const response = BasinEndpointOutputSchemas.submissionsMarkSpam.parse(res);
	await logEventFromContext(
		ctx,
		'basin.submissions.markSpam',
		{ ...input },
		'completed',
	);
	return response;
};

export const markHam: BasinEndpoints['submissionsMarkHam'] = async (
	ctx,
	input,
) => {
	const res = await makeBasinRequest<unknown>(
		`submissions/${input.id}`,
		ctx.key,
		{
			method: 'PATCH',
			body: { submission: { spam: false } },
		},
	);
	const response = BasinEndpointOutputSchemas.submissionsMarkHam.parse(res);
	await logEventFromContext(
		ctx,
		'basin.submissions.markHam',
		{ ...input },
		'completed',
	);
	return response;
};

export const refireWebhooks: BasinEndpoints['submissionsRefireWebhooks'] =
	async (ctx, input) => {
		const res = await makeBasinRequest<unknown>(
			`submissions/${input.id}/refire_webhooks`,
			ctx.key,
			{
				method: 'POST',
			},
		);
		const response =
			BasinEndpointOutputSchemas.submissionsRefireWebhooks.parse(res);
		await logEventFromContext(
			ctx,
			'basin.submissions.refireWebhooks',
			{ ...input },
			'completed',
		);
		return response;
	};

export const refireWebhooksBulk: BasinEndpoints['submissionsRefireWebhooksBulk'] =
	async (ctx, input) => {
		const res = await makeBasinRequest<unknown>(
			'submissions/refire_webhooks',
			ctx.key,
			{
				method: 'POST',
				body: { submission_ids: input.submission_ids },
			},
		);
		const response =
			BasinEndpointOutputSchemas.submissionsRefireWebhooksBulk.parse(res);
		await logEventFromContext(
			ctx,
			'basin.submissions.refireWebhooksBulk',
			{ ...input },
			'completed',
		);
		return response;
	};
