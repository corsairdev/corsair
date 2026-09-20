import { logEventFromContext } from 'corsair/core';
import type { UnioneEndpoints } from '..';
import { makeUnioneRequest } from '../client';
import { maybeUpsert } from '../db';
import type { UnioneEndpointOutputs } from './types';

export const list: UnioneEndpoints['tag']['list'] = async (ctx) => {
	const response = await makeUnioneRequest<UnioneEndpointOutputs['tagList']>(
		'tag/list.json',
		ctx.key,
		{ body: {} },
	);

	for (const tag of response.tags ?? []) {
		await maybeUpsert(ctx.db.tags, tag.tag_id, {
			tag_id: tag.tag_id,
			tag: tag.tag,
		});
	}
	await logEventFromContext(ctx, 'unione.tag.list', {}, 'completed');
	return response;
};

export const remove: UnioneEndpoints['tag']['delete'] = async (ctx, input) => {
	const response = await makeUnioneRequest<UnioneEndpointOutputs['tagDelete']>(
		'tag/delete.json',
		ctx.key,
		{ body: { tag_id: input.tag_id } },
	);

	await logEventFromContext(
		ctx,
		'unione.tag.delete',
		{ ...input },
		'completed',
	);
	return response;
};
