import { logEventFromContext } from 'corsair/core';
import type { CastingwordsEndpoints } from '..';
import { makeCastingwordsRequest } from '../../client';
import { CastingwordsEndpointOutputSchemas } from '../types';

export const getPrepayBalance: CastingwordsEndpoints['getPrepayBalance'] = async (ctx) => {
	const response = await makeCastingwordsRequest<unknown>('prepay_balance', ctx.key);
	const parsed = CastingwordsEndpointOutputSchemas.getPrepayBalance.parse(response);
	await logEventFromContext(ctx, 'castingwords.get_prepay_balance', {}, 'completed');
	return parsed;
};
