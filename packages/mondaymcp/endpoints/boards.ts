import { logEventFromContext } from 'corsair/core';
import type { MondayMcpEndpoints } from '..';
import { makeMondayMcpToolCall } from '../client';
import {
	MondayMcpEndpointInputSchemas,
	MondayMcpEndpointOutputSchemas,
} from './types';

// Boards & Items family: create_board, get_board_info, get_board_items_page,
// get_board_activity, board_insights, create_group, create_column,
// get_column_type_info, create_item, change_item_column_values.
export const boardsCreate: MondayMcpEndpoints['boards.create'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['boards.create'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'create_board', parsed);
	const output = MondayMcpEndpointOutputSchemas['boards.create'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.boards.create',
		{ ...parsed },
		'completed',
	);
	return output;
};

export const boardsGetInfo: MondayMcpEndpoints['boards.getInfo'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['boards.getInfo'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'get_board_info', parsed);
	const output = MondayMcpEndpointOutputSchemas['boards.getInfo'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.boards.getInfo',
		{ ...parsed },
		'completed',
	);
	return output;
};

export const boardsGetItemsPage: MondayMcpEndpoints['boards.getItemsPage'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['boards.getItemsPage'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'get_board_items_page',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['boards.getItemsPage'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.boards.getItemsPage',
			{ ...parsed },
			'completed',
		);
		return output;
	};

export const boardsGetActivity: MondayMcpEndpoints['boards.getActivity'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['boards.getActivity'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'get_board_activity',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['boards.getActivity'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.boards.getActivity',
			{ ...parsed },
			'completed',
		);
		return output;
	};

export const boardsInsights: MondayMcpEndpoints['boards.insights'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['boards.insights'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'board_insights', parsed);
	const output =
		MondayMcpEndpointOutputSchemas['boards.insights'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.boards.insights',
		{ ...parsed },
		'completed',
	);
	return output;
};

export const groupsCreate: MondayMcpEndpoints['groups.create'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['groups.create'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'create_group', parsed);
	const output = MondayMcpEndpointOutputSchemas['groups.create'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.groups.create',
		{ ...parsed },
		'completed',
	);
	return output;
};

export const columnsCreate: MondayMcpEndpoints['columns.create'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['columns.create'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'create_column', parsed);
	const output = MondayMcpEndpointOutputSchemas['columns.create'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.columns.create',
		{ ...parsed },
		'completed',
	);
	return output;
};

export const columnsGetTypeInfo: MondayMcpEndpoints['columns.getTypeInfo'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['columns.getTypeInfo'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'get_column_type_info',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['columns.getTypeInfo'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.columns.getTypeInfo',
			{ ...parsed },
			'completed',
		);
		return output;
	};

export const itemsCreate: MondayMcpEndpoints['items.create'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['items.create'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'create_item', parsed);
	const output = MondayMcpEndpointOutputSchemas['items.create'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.items.create',
		{ ...parsed },
		'completed',
	);
	return output;
};

export const itemsChangeColumnValues: MondayMcpEndpoints['items.changeColumnValues'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['items.changeColumnValues'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'change_item_column_values',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['items.changeColumnValues'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.items.changeColumnValues',
			{ ...parsed },
			'completed',
		);
		return output;
	};
