import { logEventFromContext } from 'corsair/core';
import type { HandwryttenEndpoints } from '..';
import { makeHandwryttenRequest } from '../client';
import type {
	QrCodesCreateResponse,
	QrCodesDashboardResponse,
	QrCodesDeleteResponse,
	QrCodesFramesResponse,
	QrCodesListResponse,
} from './types';
import {
	HandwryttenEndpointInputSchemas,
	HandwryttenEndpointOutputSchemas,
} from './types';

export const list: HandwryttenEndpoints['qrCodes.list'] = async (
	ctx,
	input,
) => {
	HandwryttenEndpointInputSchemas['qrCodes.list'].parse(input);
	const response = await makeHandwryttenRequest<QrCodesListResponse>(
		'/qrCode',
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['qrCodes.list'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.qrCodes.list',
		{ count: parsed.list?.length ?? 0 },
		'completed',
	);
	return parsed;
};

export const create: HandwryttenEndpoints['qrCodes.create'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HandwryttenEndpointInputSchemas['qrCodes.create'].parse(input);
	const response = await makeHandwryttenRequest<QrCodesCreateResponse>(
		'/qrCode',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['qrCodes.create'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.qrCodes.create',
		{ qrCodeId: parsed.id },
		'completed',
	);
	return parsed;
};

export const deleteQrCode: HandwryttenEndpoints['qrCodes.delete'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HandwryttenEndpointInputSchemas['qrCodes.delete'].parse(input);
	const response = await makeHandwryttenRequest<QrCodesDeleteResponse>(
		`/qrCode/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['qrCodes.delete'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.qrCodes.delete',
		{ qrCodeId: parsedInput.id },
		'completed',
	);
	return parsed;
};

export const dashboard: HandwryttenEndpoints['qrCodes.dashboard'] = async (
	ctx,
	input,
) => {
	HandwryttenEndpointInputSchemas['qrCodes.dashboard'].parse(input);
	const response = await makeHandwryttenRequest<QrCodesDashboardResponse>(
		'/qrCode/dashboard',
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['qrCodes.dashboard'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.qrCodes.dashboard',
		{ totalScans: parsed.total_scans },
		'completed',
	);
	return parsed;
};

export const frames: HandwryttenEndpoints['qrCodes.frames'] = async (
	ctx,
	input,
) => {
	HandwryttenEndpointInputSchemas['qrCodes.frames'].parse(input);
	const response = await makeHandwryttenRequest<QrCodesFramesResponse>(
		'/qrCode/frames',
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['qrCodes.frames'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.qrCodes.frames',
		{},
		'completed',
	);
	return parsed;
};
