import { definePineconeEndpoint } from './factory';

export const embed = definePineconeEndpoint('embed', {
	method: 'POST',
	path: () => '/embed',
	surface: 'inference',
	body: (input) => input,
});

export const rerank = definePineconeEndpoint('rerank', {
	method: 'POST',
	path: () => '/rerank',
	surface: 'inference',
	body: (input) => input,
});

export const listModels = definePineconeEndpoint('listModels', {
	method: 'GET',
	path: () => '/models',
	surface: 'inference',
	query: ({ type, vectorType }) => ({ type, vector_type: vectorType }),
});

export const getModel = definePineconeEndpoint('getModel', {
	method: 'GET',
	path: ({ modelName }) => `/models/${encodeURIComponent(modelName)}`,
	surface: 'inference',
});
