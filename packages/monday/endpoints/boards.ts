import { logEventFromContext } from 'corsair/core';
import type { MondayEndpoints } from '..';
import { makeMondayRequest } from '../client';
import type { MondayEndpointOutputs } from './types';

export const list: MondayEndpoints['boardsList'] = async (ctx, input) => {
	const result = await makeMondayRequest<MondayEndpointOutputs['boardsList']>(
		`query($limit: Int, $page: Int, $workspaceIds: [ID], $boardKind: BoardKind, $state: State, $orderBy: BoardsOrderBy) {
			boards(limit: $limit, page: $page, workspace_ids: $workspaceIds, board_kind: $boardKind, state: $state, order_by: $orderBy) {
				id
				name
				description
				board_kind
				state
				workspace_id
			}
		}`,
		ctx.key,
		{
			limit: input.limit,
			page: input.page,
			workspaceIds: input.workspace_ids,
			boardKind: input.board_kind,
			state: input.state,
			orderBy: input.order_by,
		},
	);

	await logEventFromContext(
		ctx,
		'monday.boards.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: MondayEndpoints['boardsGet'] = async (ctx, input) => {
	const result = await makeMondayRequest<MondayEndpointOutputs['boardsGet']>(
		`query($boardId: ID!) {
			boards(ids: [$boardId]) {
				id
				name
				description
				board_kind
				state
				workspace_id
				groups {
					id
					title
					color
					position
					archived
				}
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
		'monday.boards.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: MondayEndpoints['boardsCreate'] = async (ctx, input) => {
	const result = await makeMondayRequest<MondayEndpointOutputs['boardsCreate']>(
		`mutation($name: String!, $boardKind: BoardKind!, $workspaceId: ID, $templateId: ID) {
			create_board(board_name: $name, board_kind: $boardKind, workspace_id: $workspaceId, template_id: $templateId) {
				id
				name
			}
		}`,
		ctx.key,
		{
			name: input.board_name,
			boardKind: input.board_kind ?? 'public',
			workspaceId: input.workspace_id,
			templateId: input.template_id,
		},
	);

	await logEventFromContext(
		ctx,
		'monday.boards.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: MondayEndpoints['boardsUpdate'] = async (ctx, input) => {
	const result = await makeMondayRequest<MondayEndpointOutputs['boardsUpdate']>(
		`mutation($boardId: ID!, $boardAttribute: BoardAttributes!, $newValue: String!) {
			update_board(board_id: $boardId, board_attribute: $boardAttribute, new_value: $newValue) {
				id
			}
		}`,
		ctx.key,
		{
			boardId: input.board_id,
			boardAttribute: input.board_attribute,
			newValue: input.new_value,
		},
	);

	await logEventFromContext(
		ctx,
		'monday.boards.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const archive: MondayEndpoints['boardsArchive'] = async (ctx, input) => {
	const result = await makeMondayRequest<
		MondayEndpointOutputs['boardsArchive']
	>(
		`mutation($boardId: ID!) {
			archive_board(board_id: $boardId) {
				id
			}
		}`,
		ctx.key,
		{ boardId: input.board_id },
	);

	await logEventFromContext(
		ctx,
		'monday.boards.archive',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteboard: MondayEndpoints['boardsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeMondayRequest<MondayEndpointOutputs['boardsDelete']>(
		`mutation($boardId: ID!) {
			delete_board(board_id: $boardId) {
				id
			}
		}`,
		ctx.key,
		{ boardId: input.board_id },
	);

	await logEventFromContext(
		ctx,
		'monday.boards.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const duplicate: MondayEndpoints['boardsDuplicate'] = async (
	ctx,
	input,
) => {
	const result = await makeMondayRequest<
		MondayEndpointOutputs['boardsDuplicate']
	>(
		`mutation($boardId: ID!, $duplicateType: DuplicateBoardType, $boardName: String, $workspaceId: ID) {
			duplicate_board(board_id: $boardId, duplicate_type: $duplicateType, board_name: $boardName, workspace_id: $workspaceId) {
				board {
					id
				}
			}
		}`,
		ctx.key,
		{
			boardId: input.board_id,
			duplicateType: input.duplicate_type,
			boardName: input.board_name,
			workspaceId: input.workspace_id,
		},
	);

	await logEventFromContext(
		ctx,
		'monday.boards.duplicate',
		{ ...input },
		'completed',
	);
	return result;
};
