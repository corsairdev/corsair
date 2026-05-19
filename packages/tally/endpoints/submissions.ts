import { logEventFromContext } from 'corsair/core';
import type { TallyEndpoints } from '..';
import { makeTallyRequest } from '../client';
import { safeDbDelete, safeDbUpsert, toSubmissionRecord } from '../utils';
import type { TallyEndpointOutputs } from './types';

export const list: TallyEndpoints['submissionsList'] = async (ctx, input) => {
	const { formId, ...queryParams } = input;
	const query: Record<string, string | number | boolean | undefined> = {};
	if (queryParams.page !== undefined) query.page = queryParams.page;
	if (queryParams.limit !== undefined) query.limit = queryParams.limit;
	if (queryParams.filter !== undefined) query.filter = queryParams.filter;
	if (queryParams.startDate !== undefined)
		query.startDate = queryParams.startDate;
	if (queryParams.endDate !== undefined) query.endDate = queryParams.endDate;
	if (queryParams.afterId !== undefined) query.afterId = queryParams.afterId;

	const result = await makeTallyRequest<
		TallyEndpointOutputs['submissionsList']
	>(`forms/${formId}/submissions`, ctx.key, { method: 'GET', query });

	if (result.submissions) {
		for (const submission of result.submissions) {
			await safeDbUpsert(
				ctx.db.submissions,
				submission.id,
				toSubmissionRecord(submission),
				'submission',
			);
		}
	}

	await logEventFromContext(
		ctx,
		'tally.submissions.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: TallyEndpoints['submissionsGet'] = async (ctx, input) => {
	const result = await makeTallyRequest<TallyEndpointOutputs['submissionsGet']>(
		`forms/${input.formId}/submissions/${input.submissionId}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	if (result.submission?.id) {
		await safeDbUpsert(
			ctx.db.submissions,
			result.submission.id,
			toSubmissionRecord(result.submission),
			'submission',
		);
	}

	await logEventFromContext(
		ctx,
		'tally.submissions.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteSubmission: TallyEndpoints['submissionsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeTallyRequest<
		TallyEndpointOutputs['submissionsDelete']
	>(`forms/${input.formId}/submissions/${input.submissionId}`, ctx.key, {
		method: 'DELETE',
	});

	await safeDbDelete(ctx.db.submissions, input.submissionId, 'submission');

	await logEventFromContext(
		ctx,
		'tally.submissions.delete',
		{ ...input },
		'completed',
	);
	return result;
};
