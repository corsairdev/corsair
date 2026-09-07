import { logEventFromContext } from 'corsair/core';
import { makeSafetyCultureRequest } from '../client';
import type { SafetyCultureEndpoints } from '..';
import type { ActionsListResponse } from './types';

export const list: SafetyCultureEndpoints['actionsList'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};

	if (input.status) query.status = input.status;
	if (input.assignee) query.assignee = input.assignee;
	if (input.created_after) query.created_after = input.created_after;
	if (input.created_before) query.created_before = input.created_before;
	if (input.modified_after) query.modified_after = input.modified_after;
	if (input.due_after) query.due_after = input.due_after;
	if (input.due_before) query.due_before = input.due_before;
	if (input.limit) query.limit = input.limit;
	if (input.offset !== undefined) query.offset = input.offset;

	const response =
		await makeSafetyCultureRequest<ActionsListResponse>(
			'actions/search',
			ctx.key,
			{ method: 'GET', query },
		);

	await logEventFromContext(
		ctx,
		'safetyculture.actions.list',
		{ resultCount: response.actions?.length ?? 0 },
		'completed',
	);

	return response;
};
