import { logEventFromContext } from 'corsair/core';
import type { GristEndpoints } from '..';
import { makeGristRequest } from '../client';
import { GristEndpointInputSchemas, GristEndpointOutputSchemas } from './types';

export const list: GristEndpoints['attachments.list'] = async (ctx, input) => {
	const parsedInput =
		GristEndpointInputSchemas['attachments.list'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/attachments`,
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['attachments.list'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.attachments.list',
		{ docId: parsedInput.docId, count: parsed.records.length },
		'completed',
	);
	return parsed;
};

export const get: GristEndpoints['attachments.get'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['attachments.get'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const attIdStr = encodeURIComponent(String(parsedInput.attachmentId));
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/attachments/${attIdStr}`,
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['attachments.get'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.attachments.get',
		{ docId: parsedInput.docId, attachmentId: parsedInput.attachmentId },
		'completed',
	);
	return parsed;
};

export const removeUnused: GristEndpoints['attachments.removeUnused'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GristEndpointInputSchemas['attachments.removeUnused'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/attachments/removeUnused`,
		ctx.key,
		{
			method: 'POST',
			query:
				parsedInput.verify !== undefined
					? { verify: parsedInput.verify }
					: undefined,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		GristEndpointOutputSchemas['attachments.removeUnused'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.attachments.removeUnused',
		{ docId: parsedInput.docId },
		'completed',
	);
	return parsed;
};

export const updateUsed: GristEndpoints['attachments.updateUsed'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GristEndpointInputSchemas['attachments.updateUsed'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/attachments/updateUsed`,
		ctx.key,
		{
			method: 'POST',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		GristEndpointOutputSchemas['attachments.updateUsed'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.attachments.updateUsed',
		{ docId: parsedInput.docId },
		'completed',
	);
	return parsed;
};

export const verifyFiles: GristEndpoints['attachments.verifyFiles'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GristEndpointInputSchemas['attachments.verifyFiles'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/attachments/verifyFiles`,
		ctx.key,
		{
			method: 'POST',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		GristEndpointOutputSchemas['attachments.verifyFiles'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.attachments.verifyFiles',
		{ docId: parsedInput.docId },
		'completed',
	);
	return parsed;
};

export const getTransferStatus: GristEndpoints['attachments.getTransferStatus'] =
	async (ctx, input) => {
		const parsedInput =
			GristEndpointInputSchemas['attachments.getTransferStatus'].parse(input);
		const docIdStr = encodeURIComponent(parsedInput.docId);
		const response = await makeGristRequest<unknown>(
			`/docs/${docIdStr}/attachments/transferStatus`,
			ctx.key,
			{
				method: 'GET',
				baseUrl: ctx.options?.baseUrl,
			},
		);
		const parsed =
			GristEndpointOutputSchemas['attachments.getTransferStatus'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'grist.attachments.getTransferStatus',
			{ docId: parsedInput.docId },
			'completed',
		);
		return parsed;
	};
