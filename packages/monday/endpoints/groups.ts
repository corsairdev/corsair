import { logEventFromContext } from 'corsair/core';
import type { MondayEndpoints } from '..';
import { makeMondayRequest } from '../client';
import type { MondayEndpointOutputs } from './types';

export const list: MondayEndpoints['groupsList'] = async (ctx, input) => {
	const result = await makeMondayRequest<MondayEndpointOutputs['groupsList']>(
		`query($boardId: ID!) {
			boards(ids: [$boardId]) {
				groups {
					id
					title
					color
					position
					archived
				}
			}
		}`,
		ctx.key,
		{ boardId: input.board_id },
	);

	await logEventFromContext(
		ctx,
		'monday.groups.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: MondayEndpoints['groupsCreate'] = async (ctx, input) => {
	const result = await makeMondayRequest<MondayEndpointOutputs['groupsCreate']>(
		`mutation($boardId: ID!, $groupName: String!, $position: String) {
			create_group(board_id: $boardId, group_name: $groupName, position: $position) {
				id
				title
			}
		}`,
		ctx.key,
		{
			boardId: input.board_id,
			groupName: input.group_name,
			position: input.position,
		},
	);

	await logEventFromContext(
		ctx,
		'monday.groups.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: MondayEndpoints['groupsUpdate'] = async (ctx, input) => {
	const result = await makeMondayRequest<MondayEndpointOutputs['groupsUpdate']>(
		`mutation($boardId: ID!, $groupId: String!, $groupAttribute: GroupAttributes!, $newValue: String!) {
			update_group(board_id: $boardId, group_id: $groupId, group_attribute: $groupAttribute, new_value: $newValue) {
				id
			}
		}`,
		ctx.key,
		{
			boardId: input.board_id,
			groupId: input.group_id,
			groupAttribute: input.group_attribute,
			newValue: input.new_value,
		},
	);

	await logEventFromContext(
		ctx,
		'monday.groups.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deletegroup: MondayEndpoints['groupsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeMondayRequest<MondayEndpointOutputs['groupsDelete']>(
		`mutation($boardId: ID!, $groupId: String!) {
			delete_group(board_id: $boardId, group_id: $groupId) {
				id
			}
		}`,
		ctx.key,
		{
			boardId: input.board_id,
			groupId: input.group_id,
		},
	);

	await logEventFromContext(
		ctx,
		'monday.groups.delete',
		{ ...input },
		'completed',
	);
	return result;
};
