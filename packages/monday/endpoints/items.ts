import { logEventFromContext } from 'corsair/core';
import type { MondayEndpoints } from '..';
import { makeMondayRequest } from '../client';
import type { MondayEndpointOutputs } from './types';

export const list: MondayEndpoints['itemsList'] = async (ctx, input) => {
	const result = await makeMondayRequest<MondayEndpointOutputs['itemsList']>(
		`query($boardId: ID!, $limit: Int, $cursor: String) {
			boards(ids: [$boardId]) {
				items_page(limit: $limit, cursor: $cursor) {
					cursor
					items {
						id
						name
						state
						created_at
						creator_id
						group {
							id
							title
						}
						column_values {
							id
							title
							text
							value
							type
						}
					}
				}
			}
		}`,
		ctx.key,
		{
			boardId: input.board_id,
			limit: input.limit,
			cursor: input.cursor,
		},
	);

	await logEventFromContext(
		ctx,
		'monday.items.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: MondayEndpoints['itemsGet'] = async (ctx, input) => {
	const result = await makeMondayRequest<MondayEndpointOutputs['itemsGet']>(
		`query($itemId: ID!) {
			items(ids: [$itemId]) {
				id
				name
				state
				created_at
				creator_id
				board {
					id
				}
				group {
					id
					title
				}
				column_values {
					id
					title
					text
					value
					type
				}
			}
		}`,
		ctx.key,
		{ itemId: input.item_id },
	);

	await logEventFromContext(ctx, 'monday.items.get', { ...input }, 'completed');
	return result;
};

export const create: MondayEndpoints['itemsCreate'] = async (ctx, input) => {
	const result = await makeMondayRequest<MondayEndpointOutputs['itemsCreate']>(
		`mutation($boardId: ID!, $itemName: String!, $groupId: String, $columnValues: JSON) {
			create_item(board_id: $boardId, item_name: $itemName, group_id: $groupId, column_values: $columnValues) {
				id
				name
			}
		}`,
		ctx.key,
		{
			boardId: input.board_id,
			itemName: input.item_name,
			groupId: input.group_id,
			columnValues: input.column_values,
		},
	);

	await logEventFromContext(
		ctx,
		'monday.items.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: MondayEndpoints['itemsUpdate'] = async (ctx, input) => {
	const result = await makeMondayRequest<MondayEndpointOutputs['itemsUpdate']>(
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
		'monday.items.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const move: MondayEndpoints['itemsMove'] = async (ctx, input) => {
	const result = await makeMondayRequest<MondayEndpointOutputs['itemsMove']>(
		`mutation($itemId: ID!, $groupId: String!) {
			move_item_to_group(item_id: $itemId, group_id: $groupId) {
				id
			}
		}`,
		ctx.key,
		{
			itemId: input.item_id,
			groupId: input.group_id,
		},
	);

	await logEventFromContext(
		ctx,
		'monday.items.move',
		{ ...input },
		'completed',
	);
	return result;
};

export const archive: MondayEndpoints['itemsArchive'] = async (ctx, input) => {
	const result = await makeMondayRequest<MondayEndpointOutputs['itemsArchive']>(
		`mutation($itemId: ID!) {
			archive_item(item_id: $itemId) {
				id
			}
		}`,
		ctx.key,
		{ itemId: input.item_id },
	);

	await logEventFromContext(
		ctx,
		'monday.items.archive',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteitem: MondayEndpoints['itemsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeMondayRequest<MondayEndpointOutputs['itemsDelete']>(
		`mutation($itemId: ID!) {
			delete_item(item_id: $itemId) {
				id
			}
		}`,
		ctx.key,
		{ itemId: input.item_id },
	);

	await logEventFromContext(
		ctx,
		'monday.items.delete',
		{ ...input },
		'completed',
	);
	return result;
};
