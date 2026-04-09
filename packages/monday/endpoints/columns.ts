import { logEventFromContext } from 'corsair/core';
import type { MondayEndpoints } from '..';
import { makeMondayRequest } from '../client';
import type { MondayEndpointOutputs } from './types';

export const list: MondayEndpoints['columnsList'] = async (ctx, input) => {
	const result = await makeMondayRequest<MondayEndpointOutputs['columnsList']>(
		`query($boardId: ID!) {
			boards(ids: [$boardId]) {
				columns {
					id
					title
					type
					settings_str
					description
				}
			}
		}`,
		ctx.key,
		{ boardId: input.board_id },
	);

	await logEventFromContext(
		ctx,
		'monday.columns.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: MondayEndpoints['columnsCreate'] = async (ctx, input) => {
	const result = await makeMondayRequest<
		MondayEndpointOutputs['columnsCreate']
	>(
		`mutation($boardId: ID!, $title: String!, $columnType: ColumnType, $description: String) {
			create_column(board_id: $boardId, title: $title, column_type: $columnType, description: $description) {
				id
				title
			}
		}`,
		ctx.key,
		{
			boardId: input.board_id,
			title: input.title,
			columnType: input.column_type,
			description: input.description,
		},
	);

	await logEventFromContext(
		ctx,
		'monday.columns.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const changeValue: MondayEndpoints['columnsChangeValue'] = async (
	ctx,
	input,
) => {
	const result = await makeMondayRequest<
		MondayEndpointOutputs['columnsChangeValue']
	>(
		`mutation($boardId: ID!, $itemId: ID!, $columnId: String!, $value: JSON!) {
			change_column_value(board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
				id
			}
		}`,
		ctx.key,
		{
			boardId: input.board_id,
			itemId: input.item_id,
			columnId: input.column_id,
			value: input.value,
		},
	);

	await logEventFromContext(
		ctx,
		'monday.columns.changeValue',
		{ ...input },
		'completed',
	);
	return result;
};
