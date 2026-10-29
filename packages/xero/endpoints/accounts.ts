import { logEventFromContext } from 'corsair/core';
import { makeXeroRequest } from '../client';
import type { XeroEndpoints } from '../index';
import type { XeroEndpointOutputs } from './types';

export const get: XeroEndpoints['accountsGet'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, accountId } = input;
	const response = await makeXeroRequest<XeroEndpointOutputs['accountsGet']>(
		`Accounts/${accountId}`,
		ctx.key,
		{
			method: 'GET',
			tenantId,
		},
	);

	if (response.Accounts?.[0]?.AccountID && ctx.db?.accounts) {
		try {
			await ctx.db.accounts.upsertByEntityId(
				response.Accounts[0].AccountID,
				response.Accounts[0],
			);
		} catch (error) {
			console.warn('Failed to save account to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'xero.accounts.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: XeroEndpoints['accountsList'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, page, where, order } = input;
	const query: Record<string, string | number | undefined> = {};
	if (page !== undefined) query.page = page;
	if (where) query.where = where;
	if (order) query.order = order;

	const response = await makeXeroRequest<XeroEndpointOutputs['accountsList']>(
		'Accounts',
		ctx.key,
		{
			method: 'GET',
			query,
			tenantId,
		},
	);

	if (response.Accounts && ctx.db?.accounts) {
		try {
			for (const account of response.Accounts) {
				await ctx.db.accounts.upsertByEntityId(account.AccountID, account);
			}
		} catch (error) {
			console.warn('Failed to save accounts to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'xero.accounts.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const Accounts = {
	get,
	list,
};
