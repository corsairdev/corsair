import { logEventFromContext } from 'corsair/core';
import type { SalesflareEndpoints } from '..';
import { makeSalesflareRequest } from '../client';
import { salesflarePathParameter } from './path';
import type { SalesflareEndpointOutputs } from './types';

export const listAccounts: SalesflareEndpoints['listAccounts'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['listAccounts']
	>(ctx, '/accounts', { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'salesflare.accounts.listAccounts',
		input,
		'completed',
	);
	return response;
};

export const createAccount: SalesflareEndpoints['createAccount'] = async (
	ctx,
	input,
) => {
	const { update_if_exists, ...body } = input;
	const query = { update_if_exists };
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['createAccount']
	>(ctx, '/accounts', { method: 'POST', query: query, body: body });
	await logEventFromContext(
		ctx,
		'salesflare.accounts.createAccount',
		input,
		'completed',
	);
	return response;
};

export const retrieveAccount: SalesflareEndpoints['retrieveAccount'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['retrieveAccount']
	>(
		ctx,
		salesflarePathParameter(
			'/accounts/{account_id}',
			'account_id',
			input.accountId,
		),
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'salesflare.accounts.retrieveAccount',
		input,
		'completed',
	);
	return response;
};

export const updateAccount: SalesflareEndpoints['updateAccount'] = async (
	ctx,
	input,
) => {
	const { accountId, ...body } = input;
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['updateAccount']
	>(
		ctx,
		salesflarePathParameter(
			'/accounts/{account_id}',
			'account_id',
			input.accountId,
		),
		{ method: 'PUT', body: body },
	);
	await logEventFromContext(
		ctx,
		'salesflare.accounts.updateAccount',
		input,
		'completed',
	);
	return response;
};

export const deleteAccount: SalesflareEndpoints['deleteAccount'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['deleteAccount']
	>(
		ctx,
		salesflarePathParameter(
			'/accounts/{account_id}',
			'account_id',
			input.accountId,
		),
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'salesflare.accounts.deleteAccount',
		input,
		'completed',
	);
	return response;
};

export const listAccountMessages: SalesflareEndpoints['listAccountMessages'] =
	async (ctx, input) => {
		const { accountId, ...query } = input;
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['listAccountMessages']
		>(
			ctx,
			salesflarePathParameter(
				'/accounts/{account_id}/messages',
				'account_id',
				input.accountId,
			),
			{ method: 'GET', query: query },
		);
		await logEventFromContext(
			ctx,
			'salesflare.accounts.listAccountMessages',
			input,
			'completed',
		);
		return response;
	};

export const listAccountFeed: SalesflareEndpoints['listAccountFeed'] = async (
	ctx,
	input,
) => {
	const { accountId, ...query } = input;
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['listAccountFeed']
	>(
		ctx,
		salesflarePathParameter(
			'/accounts/{account_id}/feed',
			'account_id',
			input.accountId,
		),
		{ method: 'GET', query: query },
	);
	await logEventFromContext(
		ctx,
		'salesflare.accounts.listAccountFeed',
		input,
		'completed',
	);
	return response;
};

export const addAccountUsers: SalesflareEndpoints['addAccountUsers'] = async (
	ctx,
	input,
) => {
	const { accountId, ...body } = input;
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['addAccountUsers']
	>(
		ctx,
		salesflarePathParameter(
			'/accounts/{account_id}/users',
			'account_id',
			input.accountId,
		),
		{ method: 'POST', body: body },
	);
	await logEventFromContext(
		ctx,
		'salesflare.accounts.addAccountUsers',
		input,
		'completed',
	);
	return response;
};

export const updateAccountUsers: SalesflareEndpoints['updateAccountUsers'] =
	async (ctx, input) => {
		const { accountId, ...body } = input;
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['updateAccountUsers']
		>(
			ctx,
			salesflarePathParameter(
				'/accounts/{account_id}/users',
				'account_id',
				input.accountId,
			),
			{ method: 'PUT', body: body },
		);
		await logEventFromContext(
			ctx,
			'salesflare.accounts.updateAccountUsers',
			input,
			'completed',
		);
		return response;
	};

export const addAccountContacts: SalesflareEndpoints['addAccountContacts'] =
	async (ctx, input) => {
		const { accountId, ...body } = input;
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['addAccountContacts']
		>(
			ctx,
			salesflarePathParameter(
				'/accounts/{account_id}/contacts',
				'account_id',
				input.accountId,
			),
			{ method: 'POST', body: body },
		);
		await logEventFromContext(
			ctx,
			'salesflare.accounts.addAccountContacts',
			input,
			'completed',
		);
		return response;
	};

export const updateAccountContacts: SalesflareEndpoints['updateAccountContacts'] =
	async (ctx, input) => {
		const { accountId, ...body } = input;
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['updateAccountContacts']
		>(
			ctx,
			salesflarePathParameter(
				'/accounts/{account_id}/contacts',
				'account_id',
				input.accountId,
			),
			{ method: 'PUT', body: body },
		);
		await logEventFromContext(
			ctx,
			'salesflare.accounts.updateAccountContacts',
			input,
			'completed',
		);
		return response;
	};
