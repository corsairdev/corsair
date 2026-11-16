import type { TaxJarEndpoints } from '..';
import { segment } from '../client';
import { call, callDelete } from './call';
import {
	OrderDeletedSchema,
	OrdersCreateInputSchema,
	OrdersGetInputSchema,
	OrdersListInputSchema,
	OrdersRemoveInputSchema,
	OrdersUpdateInputSchema,
	OrderTransactionResponseSchema,
	RefundDeletedSchema,
	RefundIdsResponseSchema,
	RefundsCreateInputSchema,
	RefundsGetInputSchema,
	RefundsListInputSchema,
	RefundsRemoveInputSchema,
	RefundsUpdateInputSchema,
	RefundTransactionResponseSchema,
	TransactionIdsResponseSchema,
} from './types';

// An order and a refund are the same shape under two paths, so each is written
// out separately; a shared factory would collapse their distinct endpoint
// types.

export const ordersList: TaxJarEndpoints['ordersList'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'orders.list',
			input: OrdersListInputSchema,
			output: TransactionIdsResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/transactions/orders',
			query: {
				transaction_date: parsed.transaction_date,
				from_transaction_date: parsed.from_transaction_date,
				to_transaction_date: parsed.to_transaction_date,
				provider: parsed.provider,
			},
		}),
	);
};

export const ordersCreate: TaxJarEndpoints['ordersCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'orders.create',
			input: OrdersCreateInputSchema,
			output: OrderTransactionResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/transactions/orders',
			body: parsed,
		}),
	);
};

export const ordersGet: TaxJarEndpoints['ordersGet'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'orders.get',
			input: OrdersGetInputSchema,
			output: OrderTransactionResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/transactions/orders/${segment(parsed.transactionId)}`,
			query: { provider: parsed.provider },
		}),
	);
};

export const ordersUpdate: TaxJarEndpoints['ordersUpdate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'orders.update',
			input: OrdersUpdateInputSchema,
			output: OrderTransactionResponseSchema,
		},
		input,
		(parsed) => {
			const { transactionId, ...body } = parsed;
			return {
				method: 'PUT',
				path: `/transactions/orders/${segment(transactionId)}`,
				body,
			};
		},
	);
};

export const ordersRemove: TaxJarEndpoints['ordersRemove'] = async (
	ctx,
	input,
) => {
	return callDelete(
		ctx,
		{
			event: 'orders.remove',
			input: OrdersRemoveInputSchema,
			confirm: OrderDeletedSchema,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/transactions/orders/${segment(parsed.transactionId)}`,
			query: { provider: parsed.provider },
		}),
	);
};

export const refundsList: TaxJarEndpoints['refundsList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'refunds.list',
			input: RefundsListInputSchema,
			// A refund list answers `{ refunds }`, not `{ orders }`.
			output: RefundIdsResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/transactions/refunds',
			query: {
				transaction_date: parsed.transaction_date,
				from_transaction_date: parsed.from_transaction_date,
				to_transaction_date: parsed.to_transaction_date,
				provider: parsed.provider,
			},
		}),
	);
};

export const refundsCreate: TaxJarEndpoints['refundsCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'refunds.create',
			input: RefundsCreateInputSchema,
			output: RefundTransactionResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/transactions/refunds',
			body: parsed,
		}),
	);
};

export const refundsGet: TaxJarEndpoints['refundsGet'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'refunds.get',
			input: RefundsGetInputSchema,
			output: RefundTransactionResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/transactions/refunds/${segment(parsed.transactionId)}`,
			query: { provider: parsed.provider },
		}),
	);
};

export const refundsUpdate: TaxJarEndpoints['refundsUpdate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'refunds.update',
			input: RefundsUpdateInputSchema,
			output: RefundTransactionResponseSchema,
		},
		input,
		(parsed) => {
			const { transactionId, ...body } = parsed;
			return {
				method: 'PUT',
				path: `/transactions/refunds/${segment(transactionId)}`,
				body,
			};
		},
	);
};

export const refundsRemove: TaxJarEndpoints['refundsRemove'] = async (
	ctx,
	input,
) => {
	return callDelete(
		ctx,
		{
			event: 'refunds.remove',
			input: RefundsRemoveInputSchema,
			confirm: RefundDeletedSchema,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/transactions/refunds/${segment(parsed.transactionId)}`,
			query: { provider: parsed.provider },
		}),
	);
};
