import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import { withPagination } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const relations: BetterstackEndpoints['catalogRelations'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['catalogRelations']
	>('/api/v2/catalog/relations', ctx.key, {
		method: 'GET',
		query: withPagination(input),
	});

	await logEventFromContext(
		ctx,
		'betterstack.catalog.relations',
		auditPayload(input, []),
		'completed',
	);
	return result;
};
