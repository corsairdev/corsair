import { logEventFromContext } from 'corsair/core';
import type { RazorpayEndpoints } from '..';
import { makeRazorpayRequest } from '../client';
import type { RazorpayEndpointOutputs } from './types';

export const list: RazorpayEndpoints['subscriptionsList'] = async (
	ctx,
	input,
) => {
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['subscriptionsList']
	>('subscriptions', ctx.key, {
		method: 'GET',
		query: input,
	});

	if (ctx.db.subscriptions) {
		for (const subscription of result.items) {
			try {
				await ctx.db.subscriptions.upsertByEntityId(subscription.id, {
					...subscription,
					createdAt: subscription.created_at
						? new Date(subscription.created_at * 1000)
						: undefined,
				});
			} catch (error) {
				console.warn(
					'Failed to save Razorpay subscription to database:',
					error,
				);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'razorpay.subscriptions.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: RazorpayEndpoints['subscriptionsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['subscriptionsGet']
	>(`subscriptions/${input.id}`, ctx.key, { method: 'GET' });

	if (result.id && ctx.db.subscriptions) {
		try {
			await ctx.db.subscriptions.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created_at
					? new Date(result.created_at * 1000)
					: undefined,
			});
		} catch (error) {
			console.warn('Failed to save Razorpay subscription to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'razorpay.subscriptions.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: RazorpayEndpoints['subscriptionsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['subscriptionsCreate']
	>('subscriptions', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (result.id && ctx.db.subscriptions) {
		try {
			await ctx.db.subscriptions.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created_at
					? new Date(result.created_at * 1000)
					: undefined,
			});
		} catch (error) {
			console.warn('Failed to save Razorpay subscription to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'razorpay.subscriptions.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: RazorpayEndpoints['subscriptionsUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['subscriptionsUpdate']
	>(`subscriptions/${id}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	if (result.id && ctx.db.subscriptions) {
		try {
			await ctx.db.subscriptions.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created_at
					? new Date(result.created_at * 1000)
					: undefined,
			});
		} catch (error) {
			console.warn('Failed to save Razorpay subscription to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'razorpay.subscriptions.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const cancel: RazorpayEndpoints['subscriptionsCancel'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['subscriptionsCancel']
	>(`subscriptions/${id}/cancel`, ctx.key, {
		method: 'POST',
		body,
	});

	if (result.id && ctx.db.subscriptions) {
		try {
			await ctx.db.subscriptions.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created_at
					? new Date(result.created_at * 1000)
					: undefined,
			});
		} catch (error) {
			console.warn('Failed to save Razorpay subscription to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'razorpay.subscriptions.cancel',
		{ ...input },
		'completed',
	);
	return result;
};

export const pause: RazorpayEndpoints['subscriptionsPause'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['subscriptionsPause']
	>(`subscriptions/${id}/pause`, ctx.key, {
		method: 'POST',
		body,
	});

	if (result.id && ctx.db.subscriptions) {
		try {
			await ctx.db.subscriptions.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created_at
					? new Date(result.created_at * 1000)
					: undefined,
			});
		} catch (error) {
			console.warn('Failed to save Razorpay subscription to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'razorpay.subscriptions.pause',
		{ ...input },
		'completed',
	);
	return result;
};

export const resume: RazorpayEndpoints['subscriptionsResume'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['subscriptionsResume']
	>(`subscriptions/${id}/resume`, ctx.key, {
		method: 'POST',
		body,
	});

	if (result.id && ctx.db.subscriptions) {
		try {
			await ctx.db.subscriptions.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created_at
					? new Date(result.created_at * 1000)
					: undefined,
			});
		} catch (error) {
			console.warn('Failed to save Razorpay subscription to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'razorpay.subscriptions.resume',
		{ ...input },
		'completed',
	);
	return result;
};
