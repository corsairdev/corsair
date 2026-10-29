import { logEventFromContext } from 'corsair/core';
import type { DatabricksEndpoints } from '..';
import { makeDatabricksRequest } from '../client';

export const createCleanRoom: DatabricksEndpoints['createCleanRoom'] = async (
	ctx,
	input,
) => {
	const response = await makeDatabricksRequest<{
		name: string;
		status?: string;
	}>('clean-rooms', ctx, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'databricks.cleanrooms.create_clean_room',
		input,
		'completed',
	);
	return response;
};

export const createCleanRoomAutoApprovalRule: DatabricksEndpoints['createCleanRoomAutoApprovalRule'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ rule_id?: string }>(
			'clean-rooms/auto-approval-rules',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.cleanrooms.create_auto_approval_rule',
			input,
			'completed',
		);
		return response;
	};
