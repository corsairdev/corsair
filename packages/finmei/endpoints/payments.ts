import { makeFinmeiRequest } from '../client';
import type { FinmeiEndpoints } from '../index';
import { compactQuery, safeLog, seg } from './shared';
import type {
	FinmeiDeleteResponse,
	FinmeiPaginationMeta,
	FinmeiPayment,
} from './types';
import {
	FinmeiDeleteResponseSchema,
	FinmeiListPaymentsOutputSchema,
	FinmeiPaymentOutputSchema,
} from './types';

export const list: FinmeiEndpoints['paymentsList'] = async (ctx, input) => {
	const query = compactQuery({
		page: input.page,
		per_page: input.per_page,
		limit: input.limit,
		offset: input.offset,
		status: input.status,
		start_date: input.start_date,
		end_date: input.end_date,
	});

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiPayment[];
		meta?: FinmeiPaginationMeta;
	}>('/payments', ctx.key, {
		method: 'GET',
		query,
	});

	const parsed = FinmeiListPaymentsOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'payments.list', {
		count: parsed.data.length,
		page: input.page ?? 1,
	});
	return parsed;
};

export const create: FinmeiEndpoints['paymentsCreate'] = async (ctx, input) => {
	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiPayment;
	}>('/payments', ctx.key, {
		method: 'POST',
		body: input,
	});

	const parsed = FinmeiPaymentOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'payments.create', {
		id: parsed.data.id,
		amount: parsed.data.amount,
		currency: parsed.data.currency,
	});
	return parsed;
};

export const get: FinmeiEndpoints['paymentsGet'] = async (ctx, input) => {
	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiPayment;
	}>(`/payments/${seg(input.id)}`, ctx.key, {
		method: 'GET',
	});

	const parsed = FinmeiPaymentOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'payments.get', {
		id: input.id,
	});
	return parsed;
};

export const del: FinmeiEndpoints['paymentsDelete'] = async (ctx, input) => {
	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<FinmeiDeleteResponse>(
		`/payments/${seg(input.id)}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	const parsed = FinmeiDeleteResponseSchema.parse(rawResponse);
	await safeLog(ctx, 'payments.delete', {
		id: input.id,
	});
	return parsed;
};

export const Payments = {
	list,
	create,
	get,
	delete: del,
};
