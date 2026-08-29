import type { CloudcartEndpoints } from '../index';
import { pathId, runCloudcart } from './run';
import {
	CloudcartEndpointOutputSchemas,
	CreateOrderInputSchema,
	DeleteOrderInputSchema,
	ListOrderBillingAddressesInputSchema,
	ListOrderPaymentsInputSchema,
	ListOrderPaymentV2InputSchema,
	ListOrderProductsInputSchema,
	ListOrderProductsOptionsInputSchema,
	ListOrderShippingAddressesInputSchema,
	ListOrderShippingInputSchema,
	ListOrderStatusInputSchema,
	ListOrdersInputSchema,
	UpdateOrderInputSchema,
} from './types';

export const createOrder: CloudcartEndpoints['createOrder'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.orders.createOrder',
		inputSchema: CreateOrderInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.createOrder,
		method: 'POST',
		path: 'orders',
	});

export const listOrders: CloudcartEndpoints['listOrders'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.orders.listOrders',
		inputSchema: ListOrdersInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listOrders,
		path: 'orders',
	});

export const updateOrder: CloudcartEndpoints['updateOrder'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.orders.updateOrder',
		inputSchema: UpdateOrderInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.updateOrder,
		method: 'PATCH',
		path: (parsed) => `orders/${pathId(parsed.id)}`,
	});

export const deleteOrder: CloudcartEndpoints['deleteOrder'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.orders.deleteOrder',
		inputSchema: DeleteOrderInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.deleteOrder,
		method: 'DELETE',
		path: (parsed) => `orders/${pathId(parsed.id)}`,
	});

export const listOrderBillingAddresses: CloudcartEndpoints['listOrderBillingAddresses'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.orders.listOrderBillingAddresses',
			inputSchema: ListOrderBillingAddressesInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.listOrderBillingAddresses,
			path: 'order-billing-addresses',
		});

export const listOrderShippingAddresses: CloudcartEndpoints['listOrderShippingAddresses'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.orders.listOrderShippingAddresses',
			inputSchema: ListOrderShippingAddressesInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.listOrderShippingAddresses,
			path: 'order-shipping-addresses',
		});

export const listOrderProducts: CloudcartEndpoints['listOrderProducts'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.orders.listOrderProducts',
		inputSchema: ListOrderProductsInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listOrderProducts,
		path: 'order-products',
	});

export const listOrderProductsOptions: CloudcartEndpoints['listOrderProductsOptions'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.orders.listOrderProductsOptions',
			inputSchema: ListOrderProductsOptionsInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.listOrderProductsOptions,
			path: 'order-products-options',
		});

export const listOrderPayments: CloudcartEndpoints['listOrderPayments'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.orders.listOrderPayments',
		inputSchema: ListOrderPaymentsInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listOrderPayments,
		path: 'order-payments',
	});

export const listOrderPaymentV2: CloudcartEndpoints['listOrderPaymentV2'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.orders.listOrderPaymentV2',
		inputSchema: ListOrderPaymentV2InputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listOrderPaymentV2,
		path: 'order-payments/v2',
	});

export const listOrderShipping: CloudcartEndpoints['listOrderShipping'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.orders.listOrderShipping',
		inputSchema: ListOrderShippingInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listOrderShipping,
		path: 'order-shippings',
	});

export const listOrderStatus: CloudcartEndpoints['listOrderStatus'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.orders.listOrderStatus',
		inputSchema: ListOrderStatusInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listOrderStatus,
		path: 'order-statuses',
	});
