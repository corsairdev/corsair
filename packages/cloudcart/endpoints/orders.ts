import { logEventFromContext } from 'corsair/core';
import { makeCloudcartRequest } from '../client';
import type { CloudcartEndpoints } from '../index';
import type { CloudcartEndpointOutputs } from './types';

export const createOrder: CloudcartEndpoints['createOrder'] = async (
	ctx,
	input,
) => {
	const { data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['createOrder']
	>('orders', ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.orders.createOrder',
		{ ...input },
		'completed',
	);
	return result;
};

export const listOrders: CloudcartEndpoints['listOrders'] = async (
	ctx,
	input,
) => {
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['listOrders']
	>('orders', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.orders.listOrders',
		{ ...input },
		'completed',
	);
	return result;
};

export const updateOrder: CloudcartEndpoints['updateOrder'] = async (
	ctx,
	input,
) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['updateOrder']
	>(`orders/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'PATCH',
		body: data || rest,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.orders.updateOrder',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteOrder: CloudcartEndpoints['deleteOrder'] = async (
	ctx,
	input,
) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['deleteOrder']
	>(`orders/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'cloudcart.orders.deleteOrder',
		{ ...input },
		'completed',
	);
	return result;
};

export const listOrderBillingAddresses: CloudcartEndpoints['listOrderBillingAddresses'] =
	async (ctx, input) => {
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['listOrderBillingAddresses']
		>('order-billing-addresses', ctx.key, {
			method: 'GET',
			query: input as Record<string, any>,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.orders.listOrderBillingAddresses',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listOrderShippingAddresses: CloudcartEndpoints['listOrderShippingAddresses'] =
	async (ctx, input) => {
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['listOrderShippingAddresses']
		>('order-shipping-addresses', ctx.key, {
			method: 'GET',
			query: input as Record<string, any>,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.orders.listOrderShippingAddresses',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listOrderProducts: CloudcartEndpoints['listOrderProducts'] =
	async (ctx, input) => {
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['listOrderProducts']
		>('order-products', ctx.key, {
			method: 'GET',
			query: input as Record<string, any>,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.orders.listOrderProducts',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listOrderProductsOptions: CloudcartEndpoints['listOrderProductsOptions'] =
	async (ctx, input) => {
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['listOrderProductsOptions']
		>('order-products-options', ctx.key, {
			method: 'GET',
			query: input as Record<string, any>,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.orders.listOrderProductsOptions',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listOrderPayments: CloudcartEndpoints['listOrderPayments'] =
	async (ctx, input) => {
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['listOrderPayments']
		>('order-payments', ctx.key, {
			method: 'GET',
			query: input as Record<string, any>,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.orders.listOrderPayments',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listOrderPaymentV2: CloudcartEndpoints['listOrderPaymentV2'] =
	async (ctx, input) => {
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['listOrderPaymentV2']
		>('order-payments/v2', ctx.key, {
			method: 'GET',
			query: input as Record<string, any>,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.orders.listOrderPaymentV2',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listOrderShipping: CloudcartEndpoints['listOrderShipping'] =
	async (ctx, input) => {
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['listOrderShipping']
		>('order-shippings', ctx.key, {
			method: 'GET',
			query: input as Record<string, any>,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.orders.listOrderShipping',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listOrderStatus: CloudcartEndpoints['listOrderStatus'] = async (
	ctx,
	input,
) => {
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['listOrderStatus']
	>('order-statuses', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.orders.listOrderStatus',
		{ ...input },
		'completed',
	);
	return result;
};
