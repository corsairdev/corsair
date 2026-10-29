import { logEventFromContext } from 'corsair/core';
import { makeAmaraRequest } from '../client';
import type { AmaraEndpoints } from '../index';
import { LanguagesListResponseSchema } from './types';

export const listAvailable: AmaraEndpoints['languagesListAvailable'] = async (
	ctx,
	_input,
) => {
	const raw = await makeAmaraRequest('languages/', ctx.key);
	const response = LanguagesListResponseSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.languages.listAvailable',
		{},
		'completed',
	);
	return response;
};
