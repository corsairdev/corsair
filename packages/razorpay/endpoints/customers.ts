import type { EventLoggingContext } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeRazorpayRequest } from '../client';
import type { CustomersCreateInput, CustomersGetInput, RazorpayEndpointOutputs } from './types';

// Context type is defined inline to avoid a circular dependency with the
// main index.ts, which imports this file via the endpoints barrel.
export interface CustomerCtx extends EventLoggingContext {
	key: string;
	db: Record<string, { upsertByEntityId: (id: string, data: Record<string, unknown>) => Promise<unknown> } | undefined>;
}

export const create = async (ctx: CustomerCtx, input: CustomersCreateInput): Promise<RazorpayEndpointOutputs['customersCreate']> => {
	const result = await makeRazorpayRequest<RazorpayEndpointOutputs['customersCreate']>(
		'customers',
		ctx.key,
		{ method: 'POST', body: input },
	);

	if (result.id && ctx.db.customers) {
		try {
			await ctx.db.customers.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created_at
					? new Date(result.created_at * 1000)
					: undefined,
			});
		} catch (error) {
			console.warn('Failed to save Razorpay customer to database:', error);
		}
	}

	await logEventFromContext(ctx, 'razorpay.customers.create', { ...input }, 'completed');
	return result;
};

export const get = async (ctx: CustomerCtx, input: CustomersGetInput): Promise<RazorpayEndpointOutputs['customersGet']> => {
	const result = await makeRazorpayRequest<RazorpayEndpointOutputs['customersGet']>(
		`customers/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.id && ctx.db.customers) {
		try {
			await ctx.db.customers.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created_at
					? new Date(result.created_at * 1000)
					: undefined,
			});
		} catch (error) {
			console.warn('Failed to save Razorpay customer to database:', error);
		}
	}

	await logEventFromContext(ctx, 'razorpay.customers.get', { ...input }, 'completed');
	return result;
};
