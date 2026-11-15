import type { TaveEndpoints } from '..';
import { call, callDelete } from './call';
import {
	PaymentsCreateInputSchema,
	PaymentsCreateResponseSchema,
	PaymentsGetInputSchema,
	PaymentsGetResponseSchema,
	PaymentsListInputSchema,
	PaymentsListResponseSchema,
	PaymentsRemoveInputSchema,
	PaymentsUpdateInputSchema,
	PaymentsUpdateResponseSchema,
	ProductsCreateInputSchema,
	ProductsCreateResponseSchema,
	ProductsGetInputSchema,
	ProductsGetResponseSchema,
	ProductsListInputSchema,
	ProductsListResponseSchema,
	ProductsRemoveInputSchema,
	ProductsUpdateInputSchema,
	ProductsUpdateResponseSchema,
} from './types';

export const paymentsList: TaveEndpoints['paymentsList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'payments.list',
			input: PaymentsListInputSchema,
			output: PaymentsListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/payment',
			query: {
				page: parsed.page,
				pageSize: parsed.pageSize,
				sortBy: parsed.sortBy,
			},
		}),
	);
};

export const paymentsGet: TaveEndpoints['paymentsGet'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'payments.get',
			input: PaymentsGetInputSchema,
			output: PaymentsGetResponseSchema,
		},
		input,
		(parsed) => ({ method: 'GET', path: `/payment/${parsed.paymentId}` }),
	);
};

export const paymentsCreate: TaveEndpoints['paymentsCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'payments.create',
			input: PaymentsCreateInputSchema,
			output: PaymentsCreateResponseSchema,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/payment', body: parsed }),
	);
};

export const paymentsUpdate: TaveEndpoints['paymentsUpdate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'payments.update',
			input: PaymentsUpdateInputSchema,
			output: PaymentsUpdateResponseSchema,
		},
		input,
		(parsed) => {
			const { paymentId, ...changes } = parsed;
			return { method: 'PUT', path: `/payment/${paymentId}`, body: changes };
		},
	);
};

export const paymentsRemove: TaveEndpoints['paymentsRemove'] = async (
	ctx,
	input,
) => {
	return callDelete(
		ctx,
		{ event: 'payments.remove', input: PaymentsRemoveInputSchema },
		input,
		(parsed) => ({ method: 'DELETE', path: `/payment/${parsed.paymentId}` }),
	);
};

export const productsList: TaveEndpoints['productsList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'products.list',
			input: ProductsListInputSchema,
			output: ProductsListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/product',
			// No page or pageSize: the route documents only sortBy.
			query: { sortBy: parsed.sortBy },
		}),
	);
};

export const productsGet: TaveEndpoints['productsGet'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'products.get',
			input: ProductsGetInputSchema,
			output: ProductsGetResponseSchema,
		},
		input,
		(parsed) => ({ method: 'GET', path: `/product/${parsed.productId}` }),
	);
};

export const productsCreate: TaveEndpoints['productsCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'products.create',
			input: ProductsCreateInputSchema,
			output: ProductsCreateResponseSchema,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/product', body: parsed }),
	);
};

export const productsUpdate: TaveEndpoints['productsUpdate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'products.update',
			input: ProductsUpdateInputSchema,
			output: ProductsUpdateResponseSchema,
		},
		input,
		(parsed) => {
			const { productId, ...changes } = parsed;
			return { method: 'PUT', path: `/product/${productId}`, body: changes };
		},
	);
};

export const productsRemove: TaveEndpoints['productsRemove'] = async (
	ctx,
	input,
) => {
	return callDelete(
		ctx,
		{ event: 'products.remove', input: ProductsRemoveInputSchema },
		input,
		(parsed) => ({ method: 'DELETE', path: `/product/${parsed.productId}` }),
	);
};
