import { logEventFromContext } from 'corsair/core';
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

	if (result.results && ctx.db.blocks) {
		try {
			for (const block of result.results) {
				if (block.id) {
					await ctx.db.blocks.upsertByEntityId(block.id, {
						...block,
						parent_id: input.block_id,
						parent_type: 'block',
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save blocks to database:', error);
		}
	}

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

		if (result.results && ctx.db.blocks) {
			try {
				for (const block of result.results) {
					if (block.id) {
						await ctx.db.blocks.upsertByEntityId(block.id, {
							...block,
							parent_id: input.block_id,
							parent_type: 'block',
						});
					}
				}
			} catch (error) {
				console.warn('Failed to save blocks to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'notion.blocks.getManyChildBlocks',
			{ ...input },
			'completed',
		);
		return result;
	};
