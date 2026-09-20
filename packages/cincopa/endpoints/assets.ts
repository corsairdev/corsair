import { logEventFromContext } from 'corsair/core';
import { makeCincopaRequest } from '../client';
import type { CincopaContext } from '../index';
import {
	CincopaEndpointInputSchemas,
	CincopaEndpointOutputSchemas,
} from './types';

export const uploadFromUrl = async (
	ctx: CincopaContext & { key: string },
	input: unknown,
) => {
	const parsed = CincopaEndpointInputSchemas.uploadFromUrl.parse(input);

	const raw = await makeCincopaRequest<unknown>(
		'asset.upload_from_url.json',
		ctx.key,
		{
			method: 'POST',
			query: {
				input: parsed.input,
				fid: parsed.fid,
				rid: parsed.rid,
				type: parsed.type,
			},
		},
	);

	const response = CincopaEndpointOutputSchemas.uploadFromUrl.parse(raw);

	await logEventFromContext(
		ctx,
		'cincopa.asset.uploadFromUrl',
		{ fid: parsed.fid, rid: parsed.rid },
		'completed',
	);
	return response;
};

export const getUploadFromUrlStatus = async (
	ctx: CincopaContext & { key: string },
	input: unknown,
) => {
	const parsed =
		CincopaEndpointInputSchemas.getUploadFromUrlStatus.parse(input);

	const raw = await makeCincopaRequest<unknown>(
		'asset.upload_from_url_get_status.json',
		ctx.key,
		{
			method: 'GET',
			query: { status_id: parsed.statusId },
		},
	);

	const response =
		CincopaEndpointOutputSchemas.getUploadFromUrlStatus.parse(raw);

	await logEventFromContext(
		ctx,
		'cincopa.asset.getUploadFromUrlStatus',
		{ statusId: parsed.statusId },
		'completed',
	);
	return response;
};

export const abortUploadFromUrl = async (
	ctx: CincopaContext & { key: string },
	input: unknown,
) => {
	const parsed = CincopaEndpointInputSchemas.abortUploadFromUrl.parse(input);

	const raw = await makeCincopaRequest<unknown>(
		'asset.upload_from_url_abort.json',
		ctx.key,
		{
			method: 'POST',
			query: { status_id: parsed.statusId },
		},
	);

	const response = CincopaEndpointOutputSchemas.abortUploadFromUrl.parse(raw);

	await logEventFromContext(
		ctx,
		'cincopa.asset.abortUploadFromUrl',
		{ statusId: parsed.statusId },
		'completed',
	);
	return response;
};
