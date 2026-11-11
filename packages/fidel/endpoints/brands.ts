import { logEventFromContext } from 'corsair/core';
import type { FidelEndpoints } from '..';
import { makeFidelRequest } from '../client';
import { fidelPathParameter } from './path';
import type { FidelEndpointOutputs } from './types';

export const createBrand: FidelEndpoints['createBrand'] = async (
	ctx,
	input,
) => {
	const response = await makeFidelRequest<FidelEndpointOutputs['createBrand']>(
		ctx,
		'/v1/brands',
		{ method: 'POST', body: input },
	);
	await logEventFromContext(
		ctx,
		'fidel.brands.createBrand',
		input,
		'completed',
	);
	return response;
};

export const retrieveBrand: FidelEndpoints['retrieveBrand'] = async (
	ctx,
	input,
) => {
	const response = await makeFidelRequest<
		FidelEndpointOutputs['retrieveBrand']
	>(ctx, fidelPathParameter('/v1/brands/{brandId}', 'brandId', input.brandId), {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'fidel.brands.retrieveBrand',
		input,
		'completed',
	);
	return response;
};

export const listBrands: FidelEndpoints['listBrands'] = async (ctx, input) => {
	const response = await makeFidelRequest<FidelEndpointOutputs['listBrands']>(
		ctx,
		'/v1/brands',
		{ method: 'GET', query: input },
	);
	await logEventFromContext(ctx, 'fidel.brands.listBrands', input, 'completed');
	return response;
};

export const updateBrand: FidelEndpoints['updateBrand'] = async (
	ctx,
	input,
) => {
	const { brandId, ...rest } = input;
	const response = await makeFidelRequest<FidelEndpointOutputs['updateBrand']>(
		ctx,
		fidelPathParameter('/v1/brands/{brandId}', 'brandId', input.brandId),
		{ method: 'PATCH', body: rest },
	);
	await logEventFromContext(
		ctx,
		'fidel.brands.updateBrand',
		input,
		'completed',
	);
	return response;
};

export const deleteBrand: FidelEndpoints['deleteBrand'] = async (
	ctx,
	input,
) => {
	const response = await makeFidelRequest<FidelEndpointOutputs['deleteBrand']>(
		ctx,
		fidelPathParameter('/v1/brands/{brandId}', 'brandId', input.brandId),
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'fidel.brands.deleteBrand',
		input,
		'completed',
	);
	return response;
};
