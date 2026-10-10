import { logEventFromContext } from 'corsair/core';
import type { DaffyEndpoints } from '..';
import { makeDaffyRequest } from '../client';
import { DaffyEndpointInputSchemas, DaffyEndpointOutputSchemas } from './types';

export const create: DaffyEndpoints['createGift'] = async (ctx, rawInput) => {
	const input = DaffyEndpointInputSchemas.createGift.parse(rawInput);
	const response = DaffyEndpointOutputSchemas.createGift.parse(
		await makeDaffyRequest('/gifts', ctx.key, { method: 'POST', body: input }),
	);
	await logEventFromContext(
		ctx,
		'daffy.gifts.create',
		{ amount: input.amount },
		'completed',
	);
	return response;
};

export const list: DaffyEndpoints['getGifts'] = async (ctx, rawInput) => {
	const input = DaffyEndpointInputSchemas.getGifts.parse(rawInput);
	const response = DaffyEndpointOutputSchemas.getGifts.parse(
		await makeDaffyRequest('/gifts', ctx.key, { query: { page: input.page } }),
	);
	await logEventFromContext(ctx, 'daffy.gifts.list', input, 'completed');
	return response;
};

export const getByCode: DaffyEndpoints['getGiftByCode'] = async (
	ctx,
	rawInput,
) => {
	const input = DaffyEndpointInputSchemas.getGiftByCode.parse(rawInput);
	const response = DaffyEndpointOutputSchemas.getGiftByCode.parse(
		await makeDaffyRequest(`/gifts/${encodeURIComponent(input.code)}`, ctx.key),
	);
	await logEventFromContext(ctx, 'daffy.gifts.getByCode', input, 'completed');
	return response;
};
