import { logEventFromContext } from 'corsair/core';
import type { LexofficeEndpoints } from '..';
import { makeLexofficeRequest } from '../client';
import type {
	ResourceMutationResponse,
	VoucherDetails,
	VouchersListResponse,
} from './types';
import {
	LexofficeEndpointInputSchemas,
	LexofficeEndpointOutputSchemas,
} from './types';

export const list: LexofficeEndpoints['vouchersList'] = async (ctx, input) => {
	const parsedInput = LexofficeEndpointInputSchemas.vouchersList.parse(input);
	const response = await makeLexofficeRequest<VouchersListResponse>(
		'/voucherlist',
		ctx.key,
		{
			method: 'GET',
			query: {
				voucherType:
					'salesinvoice,salescreditnote,purchaseinvoice,purchasecreditnote',
				voucherStatus: 'any',
				...parsedInput,
			},
		},
	);
	const parsed = LexofficeEndpointOutputSchemas.vouchersList.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.vouchers.list',
		{ count: parsed.content.length },
		'completed',
	);
	return parsed;
};

export const get: LexofficeEndpoints['vouchersGet'] = async (ctx, input) => {
	const parsedInput = LexofficeEndpointInputSchemas.vouchersGet.parse(input);
	const response = await makeLexofficeRequest<VoucherDetails>(
		`/vouchers/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed = LexofficeEndpointOutputSchemas.vouchersGet.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.vouchers.get',
		{ voucherId: parsedInput.id },
		'completed',
	);
	return parsed;
};

export const create: LexofficeEndpoints['vouchersCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = LexofficeEndpointInputSchemas.vouchersCreate.parse(input);
	const response = await makeLexofficeRequest<ResourceMutationResponse>(
		'/vouchers',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);
	const parsed = LexofficeEndpointOutputSchemas.vouchersCreate.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.vouchers.create',
		{ voucherId: parsed.id },
		'completed',
	);
	return parsed;
};

export const update: LexofficeEndpoints['vouchersUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput = LexofficeEndpointInputSchemas.vouchersUpdate.parse(input);
	const { id, ...body } = parsedInput;
	const response = await makeLexofficeRequest<ResourceMutationResponse>(
		`/vouchers/${encodeURIComponent(id)}`,
		ctx.key,
		{ method: 'PUT', body },
	);
	const parsed = LexofficeEndpointOutputSchemas.vouchersUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.vouchers.update',
		{ voucherId: id },
		'completed',
	);
	return parsed;
};

export const attachFile: LexofficeEndpoints['vouchersAttachFile'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LexofficeEndpointInputSchemas.vouchersAttachFile.parse(input);
	const file = new File(
		[Buffer.from(parsedInput.file, 'base64')],
		parsedInput.fileName,
		{ type: parsedInput.contentType },
	);
	const response = await makeLexofficeRequest<{ id: string }>(
		`/vouchers/${encodeURIComponent(parsedInput.id)}/files`,
		ctx.key,
		{ method: 'POST', formData: { file } },
	);
	const parsed =
		LexofficeEndpointOutputSchemas.vouchersAttachFile.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.vouchers.attachFile',
		{ voucherId: parsedInput.id, fileId: parsed.id },
		'completed',
	);
	return parsed;
};
