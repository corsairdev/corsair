import { createSevdeskEndpoint } from './operation';
import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
} from './types';

export const CommunicationWay = {
	getCommunicationWays: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['communicationWay.getCommunicationWays'],
		SevdeskEndpointOutputSchemas['communicationWay.getCommunicationWays'],
		'communicationWay.getCommunicationWays',
		'GET',
		'/CommunicationWay',
	),
	createCommunicationWay: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['communicationWay.createCommunicationWay'],
		SevdeskEndpointOutputSchemas['communicationWay.createCommunicationWay'],
		'communicationWay.createCommunicationWay',
		'POST',
		'/CommunicationWay',
	),
	getCommunicationWayById: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['communicationWay.getCommunicationWayById'],
		SevdeskEndpointOutputSchemas['communicationWay.getCommunicationWayById'],
		'communicationWay.getCommunicationWayById',
		'GET',
		'/CommunicationWay/{communicationWayId}',
	),
	deleteCommunicationWay: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['communicationWay.deleteCommunicationWay'],
		SevdeskEndpointOutputSchemas['communicationWay.deleteCommunicationWay'],
		'communicationWay.deleteCommunicationWay',
		'DELETE',
		'/CommunicationWay/{communicationWayId}',
	),
	updateCommunicationWay: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['communicationWay.updateCommunicationWay'],
		SevdeskEndpointOutputSchemas['communicationWay.updateCommunicationWay'],
		'communicationWay.updateCommunicationWay',
		'PUT',
		'/CommunicationWay/{communicationWayId}',
	),
	getCommunicationWayKeys: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['communicationWay.getCommunicationWayKeys'],
		SevdeskEndpointOutputSchemas['communicationWay.getCommunicationWayKeys'],
		'communicationWay.getCommunicationWayKeys',
		'GET',
		'/CommunicationWayKey',
	),
} as const;
