import { logEventFromContext } from 'corsair/core';
import type { BasinEndpoints } from '..';
import { makeBasinRequest } from '../client';
import { BasinEndpointInputSchemas, BasinEndpointOutputSchemas } from './types';

export const list: BasinEndpoints['submissionsList'] = async (ctx, input) => {
	const validated = BasinEndpointInputSchemas.submissionsList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (validated.form_id !== undefined) query.form_id = validated.form_id;
	if (validated.filter_by !== undefined) query.filter_by = validated.filter_by;
	if (validated.query !== undefined) query.query = validated.query;
	if (validated.order_by !== undefined) query.order_by = validated.order_by;
	if (validated.date_range !== undefined) {
		query.date_range = validated.date_range;
	}
	if (validated.page !== undefined) query.page = validated.page;

	const res = await makeBasinRequest<unknown>('submissions', ctx.key, {
		method: 'GET',
		query,
	});
	const response = BasinEndpointOutputSchemas.submissionsList.parse(res);
	await logEventFromContext(
		ctx,
		'basin.submissions.list',
		{ ...validated },
		'completed',
	);
	return response;
};

export const get: BasinEndpoints['submissionsGet'] = async (ctx, input) => {
	const validated = BasinEndpointInputSchemas.submissionsGet.parse(input);
	const res = await makeBasinRequest<unknown>(
		`submissions/${validated.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const response = BasinEndpointOutputSchemas.submissionsGet.parse(res);
	await logEventFromContext(
		ctx,
		'basin.submissions.get',
		{ ...validated },
		'completed',
	);
	return response;
};

export const deleteSubmission: BasinEndpoints['submissionsDelete'] = async (
	ctx,
	input,
) => {
	const validated = BasinEndpointInputSchemas.submissionsDelete.parse(input);
	const res = await makeBasinRequest<unknown>(
		`submissions/${validated.id}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	const response = BasinEndpointOutputSchemas.submissionsDelete.parse(res);
	await logEventFromContext(
		ctx,
		'basin.submissions.delete',
		{ ...validated },
		'completed',
	);
	return response;
};

export const update: BasinEndpoints['submissionsUpdate'] = async (
	ctx,
	input,
) => {
	const validated = BasinEndpointInputSchemas.submissionsUpdate.parse(input);
	const { id, submission, spam, read, trash } = validated;
	// The schema allows the flags at the top level *and* inside `submission`.
	// Sending only `submission` when both are present would silently drop the
	// top-level flags, so merge them, with the explicit `submission` object
	// taking precedence.
	const body = {
		submission: {
			...(spam !== undefined ? { spam } : {}),
			...(read !== undefined ? { read } : {}),
			...(trash !== undefined ? { trash } : {}),
			...(submission ?? {}),
		},
	};

	const res = await makeBasinRequest<unknown>(`submissions/${id}`, ctx.key, {
		method: 'PATCH',
		body: body as Record<string, unknown>,
	});
	const response = BasinEndpointOutputSchemas.submissionsUpdate.parse(res);
	// A submission body carries whatever the form collected — names, email
	// addresses, uploaded file references. Log the id and which fields were
	// touched, never the payload itself.
	await logEventFromContext(
		ctx,
		'basin.submissions.update',
		{ id, fields: Object.keys(body.submission ?? {}) },
		'completed',
	);
	return response;
};

export const markSpam: BasinEndpoints['submissionsMarkSpam'] = async (
	ctx,
	input,
) => {
	const validated = BasinEndpointInputSchemas.submissionsMarkSpam.parse(input);
	const res = await makeBasinRequest<unknown>(
		`submissions/${validated.id}`,
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
		{ ...validated },
		'completed',
	);
	return response;
};

export const markHam: BasinEndpoints['submissionsMarkHam'] = async (
	ctx,
	input,
) => {
	const validated = BasinEndpointInputSchemas.submissionsMarkHam.parse(input);
	const res = await makeBasinRequest<unknown>(
		`submissions/${validated.id}`,
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
		{ ...validated },
		'completed',
	);
	return response;
};

export const refireWebhooks: BasinEndpoints['submissionsRefireWebhooks'] =
	async (ctx, input) => {
		const validated =
			BasinEndpointInputSchemas.submissionsRefireWebhooks.parse(input);
		const res = await makeBasinRequest<unknown>(
			`submissions/${validated.id}/refire_webhooks`,
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
			{ ...validated },
			'completed',
		);
		return response;
	};

export const refireWebhooksBulk: BasinEndpoints['submissionsRefireWebhooksBulk'] =
	async (ctx, input) => {
		const validated =
			BasinEndpointInputSchemas.submissionsRefireWebhooksBulk.parse(input);
		const res = await makeBasinRequest<unknown>(
			'submissions/refire_webhooks',
			ctx.key,
			{
				method: 'POST',
				body: { submission_ids: validated.submission_ids },
			},
		);
		const response =
			BasinEndpointOutputSchemas.submissionsRefireWebhooksBulk.parse(res);
		await logEventFromContext(
			ctx,
			'basin.submissions.refireWebhooksBulk',
			{ ...validated },
			'completed',
		);
		return response;
	};
