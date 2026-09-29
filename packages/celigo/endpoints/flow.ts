import { logEventFromContext } from 'corsair/core';
import type { CeligoEndpoints } from '..';
import { makeCeligoRequest } from '../client';
import {
	CeligoEndpointInputSchemas,
	CeligoEndpointOutputSchemas,
} from './types';

export const getFlow: CeligoEndpoints['getFlow'] = async (ctx, input) => {
	const parsed = CeligoEndpointInputSchemas.getFlow.parse(input);

	const raw = await makeCeligoRequest<unknown>(
		`flows/${encodeURIComponent(parsed.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const response = CeligoEndpointOutputSchemas.getFlow.parse(raw);

	await logEventFromContext(ctx, 'celigo.flow.get', { ...parsed }, 'completed');

	return response;
};
