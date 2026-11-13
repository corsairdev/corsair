import { logEventFromContext } from 'corsair/core';
import type { MondayMcpEndpoints } from '..';
import { makeMondayMcpToolCall } from '../client';
import { safeEventPayload } from '../safe-event';
import {
	MondayMcpEndpointInputSchemas,
	MondayMcpEndpointOutputSchemas,
} from './types';

// Sprints & raw API family: get_monday_dev_sprints_boards, get_sprints_metadata,
// get_sprint_summary, all_monday_api, get_graphql_schema, get_type_details.
export const sprintsGetBoards: MondayMcpEndpoints['sprints.getBoards'] = async (
	ctx,
	input,
) => {
	const parsed =
		MondayMcpEndpointInputSchemas['sprints.getBoards'].parse(input);
	const result = await makeMondayMcpToolCall(
		ctx.key,
		'get_monday_dev_sprints_boards',
		parsed,
	);
	const output =
		MondayMcpEndpointOutputSchemas['sprints.getBoards'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.sprints.getBoards',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const sprintsGetMetadata: MondayMcpEndpoints['sprints.getMetadata'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['sprints.getMetadata'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'get_sprints_metadata',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['sprints.getMetadata'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.sprints.getMetadata',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};

export const sprintsGetSummary: MondayMcpEndpoints['sprints.getSummary'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['sprints.getSummary'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'get_sprint_summary',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['sprints.getSummary'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.sprints.getSummary',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};

export const apiExecuteQuery: MondayMcpEndpoints['schema.executeQuery'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['schema.executeQuery'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'all_monday_api',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['schema.executeQuery'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.api.executeQuery',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};

export const apiGetGraphqlSchema: MondayMcpEndpoints['schema.getGraphqlSchema'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['schema.getGraphqlSchema'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'get_graphql_schema',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['schema.getGraphqlSchema'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.api.getGraphqlSchema',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};

export const apiGetTypeDetails: MondayMcpEndpoints['schema.getTypeDetails'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['schema.getTypeDetails'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'get_type_details',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['schema.getTypeDetails'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.api.getTypeDetails',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};
