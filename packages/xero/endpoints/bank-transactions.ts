import { logEventFromContext } from 'corsair/core';
import { makeXeroRequest } from '../client';
import type { XeroEndpoints } from '../index';
import type { XeroEndpointOutputs } from './types';

export const create: XeroEndpoints['bankTransactionsCreate'] = async (
	ctx,
	input,
) => {
	const { tenantId = ctx.options.tenantId, ...data } = input;
	const response = await makeXeroRequest<
		XeroEndpointOutputs['bankTransactionsCreate']
	>('BankTransactions', ctx.key, {
		method: 'PUT',
		body: { BankTransactions: [data] },
		tenantId,
	});

	if (
		response.BankTransactions?.[0]?.BankTransactionID &&
		ctx.db?.bankTransactions
	) {
		try {
			await ctx.db.bankTransactions.upsertByEntityId(
				response.BankTransactions[0].BankTransactionID,
				response.BankTransactions[0],
			);
		} catch (error) {
			console.warn('Failed to save bank transaction to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'xero.bankTransactions.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: XeroEndpoints['bankTransactionsList'] = async (
	ctx,
	input,
) => {
	const {
		tenantId = ctx.options.tenantId,
		page,
		where,
		order,
		bankAccountID,
	} = input;
	const query: Record<string, string | number | undefined> = {};
	if (page !== undefined) query.page = page;
	if (where) query.where = where;
	if (order) query.order = order;
	if (bankAccountID) query.BankAccountID = bankAccountID;

	const response = await makeXeroRequest<
		XeroEndpointOutputs['bankTransactionsList']
	>('BankTransactions', ctx.key, {
		method: 'GET',
		query,
		tenantId,
	});

	if (response.BankTransactions && ctx.db?.bankTransactions) {
		try {
			for (const tx of response.BankTransactions) {
				await ctx.db.bankTransactions.upsertByEntityId(
					tx.BankTransactionID,
					tx,
				);
			}
		} catch (error) {
			console.warn('Failed to save bank transactions to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'xero.bankTransactions.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const BankTransactions = {
	create,
	list,
};
