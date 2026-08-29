import { logEventFromContext } from 'corsair/core';
import type { DynapicturesEndpoints } from '..';
import { makeDynapicturesRequest } from '../client';
import type { ListTemplatesResponse } from './types';

export const list: DynapicturesEndpoints['listTemplates'] = async (
	ctx,
	input,
) => {
	const response = await makeDynapicturesRequest<ListTemplatesResponse>(
		'/templates',
		ctx.key,
		{
			method: 'GET',
			query: input?.workspaceId
				? { workspaceId: input.workspaceId }
				: undefined,
		},
	);
	await logEventFromContext(
		ctx,
		'dynapictures.templates.list',
		input ?? {},
		'completed',
	);
	return response;
};
