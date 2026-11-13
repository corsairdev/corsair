import { makeFinmeiRequest } from '../client';
import type { FinmeiEndpoints } from '../index';
import { compactQuery, safeLog, seg } from './shared';
import type {
	FinmeiCustomer,
	FinmeiDeleteResponse,
	FinmeiPaginationMeta,
} from './types';
import {
	FinmeiCreateCustomerInputSchema,
	FinmeiCustomerOutputSchema,
	FinmeiDeleteCustomerInputSchema,
	FinmeiDeleteResponseSchema,
	FinmeiGetCustomerInputSchema,
	FinmeiListCustomersInputSchema,
	FinmeiListCustomersOutputSchema,
	FinmeiUpdateCustomerInputSchema,
} from './types';

export const list: FinmeiEndpoints['customersList'] = async (ctx, input) => {
	const parsedInput = FinmeiListCustomersInputSchema.parse(input);
	const query = compactQuery({
		page: parsedInput.page,
		per_page: parsedInput.per_page,
		search: parsedInput.search,
		sort: parsedInput.sort,
	});

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiCustomer[];
		meta?: FinmeiPaginationMeta;
	}>('/customers', ctx.key, {
		method: 'GET',
		query,
	});

	const parsed = FinmeiListCustomersOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'customers.list', {
		count: parsed.data.length,
		page: parsedInput.page ?? 1,
	});
	return parsed;
};

export const create: FinmeiEndpoints['customersCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = FinmeiCreateCustomerInputSchema.parse(input);

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiCustomer;
	}>('/customers', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});

	const parsed = FinmeiCustomerOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'customers.create', {
		id: parsed.data.id,
	});
	return parsed;
};

export const get: FinmeiEndpoints['customersGet'] = async (ctx, input) => {
	const parsedInput = FinmeiGetCustomerInputSchema.parse(input);

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiCustomer;
	}>(`/customers/${seg(parsedInput.id)}`, ctx.key, {
		method: 'GET',
	});

	const parsed = FinmeiCustomerOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'customers.get', {
		id: parsedInput.id,
	});
	return parsed;
};

export const update: FinmeiEndpoints['customersUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput = FinmeiUpdateCustomerInputSchema.parse(input);
	const { id, ...bodyFields } = parsedInput;

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiCustomer;
	}>(`/customers/${seg(id)}`, ctx.key, {
		method: 'PUT',
		body: bodyFields,
	});

	const parsed = FinmeiCustomerOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'customers.update', {
		id,
	});
	return parsed;
};

export const del: FinmeiEndpoints['customersDelete'] = async (ctx, input) => {
	const parsedInput = FinmeiDeleteCustomerInputSchema.parse(input);

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<FinmeiDeleteResponse>(
		`/customers/${seg(parsedInput.id)}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	const parsed = FinmeiDeleteResponseSchema.parse(rawResponse);
	await safeLog(ctx, 'customers.delete', {
		id: parsedInput.id,
	});
	return parsed;
};

export const Customers = {
	list,
	create,
	get,
	update,
	delete: del,
};
