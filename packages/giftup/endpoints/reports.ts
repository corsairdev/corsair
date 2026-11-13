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

export const Reports = {
	listTransactions: async (
		ctx: GiftUpContext,
		input: ReportsListTransactionsInput,
	): Promise<ReportsListTransactionsResponse> => {
		const parsed = ReportsListTransactionsInputSchema.parse(input);
		const response = await makeGiftUpRequest<ReportsListTransactionsResponse>(
			'/reports/transactions',
			ctx.key,
			{
				method: 'GET',
				query: parsed,
				testMode: ctx.options?.testMode,
			},
		);
		return ReportsListTransactionsResponseSchema.parse(response);
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
