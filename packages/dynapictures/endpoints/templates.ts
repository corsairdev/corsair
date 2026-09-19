import { logEventFromContext } from 'corsair/core';
import { makeDynapicturesRequest } from '../client';
import type { DynapicturesEndpoints } from '../index';
import { ListTemplatesResponseSchema } from './types';

export const listTemplates: DynapicturesEndpoints['listTemplates'] = async (
	ctx,
) => {
	const response = await makeDynapicturesRequest<unknown>(
		'/templates',
		ctx.key,
		{ method: 'GET' },
	);
	const parsed = ListTemplatesResponseSchema.parse(response);
	await logEventFromContext(
		ctx,
		'dynapictures.templates.list',
		{ count: parsed.length },
		'completed',
	);
	return parsed;
};
