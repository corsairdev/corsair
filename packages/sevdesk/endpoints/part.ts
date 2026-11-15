import { createSevdeskEndpoint } from './operation';
import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
} from './types';

export const Part = {
	getParts: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['part.getParts'],
		SevdeskEndpointOutputSchemas['part.getParts'],
		'part.getParts',
		'GET',
		'/Part',
	),
	createPart: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['part.createPart'],
		SevdeskEndpointOutputSchemas['part.createPart'],
		'part.createPart',
		'POST',
		'/Part',
	),
	getPartById: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['part.getPartById'],
		SevdeskEndpointOutputSchemas['part.getPartById'],
		'part.getPartById',
		'GET',
		'/Part/{partId}',
	),
	updatePart: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['part.updatePart'],
		SevdeskEndpointOutputSchemas['part.updatePart'],
		'part.updatePart',
		'PUT',
		'/Part/{partId}',
	),
	partGetStock: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['part.partGetStock'],
		SevdeskEndpointOutputSchemas['part.partGetStock'],
		'part.partGetStock',
		'GET',
		'/Part/{partId}/getStock',
	),
} as const;
