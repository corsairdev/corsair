import { logEventFromContext } from 'corsair/core';
import { makeDropboxSignRequest } from '../client';
import type { DropboxSignEndpoints } from '../index';
import type { DropboxSignEndpointOutputs } from './types';

export const getAccount: DropboxSignEndpoints['getAccount'] = async (
	ctx,
	input,
) => {
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['getAccount']
	>('account', ctx, {
		method: 'GET',
		query: input,
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.account.get',
		input ?? {},
		'completed',
	);
	return result;
};

export const createAccount: DropboxSignEndpoints['createAccount'] = async (
	ctx,
	input,
) => {
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['createAccount']
	>('account/create', ctx, {
		method: 'POST',
		body: input,
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.account.create',
		{ email_address: input.email_address },
		'completed',
	);
	return result;
};

export const updateAccount: DropboxSignEndpoints['updateAccount'] = async (
	ctx,
	input,
) => {
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['updateAccount']
	>('account', ctx, {
		method: 'POST',
		body: input,
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.account.update',
		input,
		'completed',
	);
	return result;
};

export const verifyAccount: DropboxSignEndpoints['verifyAccount'] = async (
	ctx,
	input,
) => {
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['verifyAccount']
	>('account/verify', ctx, {
		method: 'POST',
		body: input,
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.account.verify',
		{ email_address: input.email_address },
		'completed',
	);
	return result;
};
