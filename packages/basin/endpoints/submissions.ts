import { logEventFromContext } from 'corsair/core';
import type { BasinEndpoints } from '..';
import { makeBasinRequest } from '../client';
import { safeDbDelete, safeDbUpsert, toSubmissionRecord } from '../utils';
import type { BasinEndpointOutputs } from './types';

export const list: BasinEndpoints['submissionsList'] = async (
	ctx,
	input = {},
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input?.form_id !== undefined) query.form_id = input.form_id;
	if (input?.filter_by !== undefined) query.filter_by = input.filter_by;
	if (input?.query !== undefined) query.query = input.query;
	if (input?.order_by !== undefined) query.order_by = input.order_by;
	if (input?.date_range !== undefined) query.date_range = input.date_range;
	if (input?.page !== undefined) query.page = input.page;

	const result = await makeBasinRequest<
		BasinEndpointOutputs['submissionsList']
	>('submissions', ctx.key, { method: 'GET', query });

	const submissionsList = Array.isArray(result)
		? result
		: (result as { submissions?: unknown[] }).submissions;

	if (Array.isArray(submissionsList)) {
		for (const sub of submissionsList) {
			if (sub && typeof sub === 'object' && 'id' in sub) {
				await safeDbUpsert(
					ctx.db.submissions,
					(sub as { id: string | number }).id,
					toSubmissionRecord(sub as Parameters<typeof toSubmissionRecord>[0]),
					'submission',
				);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'basin.submissions.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteSubmission: BasinEndpoints['submissionsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeBasinRequest<
		BasinEndpointOutputs['submissionsDelete']
	>(`submissions/${input.id}`, ctx.key, { method: 'DELETE' });

	await safeDbDelete(ctx.db.submissions, input.id, 'submission');

	await logEventFromContext(
		ctx,
		'basin.submissions.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const Submissions = {
	list,
	delete: deleteSubmission,
};
