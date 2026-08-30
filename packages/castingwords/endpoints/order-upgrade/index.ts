import { logEventFromContext } from 'corsair/core';
import { makeCastingwordsRequest } from '../../client';
import type { CastingwordsEndpoints } from '..';
import { CastingwordsEndpointOutputSchemas } from '../types';

export const orderUpgrade: CastingwordsEndpoints['orderUpgrade'] = async (
	ctx,
	input,
) => {
	const response = await makeCastingwordsRequest<unknown>(
		`audiofile/${encodeURIComponent(String(input.audiofileId))}/upgrade`,
		ctx.key,
		{
			method: 'POST',
			form: { sku: input.sku, test: input.test ? '1' : undefined },
		},
	);
	const parsed = CastingwordsEndpointOutputSchemas.orderUpgrade.parse(
		typeof response === 'string' ? { message: response } : response,
	);
	await logEventFromContext(
		ctx,
		'castingwords.order_upgrade',
		{ audiofileId: input.audiofileId, sku: input.sku },
		'completed',
	);
	return parsed;
};
