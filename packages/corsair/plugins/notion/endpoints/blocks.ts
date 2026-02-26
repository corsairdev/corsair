import { logEventFromContext } from '../../utils/events';
import type { NotionEndpoints } from '..';
import { makeNotionRequest } from '../client';
import type { NotionEndpointOutputs } from './types';

export const appendBlock: NotionEndpoints['blocksAppendBlock'] = async (
	ctx,
	input,
) => {
	const result = await makeNotionRequest<
		NotionEndpointOutputs['blocksAppendBlock']
	>(`v1/blocks/${input.block_id}/children`, ctx.key, {
		method: 'PATCH',
		body: {
			children: input.children,
		},
	});

	await logEventFromContext(
		ctx,
		'notion.blocks.appendBlock',
		{ ...input },
		'completed',
	);
	return result;
};

export const getManyChildBlocks: NotionEndpoints['blocksGetManyChildBlocks'] =
	async (ctx, input) => {
		const result = await makeNotionRequest<
			NotionEndpointOutputs['blocksGetManyChildBlocks']
		>(`v1/blocks/${input.block_id}/children`, ctx.key, {
			method: 'GET',
			query: {
				start_cursor: input.start_cursor,
				page_size: input.page_size,
			},
		});

		await logEventFromContext(
			ctx,
			'notion.blocks.getManyChildBlocks',
			{ ...input },
			'completed',
		);
		return result;
	};
