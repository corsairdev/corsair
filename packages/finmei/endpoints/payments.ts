import { makeFinmeiRequest } from '../client';
import type { FinmeiEndpoints } from '../index';
import { compactQuery, safeLog, seg } from './shared';
import type {
	FinmeiDeleteResponse,
	FinmeiPaginationMeta,
	FinmeiPayment,
} from './types';
import {
	FinmeiCreatePaymentInputSchema,
	FinmeiDeletePaymentInputSchema,
	FinmeiDeleteResponseSchema,
	FinmeiGetPaymentInputSchema,
	FinmeiListPaymentsInputSchema,
	FinmeiListPaymentsOutputSchema,
	FinmeiPaymentOutputSchema,
} from './types';

export const list: FinmeiEndpoints['paymentsList'] = async (ctx, input) => {
	const parsedInput = FinmeiListPaymentsInputSchema.parse(input);
	const query = compactQuery({
		page: parsedInput.page,
		per_page: parsedInput.per_page,
		limit: parsedInput.limit,
		offset: parsedInput.offset,
		status: parsedInput.status,
		start_date: parsedInput.start_date,
		end_date: parsedInput.end_date,
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
		page: parsedInput.page ?? 1,
	});
	return parsed;
};

export const create: FinmeiEndpoints['paymentsCreate'] = async (ctx, input) => {
	const parsedInput = FinmeiCreatePaymentInputSchema.parse(input);

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiPayment;
	}>('/payments', ctx.key, {
		method: 'POST',
		body: parsedInput,
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
	const parsedInput = FinmeiGetPaymentInputSchema.parse(input);

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiPayment;
	}>(`/payments/${seg(parsedInput.id)}`, ctx.key, {
		method: 'GET',
	});

	const parsed = FinmeiPaymentOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'payments.get', {
		id: parsedInput.id,
	});
	return parsed;
};

export const del: FinmeiEndpoints['paymentsDelete'] = async (ctx, input) => {
	const parsedInput = FinmeiDeletePaymentInputSchema.parse(input);

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<FinmeiDeleteResponse>(
		`/payments/${seg(parsedInput.id)}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	const parsed = FinmeiDeleteResponseSchema.parse(rawResponse);
	await safeLog(ctx, 'payments.delete', {
		id: parsedInput.id,
	});
	return parsed;
};

export const Payments = {
	list,
	create,
	get,
	delete: del,
};
