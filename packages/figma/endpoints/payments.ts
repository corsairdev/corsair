import { logEventFromContext } from 'corsair/core';
import type { FigmaEndpoints } from '..';
import { makeFigmaRequest } from '../client';
import type { FigmaEndpointOutputs } from './types';

export const get: FigmaEndpoints['paymentsGet'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['paymentsGet']>(
		`v1/payments`,
		ctx.key,
		{ method: 'GET', query: { ...input } },
	);

	await logEventFromContext(
		ctx,
		'figma.payments.get',
		{ ...input },
		'completed',
	);
	return result;
};
