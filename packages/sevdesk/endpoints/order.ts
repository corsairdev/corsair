import { createSevdeskEndpoint } from './operation';
import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
} from './types';

export const Order = {
	getOrders: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['order.getOrders'],
		SevdeskEndpointOutputSchemas['order.getOrders'],
		'order.getOrders',
		'GET',
		'/Order',
	),
	createOrder: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['order.createOrder'],
		SevdeskEndpointOutputSchemas['order.createOrder'],
		'order.createOrder',
		'POST',
		'/Order/Factory/saveOrder',
	),
	getOrderById: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['order.getOrderById'],
		SevdeskEndpointOutputSchemas['order.getOrderById'],
		'order.getOrderById',
		'GET',
		'/Order/{orderId}',
	),
	updateOrder: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['order.updateOrder'],
		SevdeskEndpointOutputSchemas['order.updateOrder'],
		'order.updateOrder',
		'PUT',
		'/Order/{orderId}',
	),
	deleteOrder: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['order.deleteOrder'],
		SevdeskEndpointOutputSchemas['order.deleteOrder'],
		'order.deleteOrder',
		'DELETE',
		'/Order/{orderId}',
	),
	getOrderPositionsById: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['order.getOrderPositionsById'],
		SevdeskEndpointOutputSchemas['order.getOrderPositionsById'],
		'order.getOrderPositionsById',
		'GET',
		'/Order/{orderId}/getPositions',
	),
	getDiscounts: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['order.getDiscounts'],
		SevdeskEndpointOutputSchemas['order.getDiscounts'],
		'order.getDiscounts',
		'GET',
		'/Order/{orderId}/getDiscounts',
	),
	getRelatedObjects: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['order.getRelatedObjects'],
		SevdeskEndpointOutputSchemas['order.getRelatedObjects'],
		'order.getRelatedObjects',
		'GET',
		'/Order/{orderId}/getRelatedObjects',
	),
	sendorderViaEMail: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['order.sendorderViaEMail'],
		SevdeskEndpointOutputSchemas['order.sendorderViaEMail'],
		'order.sendorderViaEMail',
		'POST',
		'/Order/{orderId}/sendViaEmail',
	),
	createPackingListFromOrder: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['order.createPackingListFromOrder'],
		SevdeskEndpointOutputSchemas['order.createPackingListFromOrder'],
		'order.createPackingListFromOrder',
		'POST',
		'/Order/Factory/createPackingListFromOrder',
	),
	createContractNoteFromOrder: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['order.createContractNoteFromOrder'],
		SevdeskEndpointOutputSchemas['order.createContractNoteFromOrder'],
		'order.createContractNoteFromOrder',
		'POST',
		'/Order/Factory/createContractNoteFromOrder',
	),
	orderGetPdf: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['order.orderGetPdf'],
		SevdeskEndpointOutputSchemas['order.orderGetPdf'],
		'order.orderGetPdf',
		'GET',
		'/Order/{orderId}/getPdf',
	),
	orderSendBy: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['order.orderSendBy'],
		SevdeskEndpointOutputSchemas['order.orderSendBy'],
		'order.orderSendBy',
		'PUT',
		'/Order/{orderId}/sendBy',
	),
} as const;
