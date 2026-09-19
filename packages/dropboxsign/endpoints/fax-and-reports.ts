import { logEventFromContext } from 'corsair/core';
import { makeDropboxSignRequest } from '../client';
import type { DropboxSignEndpoints } from '../index';
import type { DropboxSignEndpointOutputs } from './types';

export const listFaxes: DropboxSignEndpoints['listFaxes'] = async (
	ctx,
	input,
) => {
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['listFaxes']
	>('fax/list', ctx, {
		method: 'GET',
		query: input,
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.fax.list',
		input ?? {},
		'completed',
	);
	return result;
};

export const deleteFax: DropboxSignEndpoints['deleteFax'] = async (
	ctx,
	input,
) => {
	const { fax_id } = input;
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['deleteFax']
	>(`fax/${encodeURIComponent(fax_id)}`, ctx, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.fax.delete',
		{ fax_id },
		'completed',
	);
	return result;
};

export const listFaxLines: DropboxSignEndpoints['listFaxLines'] = async (
	ctx,
	input,
) => {
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['listFaxLines']
	>('fax_line/list', ctx, {
		method: 'GET',
		query: input,
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.faxLine.list',
		input ?? {},
		'completed',
	);
	return result;
};

export const getFaxLineAreaCodes: DropboxSignEndpoints['getFaxLineAreaCodes'] =
	async (ctx, input) => {
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['getFaxLineAreaCodes']
		>('fax_line/area_codes', ctx, {
			method: 'GET',
			query: input,
		});
		await logEventFromContext(
			ctx,
			'dropboxsign.faxLine.getAreaCodes',
			input,
			'completed',
		);
		return result;
	};

export const createReport: DropboxSignEndpoints['createReport'] = async (
	ctx,
	input,
) => {
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['createReport']
	>('report/create', ctx, {
		method: 'POST',
		body: input,
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.report.create',
		input,
		'completed',
	);
	return result;
};
