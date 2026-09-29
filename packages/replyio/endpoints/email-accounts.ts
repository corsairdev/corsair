import { logEventFromContext } from 'corsair/core';
import { getReplyioConnectUrl, makeReplyioRequest } from '../client';
import type { ReplyioEndpoint, ReplyioEndpointContext } from './context';
import type { ReplyioEndpointOutputs } from './types';

export const list: ReplyioEndpoint<'emailAccountsList'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input?.top !== undefined) query.top = input.top;
	if (input?.skip !== undefined) query.skip = input.skip;
	if (input?.my !== undefined) query.my = input.my;

	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['emailAccountsList']
	>('email-accounts', ctx.key, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'replyio.emailAccounts.list',
		{ top: input?.top, skip: input?.skip },
		'completed',
	);
	return response;
};

export const listDisconnected: ReplyioEndpoint<
	'emailAccountsListDisconnected'
> = async (ctx: ReplyioEndpointContext, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input?.top !== undefined) query.top = input.top;
	if (input?.skip !== undefined) query.skip = input.skip;

	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['emailAccountsListDisconnected']
	>('email-accounts/filter', ctx.key, {
		method: 'POST',
		body: { status: 'disconnected' },
		query,
	});

	await logEventFromContext(
		ctx,
		'replyio.emailAccounts.listDisconnected',
		{ top: input?.top, skip: input?.skip },
		'completed',
	);
	return response;
};

export const update: ReplyioEndpoint<'emailAccountsUpdate'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	const { id, ...body } = input;
	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['emailAccountsUpdate']
	>(`email-accounts/${id}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	await logEventFromContext(
		ctx,
		'replyio.emailAccounts.update',
		{ id: response.id },
		'completed',
	);
	return response;
};

export const deleteEmailAccount: ReplyioEndpoint<
	'emailAccountsDelete'
> = async (ctx: ReplyioEndpointContext, input) => {
	await makeReplyioRequest(`email-accounts/${input.id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'replyio.emailAccounts.delete',
		{ id: input.id },
		'completed',
	);
	return { success: true };
};

export const connectGmail: ReplyioEndpoint<
	'emailAccountsConnectGmail'
> = async (ctx: ReplyioEndpointContext) => {
	const url = await getReplyioConnectUrl(
		'email-accounts/connect/gmail',
		ctx.key,
	);
	await logEventFromContext(
		ctx,
		'replyio.emailAccounts.connectGmail',
		{},
		'completed',
	);
	return { url, provider: 'gmail' };
};

export const connectOffice365: ReplyioEndpoint<
	'emailAccountsConnectOffice365'
> = async (ctx: ReplyioEndpointContext) => {
	const url = await getReplyioConnectUrl(
		'email-accounts/connect/office-365',
		ctx.key,
	);
	await logEventFromContext(
		ctx,
		'replyio.emailAccounts.connectOffice365',
		{},
		'completed',
	);
	return { url, provider: 'office-365' };
};
