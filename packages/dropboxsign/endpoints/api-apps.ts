import { logEventFromContext } from 'corsair/core';
import { makeDropboxSignRequest } from '../client';
import type { DropboxSignEndpoints } from '../index';
import type { DropboxSignEndpointOutputs } from './types';

export const getApiApp: DropboxSignEndpoints['getApiApp'] = async (
	ctx,
	input,
) => {
	const { client_id } = input;
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['getApiApp']
	>(`api_app/${encodeURIComponent(client_id)}`, ctx, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.apiApp.get',
		{ client_id },
		'completed',
	);
	return result;
};

export const listApiApps: DropboxSignEndpoints['listApiApps'] = async (
	ctx,
	input,
) => {
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['listApiApps']
	>('api_app/list', ctx, {
		method: 'GET',
		query: input,
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.apiApp.list',
		input ?? {},
		'completed',
	);
	return result;
};

export const createApiApp: DropboxSignEndpoints['createApiApp'] = async (
	ctx,
	input,
) => {
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['createApiApp']
	>('api_app', ctx, {
		method: 'POST',
		body: input,
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.apiApp.create',
		{ name: input.name },
		'completed',
	);
	return result;
};

export const updateApiApp: DropboxSignEndpoints['updateApiApp'] = async (
	ctx,
	input,
) => {
	const { client_id, ...body } = input;
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['updateApiApp']
	>(`api_app/${encodeURIComponent(client_id)}`, ctx, {
		method: 'PUT',
		body,
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.apiApp.update',
		{ client_id },
		'completed',
	);
	return result;
};

export const deleteApiApp: DropboxSignEndpoints['deleteApiApp'] = async (
	ctx,
	input,
) => {
	const { client_id } = input;
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['deleteApiApp']
	>(`api_app/${encodeURIComponent(client_id)}`, ctx, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.apiApp.delete',
		{ client_id },
		'completed',
	);
	return result;
};

export const oAuthAuthorize: DropboxSignEndpoints['oAuthAuthorize'] = async (
	ctx,
	input,
) => {
	const { client_id, response_type = 'code', state } = input;
	const query = new URLSearchParams({ client_id, response_type });
	if (state) query.set('state', state);
	const url = `https://app.hellosign.com/oauth/authorize?${query.toString()}`;
	await logEventFromContext(
		ctx,
		'dropboxsign.oauth.authorize',
		{ client_id },
		'completed',
	);
	return { url };
};
