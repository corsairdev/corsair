import { encodeGiftUpPathId, makeGiftUpRequest } from '../client';
import type { GiftUpContext } from '../index';
import type {
	ReportsGetTransactionInput,
	ReportsListTransactionsInput,
	ReportsListTransactionsResponse,
	ReportTransaction,
} from './types';
import {
	ReportsGetTransactionInputSchema,
	ReportsListTransactionsInputSchema,
	ReportsListTransactionsResponseSchema,
	ReportTransactionSchema,
} from './types';

/**
 * Gift Up's reference shows the list key as `tranasctions` in its example and
 * `transactions` in the property table; accept either.
 */
// `unknown` because the raw response is checked before key access
function normalizeTransactionsEnvelope(response: unknown): unknown {
	if (
		typeof response === 'object' &&
		response !== null &&
		!Array.isArray(response) &&
		!('transactions' in response) &&
		'tranasctions' in response
	) {
		const { tranasctions, ...rest } = response;
		return { ...rest, transactions: tranasctions };
	}
	return response;
}

export const Reports = {
	listTransactions: async (
		ctx: GiftUpContext,
		input: ReportsListTransactionsInput,
	): Promise<ReportsListTransactionsResponse> => {
		const parsed = ReportsListTransactionsInputSchema.parse(input);
		// `unknown` because the envelope is normalized below before validation
		const response = await makeGiftUpRequest<unknown>(
			'/reports/transactions',
			ctx.key,
			{
				method: 'GET',
				query: parsed,
				testMode: ctx.options?.testMode,
			},
		);
		return ReportsListTransactionsResponseSchema.parse(
			normalizeTransactionsEnvelope(response),
		);
	},
	getTransaction: async (
		ctx: GiftUpContext,
		input: ReportsGetTransactionInput,
	): Promise<ReportTransaction> => {
		const parsed = ReportsGetTransactionInputSchema.parse(input);
		const response = await makeGiftUpRequest<ReportTransaction>(
			`/reports/transactions/${encodeGiftUpPathId(parsed.id)}`,
			ctx.key,
			{
				method: 'GET',
				testMode: ctx.options?.testMode,
			},
		);
		return ReportTransactionSchema.parse(response);
	},
};
