import { logEventFromContext } from 'corsair/core';
import { makeFilloutRequest } from '../client';
import type { FilloutFormsEndpoints } from '../index';
import type { FilloutFormsEndpointOutputs } from './types';

export const listSubmissions: FilloutFormsEndpoints['listSubmissions'] = async (
	ctx,
	input,
) => {
	const { formId, ...queryParams } = input;
	const query: Record<string, string | number | boolean | undefined> = {};
	if (queryParams.limit !== undefined) query.limit = queryParams.limit;
	if (queryParams.afterDate !== undefined)
		query.afterDate = queryParams.afterDate;
	if (queryParams.beforeDate !== undefined)
		query.beforeDate = queryParams.beforeDate;
	if (queryParams.offset !== undefined) query.offset = queryParams.offset;
	if (queryParams.status !== undefined) query.status = queryParams.status;
	if (queryParams.includeEditLink !== undefined)
		query.includeEditLink = queryParams.includeEditLink;
	if (queryParams.includePreview !== undefined)
		query.includePreview = queryParams.includePreview;
	if (queryParams.sort !== undefined) query.sort = queryParams.sort;
	if (queryParams.search !== undefined) query.search = queryParams.search;

	const response = await makeFilloutRequest<
		FilloutFormsEndpointOutputs['listSubmissions']
	>(`forms/${encodeURIComponent(formId)}/submissions`, ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'filloutforms.submissions.list',
		{ formId, limit: queryParams.limit, offset: queryParams.offset },
		'completed',
	);
	return response;
};

export const getSubmissionById: FilloutFormsEndpoints['getSubmissionById'] =
	async (ctx, input) => {
		const query: Record<string, string | number | boolean | undefined> = {};
		if (input.includeEditLink !== undefined)
			query.includeEditLink = input.includeEditLink;

		const response = await makeFilloutRequest<
			FilloutFormsEndpointOutputs['getSubmissionById']
		>(
			`forms/${encodeURIComponent(input.formId)}/submissions/${encodeURIComponent(input.submissionId)}`,
			ctx.key,
			{ method: 'GET', query },
		);

		await logEventFromContext(
			ctx,
			'filloutforms.submissions.getById',
			{ formId: input.formId, submissionId: input.submissionId },
			'completed',
		);
		return response;
	};

export const createSubmission: FilloutFormsEndpoints['createSubmission'] =
	async (ctx, input) => {
		const { formId, submissions } = input;
		const response = await makeFilloutRequest<
			FilloutFormsEndpointOutputs['createSubmission']
		>(`forms/${encodeURIComponent(formId)}/submissions`, ctx.key, {
			method: 'POST',
			body: { submissions },
		});
		await logEventFromContext(
			ctx,
			'filloutforms.submissions.create',
			{ formId, count: submissions.length },
			'completed',
		);
		return response;
	};

export const deleteSubmission: FilloutFormsEndpoints['deleteSubmission'] =
	async (ctx, input) => {
		const response = await makeFilloutRequest<
			FilloutFormsEndpointOutputs['deleteSubmission']
		>(
			`forms/${encodeURIComponent(input.formId)}/submissions/${encodeURIComponent(input.submissionId)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'filloutforms.submissions.delete',
			{ formId: input.formId, submissionId: input.submissionId },
			'completed',
		);
		return { deleted: true, ...response };
	};
