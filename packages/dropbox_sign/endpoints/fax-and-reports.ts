import { logEventFromContext } from 'corsair/core';
import { makeDropboxSignRequest } from '../client';
import type { DropboxSignEndpoints } from '../index';
import type { DropboxSignEndpointOutputs } from './types';

export const listFaxes: DropboxSignEndpoints['listFaxes'] = async (ctx, input) => {
	const result = await makeDropboxSignRequest<DropboxSignEndpointOutputs['listFaxes']>(
		'fax/list',
		ctx.key,
		{ method: 'GET', query: input, authType: ctx.authType },
	);
	await logEventFromContext(ctx, 'dropbox_sign.fax.list', input ?? {}, 'completed');
	return result;
};

export const deleteFax: DropboxSignEndpoints['deleteFax'] = async (ctx, input) => {
	const { fax_id } = input;
	const result = await makeDropboxSignRequest<DropboxSignEndpointOutputs['deleteFax']>(
		ax/,
		ctx.key,
		{ method: 'DELETE', authType: ctx.authType },
	);
	await logEventFromContext(ctx, 'dropbox_sign.fax.delete', { fax_id }, 'completed');
	return result;
};

export const listFaxLines: DropboxSignEndpoints['listFaxLines'] = async (ctx, input) => {
	const result = await makeDropboxSignRequest<DropboxSignEndpointOutputs['listFaxLines']>(
		'fax_line/list',
		ctx.key,
		{ method: 'GET', query: input, authType: ctx.authType },
	);
	await logEventFromContext(ctx, 'dropbox_sign.faxLine.list', input ?? {}, 'completed');
	return result;
};

export const getFaxLineAreaCodes: DropboxSignEndpoints['getFaxLineAreaCodes'] = async (ctx, input) => {
	const result = await makeDropboxSignRequest<DropboxSignEndpointOutputs['getFaxLineAreaCodes']>(
		'fax_line/area_codes',
		ctx.key,
		{ method: 'GET', query: input, authType: ctx.authType },
	);
	await logEventFromContext(ctx, 'dropbox_sign.faxLine.getAreaCodes', input, 'completed');
	return result;
};

export const createReport: DropboxSignEndpoints['createReport'] = async (ctx, input) => {
	const result = await makeDropboxSignRequest<DropboxSignEndpointOutputs['createReport']>(
		'report/create',
		ctx.key,
		{ method: 'POST', body: input, authType: ctx.authType },
	);
	await logEventFromContext(ctx, 'dropbox_sign.report.create', input, 'completed');
	return result;
};
