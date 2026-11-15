import { createSevdeskEndpoint } from './operation';
import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
} from './types';

export const OrderPos = {
	getOrderPositions: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['orderPos.getOrderPositions'],
		SevdeskEndpointOutputSchemas['orderPos.getOrderPositions'],
		'orderPos.getOrderPositions',
		'GET',
		'/OrderPos',
	),
	getOrderPositionById: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['orderPos.getOrderPositionById'],
		SevdeskEndpointOutputSchemas['orderPos.getOrderPositionById'],
		'orderPos.getOrderPositionById',
		'GET',
		'/OrderPos/{orderPosId}',
	),
	updateOrderPosition: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['orderPos.updateOrderPosition'],
		SevdeskEndpointOutputSchemas['orderPos.updateOrderPosition'],
		'orderPos.updateOrderPosition',
		'PUT',
		'/OrderPos/{orderPosId}',
	),
	deleteOrderPos: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['orderPos.deleteOrderPos'],
		SevdeskEndpointOutputSchemas['orderPos.deleteOrderPos'],
		'orderPos.deleteOrderPos',
		'DELETE',
		'/OrderPos/{orderPosId}',
	),
} as const;
