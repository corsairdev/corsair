import { logEventFromContext } from 'corsair/core';
import type { StripeEndpoints } from '..';
import { makeStripeRequest } from '../client';
import type { StripeEndpointOutputs } from './types';

export const create: StripeEndpoints['chargesCreate'] = async (ctx, input) => {
	const result = await makeStripeRequest<
		StripeEndpointOutputs['chargesCreate']
	>('charges', ctx.key, {
		method: 'POST',
		body: { ...input },
	});

	if (result.id && ctx.db.charges) {
		try {
			await ctx.db.charges.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created ? new Date(result.created * 1000) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save new charge to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'stripe.charges.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: StripeEndpoints['chargesGet'] = async (ctx, input) => {
	const { id } = input;
	const result = await makeStripeRequest<StripeEndpointOutputs['chargesGet']>(
		`charges/${id}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.id && ctx.db.charges) {
		try {
			await ctx.db.charges.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created ? new Date(result.created * 1000) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save charge to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'stripe.charges.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: StripeEndpoints['chargesList'] = async (ctx, input) => {
	const result = await makeStripeRequest<StripeEndpointOutputs['chargesList']>(
		'charges',
		ctx.key,
		{
			method: 'GET',
			query: { ...input },
		},
	);

	if (result.data && ctx.db.charges) {
		try {
			for (const charge of result.data) {
				await ctx.db.charges.upsertByEntityId(charge.id, {
					...charge,
					createdAt: charge.created
						? new Date(charge.created * 1000)
						: undefined,
				});
			}
		} catch (error) {
			console.warn('Failed to save charges to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'stripe.charges.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: StripeEndpoints['chargesUpdate'] = async (ctx, input) => {
	const { id, ...body } = input;
	const result = await makeStripeRequest<
		StripeEndpointOutputs['chargesUpdate']
	>(`charges/${id}`, ctx.key, {
		method: 'POST',
		body: { ...body },
	});

	if (result.id && ctx.db.charges) {
		try {
			await ctx.db.charges.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created ? new Date(result.created * 1000) : undefined,
			});
		} catch (error) {
			console.warn('Failed to update charge in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'stripe.charges.update',
		{ ...input },
		'completed',
	);
	return result;
};
