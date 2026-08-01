import { logEventFromContext } from 'corsair/core';
import type { DatabricksEndpoints } from '..';
import { makeDatabricksRequest } from '../client';
import { safeEncode } from '../utils';

export const createGenieMessage: DatabricksEndpoints['createGenieMessage'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{
			message_id?: string;
			status?: string;
		}>(
			`genie/spaces/${safeEncode(input.space_id)}/conversations/${safeEncode(input.conversation_id)}/messages`,
			ctx,
			{ method: 'POST', body: { content: input.content } },
		);

		await logEventFromContext(
			ctx,
			'databricks.dashboards.create_genie_message',
			input,
			'completed',
		);
		return response;
	};

export const createGenieSpace: DatabricksEndpoints['createGenieSpace'] = async (
	ctx,
	input,
) => {
	const response = await makeDatabricksRequest<{ space_id: string }>(
		'genie/spaces',
		ctx,
		{ method: 'POST', body: input },
	);

	await logEventFromContext(
		ctx,
		'databricks.dashboards.create_genie_space',
		input,
		'completed',
	);
	return response;
};

export const createLakeviewDashboard: DatabricksEndpoints['createLakeviewDashboard'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ dashboard_id?: string }>(
			'lakeview/dashboards',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.dashboards.create_lakeview_dashboard',
			input,
			'completed',
		);
		return response;
	};

export const deleteGenieConversation: DatabricksEndpoints['deleteGenieConversation'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`genie/spaces/${safeEncode(input.space_id)}/conversations/${safeEncode(input.conversation_id)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.dashboards.delete_genie_conversation',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteGenieConversationMessage: DatabricksEndpoints['deleteGenieConversationMessage'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`genie/spaces/${safeEncode(input.space_id)}/conversations/${safeEncode(input.conversation_id)}/messages/${safeEncode(input.message_id)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.dashboards.delete_genie_message',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteLakeviewDashboardSchedule: DatabricksEndpoints['deleteLakeviewDashboardSchedule'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`lakeview/dashboards/${safeEncode(input.dashboard_id)}/schedules/${safeEncode(input.schedule_id)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.dashboards.delete_lakeview_schedule',
			input,
			'completed',
		);
		return { success: true };
	};
