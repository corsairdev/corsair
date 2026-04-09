import { logEventFromContext } from 'corsair/core';
import type { StripeEndpoints } from '..';
import { makeStripeRequest } from '../client';
import type { StripeEndpointOutputs } from './types';

export const create: StripeEndpoints['sourcesCreate'] = async (ctx, input) => {
	const result = await makeStripeRequest<
		StripeEndpointOutputs['sourcesCreate']
	>('sources', ctx.key, {
		method: 'POST',
		body: { ...input },
	});

	if (result.id && ctx.db.sources) {
		try {
			await ctx.db.sources.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created ? new Date(result.created * 1000) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save new source to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'stripe.sources.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: StripeEndpoints['sourcesGet'] = async (ctx, input) => {
	const { id } = input;
	const result = await makeStripeRequest<StripeEndpointOutputs['sourcesGet']>(
		`sources/${id}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.id && ctx.db.sources) {
		try {
			await ctx.db.sources.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created ? new Date(result.created * 1000) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save source to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'stripe.sources.get',
		{ ...input },
		'completed',
	);
	return result;
};
