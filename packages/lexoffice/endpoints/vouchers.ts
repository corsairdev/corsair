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
		'/vouchers',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
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
