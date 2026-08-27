import { logEventFromContext } from 'corsair/core';
import { makeCloudcartRequest } from '../client';
import type { CloudcartEndpoints } from '../index';
import type { CloudcartEndpointOutputs } from './types';

export const createDiscount: CloudcartEndpoints['createDiscount'] = async (
	ctx,
	input,
) => {
	const { data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['createDiscount']
	>('discounts', ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.discounts.createDiscount',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteDiscount: CloudcartEndpoints['deleteDiscount'] = async (
	ctx,
	input,
) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['deleteDiscount']
	>(`discounts/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'cloudcart.discounts.deleteDiscount',
		{ ...input },
		'completed',
	);
	return result;
};

export const createDiscountCode: CloudcartEndpoints['createDiscountCode'] =
	async (ctx, input) => {
		const { data, ...rest } = (input as Record<string, any>) || {};
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['createDiscountCode']
		>('discount-codes', ctx.key, {
			method: 'POST',
			body: data || rest,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.discounts.createDiscountCode',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listDiscountCodes: CloudcartEndpoints['listDiscountCodes'] =
	async (ctx, input) => {
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['listDiscountCodes']
		>('discount-codes', ctx.key, {
			method: 'GET',
			query: input as Record<string, any>,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.discounts.listDiscountCodes',
			{ ...input },
			'completed',
		);
		return result;
	};

export const updateDiscountCode: CloudcartEndpoints['updateDiscountCode'] =
	async (ctx, input) => {
		const { id, data, ...rest } = (input as Record<string, any>) || {};
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['updateDiscountCode']
		>(`discount-codes/${encodeURIComponent(String(id))}`, ctx.key, {
			method: 'PATCH',
			body: data || rest,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.discounts.updateDiscountCode',
			{ ...input },
			'completed',
		);
		return result;
	};

export const deleteDiscountCode: CloudcartEndpoints['deleteDiscountCode'] =
	async (ctx, input) => {
		const { id } = (input as Record<string, any>) || {};
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['deleteDiscountCode']
		>(`discount-codes/${encodeURIComponent(String(id))}`, ctx.key, {
			method: 'DELETE',
		});
		await logEventFromContext(
			ctx,
			'cloudcart.discounts.deleteDiscountCode',
			{ ...input },
			'completed',
		);
		return result;
	};

export const generateDiscountCodes: CloudcartEndpoints['generateDiscountCodes'] =
	async (ctx, input) => {
		const { data, ...rest } = (input as Record<string, any>) || {};
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['generateDiscountCodes']
		>('discount-codes/generate', ctx.key, {
			method: 'POST',
			body: data || rest,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.discounts.generateDiscountCodes',
			{ ...input },
			'completed',
		);
		return result;
	};

export const createProductToDiscount: CloudcartEndpoints['createProductToDiscount'] =
	async (ctx, input) => {
		const { id, data, ...rest } = (input as Record<string, any>) || {};
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['createProductToDiscount']
		>(`products/${encodeURIComponent(String(id))}/discounts`, ctx.key, {
			method: 'POST',
			body: data || rest,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.discounts.createProductToDiscount',
			{ ...input },
			'completed',
		);
		return result;
	};

export const deleteProductToDiscount: CloudcartEndpoints['deleteProductToDiscount'] =
	async (ctx, input) => {
		const { id, discount_id } = (input as Record<string, any>) || {};
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['deleteProductToDiscount']
		>(
			`products/${encodeURIComponent(String(id))}/discounts/${encodeURIComponent(String(discount_id))}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);
		await logEventFromContext(
			ctx,
			'cloudcart.discounts.deleteProductToDiscount',
			{ ...input },
			'completed',
		);
		return result;
	};
