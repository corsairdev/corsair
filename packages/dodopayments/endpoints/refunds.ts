import { logEventFromContext } from 'corsair/core';
import type { DodoPaymentsEndpoints } from '..';
import { makeDodoPaymentsRequest } from '../client';
import type { DodoPaymentsEndpointOutputs } from './types';

export const create: DodoPaymentsEndpoints['refundsCreate'] = async (ctx, input) => {
	const result = await makeDodoPaymentsRequest<
		DodoPaymentsEndpointOutputs['refundsCreate']
	>('refunds', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (result.id && ctx.db.refunds) {
		try {
			await ctx.db.refunds.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created_at ? new Date(result.created_at) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save Dodo refund to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'dodopayments.refunds.create',
		{ ...input },
		'completed',
	);
	return result;
};
