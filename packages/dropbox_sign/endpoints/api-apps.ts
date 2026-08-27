import { logEventFromContext } from 'corsair/core';
import { makeDropboxSignRequest } from '../client';
import type { DropboxSignEndpoints } from '../index';
import type { DropboxSignEndpointOutputs } from './types';

export const getApiApp: DropboxSignEndpoints['getApiApp'] = async (ctx, input) => {
	const { client_id } = input;
	const result = await makeDropboxSignRequest<DropboxSignEndpointOutputs['getApiApp']>(
		pi_app/,
		ctx.key,
		{ method: 'GET', authType: ctx.authType },
	);
	await logEventFromContext(ctx, 'dropbox_sign.apiApp.get', { client_id }, 'completed');
	return result;
};

export const listApiApps: DropboxSignEndpoints['listApiApps'] = async (ctx, input) => {
	const result = await makeDropboxSignRequest<DropboxSignEndpointOutputs['listApiApps']>(
		'api_app/list',
		ctx.key,
		{ method: 'GET', query: input, authType: ctx.authType },
	);
	await logEventFromContext(ctx, 'dropbox_sign.apiApp.list', input ?? {}, 'completed');
	return result;
};

export const createApiApp: DropboxSignEndpoints['createApiApp'] = async (ctx, input) => {
	const result = await makeDropboxSignRequest<DropboxSignEndpointOutputs['createApiApp']>(
		'api_app',
		ctx.key,
		{ method: 'POST', body: input, authType: ctx.authType },
	);
	await logEventFromContext(ctx, 'dropbox_sign.apiApp.create', { name: input.name }, 'completed');
	return result;
};

export const updateApiApp: DropboxSignEndpoints['updateApiApp'] = async (ctx, input) => {
	const { client_id, ...body } = input;
	const result = await makeDropboxSignRequest<DropboxSignEndpointOutputs['updateApiApp']>(
		pi_app/,
		ctx.key,
		{ method: 'POST', body, authType: ctx.authType },
	);
	await logEventFromContext(ctx, 'dropbox_sign.apiApp.update', { client_id }, 'completed');
	return result;
};

export const deleteApiApp: DropboxSignEndpoints['deleteApiApp'] = async (ctx, input) => {
	const { client_id } = input;
	const result = await makeDropboxSignRequest<DropboxSignEndpointOutputs['deleteApiApp']>(
		pi_app/,
		ctx.key,
		{ method: 'DELETE', authType: ctx.authType },
	);
	await logEventFromContext(ctx, 'dropbox_sign.apiApp.delete', { client_id }, 'completed');
	return result;
};

export const oAuthAuthorize: DropboxSignEndpoints['oAuthAuthorize'] = async (ctx, input) => {
	const { client_id, response_type = 'code', state } = input;
	const query = new URLSearchParams({ client_id, response_type });
	if (state) query.set('state', state);
	const url = https://app.hellosign.com/oauth/authorize?;
	await logEventFromContext(ctx, 'dropbox_sign.oauth.authorize', { client_id }, 'completed');
	return { url };
};
