import { logEventFromContext } from 'corsair/core';
import type { MondayEndpoints } from '..';
import { makeMondayRequest } from '../client';
import type { MondayEndpointOutputs } from './types';

export const list: MondayEndpoints['updatesList'] = async (ctx, input) => {
	const result = await makeMondayRequest<MondayEndpointOutputs['updatesList']>(
		`query($itemId: ID!, $limit: Int, $page: Int) {
			items(ids: [$itemId]) {
				updates(limit: $limit, page: $page) {
					id
					body
					text_body
					created_at
					creator {
						id
						name
					}
					replies {
						id
						body
					}
				}
			}
		}`,
		ctx.key,
		{
			itemId: input.item_id,
			limit: input.limit,
			page: input.page,
		},
	);

	await logEventFromContext(
		ctx,
		'monday.updates.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: MondayEndpoints['updatesCreate'] = async (ctx, input) => {
	const result = await makeMondayRequest<
		MondayEndpointOutputs['updatesCreate']
	>(
		`mutation($itemId: ID!, $body: String!) {
			create_update(item_id: $itemId, body: $body) {
				id
				body
			}
		}`,
		ctx.key,
		{
			itemId: input.item_id,
			body: input.body,
		},
	);

	await logEventFromContext(
		ctx,
		'monday.updates.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteupdate: MondayEndpoints['updatesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeMondayRequest<
		MondayEndpointOutputs['updatesDelete']
	>(
		`mutation($updateId: ID!) {
			delete_update(id: $updateId) {
				id
			}
		}`,
		ctx.key,
		{ updateId: input.update_id },
	);

	await logEventFromContext(
		ctx,
		'monday.updates.delete',
		{ ...input },
		'completed',
	);
	return result;
};
