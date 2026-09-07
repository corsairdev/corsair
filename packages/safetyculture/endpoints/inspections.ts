import { logEventFromContext } from 'corsair/core';
import { makeSafetyCultureRequest } from '../client';
import type { SafetyCultureEndpoints } from '..';
import type { InspectionsListResponse } from './types';

export const list: SafetyCultureEndpoints['inspectionsList'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};

	if (input.template && input.template.length > 0) {
		query.template = input.template.join(',');
	}
	if (input.modified_after) query.modified_after = input.modified_after;
	if (input.modified_before) query.modified_before = input.modified_before;
	if (input.completed) query.completed = input.completed;
	if (input.archived) query.archived = input.archived;
	if (input.owner) query.owner = input.owner;
	if (input.limit) query.limit = input.limit;
	if (input.modified_after_cursor)
		query.modified_after = input.modified_after_cursor;

	const response =
		await makeSafetyCultureRequest<InspectionsListResponse>(
			'audits/search',
			ctx.key,
			{ method: 'GET', query },
		);

	await logEventFromContext(
		ctx,
		'safetyculture.inspections.list',
		{ resultCount: response.audits?.length ?? 0 },
		'completed',
	);

	return response;
};

export const get: SafetyCultureEndpoints['inspectionsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeSafetyCultureRequest<
		import('./types').InspectionGetResponse
	>(`audits/${input.audit_id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'safetyculture.inspections.get',
		{ audit_id: input.audit_id },
		'completed',
	);

	return response;
};
