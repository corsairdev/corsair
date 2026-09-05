import { definePineconeEndpoint } from './factory';

const encode = encodeURIComponent;
const indexSurface = {
	surface: 'index' as const,
	host: (input: { host: string }) => input.host,
};

export const upsertVectors = definePineconeEndpoint('upsertVectors', {
	...indexSurface,
	method: 'POST',
	path: () => '/vectors/upsert',
	body: ({ host: _host, ...body }) => body,
});

export const queryVectors = definePineconeEndpoint('queryVectors', {
	...indexSurface,
	method: 'POST',
	path: () => '/query',
	body: ({ host: _host, ...body }) => body,
});

export const fetchVectors = definePineconeEndpoint('fetchVectors', {
	...indexSurface,
	method: 'GET',
	path: () => '/vectors/fetch',
	query: ({ ids, namespace }) => ({ ids, namespace }),
});

export const updateVector = definePineconeEndpoint('updateVector', {
	...indexSurface,
	method: 'POST',
	path: () => '/vectors/update',
	body: ({ host: _host, ...body }) => body,
});

export const deleteVectors = definePineconeEndpoint('deleteVectors', {
	...indexSurface,
	method: 'POST',
	path: () => '/vectors/delete',
	body: ({ host: _host, ...body }) => body,
});

export const listVectors = definePineconeEndpoint('listVectors', {
	...indexSurface,
	method: 'GET',
	path: () => '/vectors/list',
	query: ({ prefix, limit, paginationToken, namespace }) => ({
		prefix,
		limit,
		paginationToken,
		namespace,
	}),
});

export const describeIndexStats = definePineconeEndpoint('describeIndexStats', {
	...indexSurface,
	method: 'POST',
	path: () => '/describe_index_stats',
	body: ({ host: _host, ...body }) => body,
});

export const listNamespaces = definePineconeEndpoint('listNamespaces', {
	...indexSurface,
	method: 'GET',
	path: () => '/namespaces',
	query: ({ limit, paginationToken, prefix }) => ({
		limit,
		paginationToken,
		prefix,
	}),
});

export const createNamespace = definePineconeEndpoint('createNamespace', {
	...indexSurface,
	method: 'POST',
	path: () => '/namespaces',
	body: ({ namespace, schema }) => ({ name: namespace, schema }),
});

export const describeNamespace = definePineconeEndpoint('describeNamespace', {
	...indexSurface,
	method: 'GET',
	path: ({ namespace }) => `/namespaces/${encode(namespace)}`,
});

export const deleteNamespace = definePineconeEndpoint('deleteNamespace', {
	...indexSurface,
	method: 'DELETE',
	path: ({ namespace }) => `/namespaces/${encode(namespace)}`,
});

export const listBulkImports = definePineconeEndpoint('listBulkImports', {
	...indexSurface,
	method: 'GET',
	path: () => '/bulk/imports',
	query: ({ limit, paginationToken }) => ({ limit, paginationToken }),
});

export const startBulkImport = definePineconeEndpoint('startBulkImport', {
	...indexSurface,
	method: 'POST',
	path: () => '/bulk/imports',
	body: ({ host: _host, ...body }) => body,
});

export const describeBulkImport = definePineconeEndpoint('describeBulkImport', {
	...indexSurface,
	method: 'GET',
	path: ({ importId }) => `/bulk/imports/${encode(importId)}`,
});

export const cancelBulkImport = definePineconeEndpoint('cancelBulkImport', {
	...indexSurface,
	method: 'DELETE',
	path: ({ importId }) => `/bulk/imports/${encode(importId)}`,
});

export const upsertRecords = definePineconeEndpoint('upsertRecords', {
	...indexSurface,
	method: 'POST',
	path: ({ namespace }) => `/records/namespaces/${encode(namespace)}/upsert`,
	mediaType: 'application/x-ndjson',
	body: ({ records }) =>
		`${records.map((record) => JSON.stringify(record)).join('\n')}\n`,
});

export const searchRecords = definePineconeEndpoint('searchRecords', {
	...indexSurface,
	method: 'POST',
	path: ({ namespace }) => `/records/namespaces/${encode(namespace)}/search`,
	body: ({ query, fields }) => ({ query, fields }),
});
