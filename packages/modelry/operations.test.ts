import { createCorsair } from 'corsair/core';
import {
	ModelryEndpointInputSchemas,
	ModelryEndpointOutputSchemas,
} from './endpoints/types';
import { modelry, modelryEndpointSchemas } from './index';

const api = createCorsair({ plugins: [modelry({ key: 'test-token' })] }).modelry
	.api;
const item = {
	id: '1',
	type: 'product',
	attributes: { sku: 'SKU', title: 'Chair', batchId: null, description: null },
};
const one = { data: item };
const many = {
	data: [item],
	meta: { page: 2, per_page: 25, total_records: 30 },
};
type Case = {
	name: keyof typeof modelryEndpointSchemas;
	call: () => Promise<unknown>;
	method: string;
	path: string;
	response: unknown;
	body?: unknown;
	status?: number;
};
const cases: Case[] = [
	{
		name: 'products.list',
		call: () => api.products.list({ page: 2 }),
		method: 'GET',
		path: '/v1/products?page=2',
		response: many,
	},
	{
		name: 'products.get',
		call: () => api.products.get({ id: 1 }),
		method: 'GET',
		path: '/v1/products/1',
		response: one,
	},
	{
		name: 'products.create',
		call: () =>
			api.products.create({ product: { title: 'Chair', sku: 'SKU' } }),
		method: 'POST',
		path: '/v1/products',
		body: { product: { title: 'Chair', sku: 'SKU' } },
		response: one,
	},
	{
		name: 'products.update',
		call: () => api.products.update({ id: 1, product: { description: null } }),
		method: 'PUT',
		path: '/v1/products/1',
		body: { product: { description: null } },
		response: one,
	},
	{
		name: 'products.delete',
		call: () => api.products.delete({ id: 1 }),
		method: 'DELETE',
		path: '/v1/products/1',
		status: 204,
		response: undefined,
	},
	{
		name: 'modelingRequests.list',
		call: () => api.modelingRequests.list({ page: 2 }),
		method: 'GET',
		path: '/v1/modeling-requests?page=2',
		response: many,
	},
	{
		name: 'modelingRequests.get',
		call: () => api.modelingRequests.get({ id_or_sku: 'sku 1' }),
		method: 'GET',
		path: '/v1/modeling-requests/sku%201',
		response: one,
	},
	{
		name: 'modelingRequests.create',
		call: () =>
			api.modelingRequests.create({
				modeling_request: { title: 'Chair', sku: 'SKU', pipeline: 'high_poly' },
			}),
		method: 'POST',
		path: '/v1/modeling-requests',
		body: {
			modeling_request: { title: 'Chair', sku: 'SKU', pipeline: 'high_poly' },
		},
		response: one,
	},
	{
		name: 'modelingRequests.approve',
		call: () => api.modelingRequests.approve({ id_or_sku: 1 }),
		method: 'PUT',
		path: '/v1/modeling-requests/1/approve',
		response: one,
	},
	{
		name: 'modelingRequests.reject',
		call: () => api.modelingRequests.reject({ id_or_sku: 1 }),
		method: 'PUT',
		path: '/v1/modeling-requests/1/reject',
		response: one,
	},
	{
		name: 'modelingRequests.assets',
		call: () =>
			api.modelingRequests.assets({ modeling_request_id_or_sku: 1, page: 2 }),
		method: 'GET',
		path: '/v1/modeling-requests/1/assets?page=2',
		response: many,
	},
	{
		name: 'productAssets.create',
		call: () => api.productAssets.create({ product_id: 1, blob_id: 'signed' }),
		method: 'POST',
		path: '/v1/products/1/assets',
		body: { blob_id: 'signed' },
		response: one,
	},
	{
		name: 'productAssets.delete',
		call: () => api.productAssets.delete({ product_id: 1, id: 2 }),
		method: 'DELETE',
		path: '/v1/products/1/assets/2',
		status: 204,
		response: undefined,
	},
	{
		name: 'embeds.list',
		call: () => api.embeds.list({ product_id: 1, page: 2 }),
		method: 'GET',
		path: '/v1/products/1/embeds?page=2',
		response: many,
	},
	{
		name: 'embeds.get',
		call: () => api.embeds.get({ product_id: 1, id: 2 }),
		method: 'GET',
		path: '/v1/products/1/embeds/2',
		response: one,
	},
	{
		name: 'embeds.publish',
		call: () => api.embeds.publish({ product_id: 1, id: 2 }),
		method: 'PUT',
		path: '/v1/products/1/embeds/2/publish',
		response: one,
	},
	{
		name: 'embeds.delete',
		call: () => api.embeds.delete({ product_id: 1, id: 2 }),
		method: 'DELETE',
		path: '/v1/products/1/embeds/2',
		status: 204,
		response: undefined,
	},
	{
		name: 'reviews.create',
		call: () =>
			api.reviews.create({
				modeling_request_id_or_sku: 1,
				review_issues: [
					{ filename: 'model.glb', category: 'color', comment: 'Change color' },
				],
			}),
		method: 'POST',
		path: '/v1/modeling-requests/1/review_issues',
		body: {
			review_issues: [
				{ filename: 'model.glb', category: 'color', comment: 'Change color' },
			],
		},
		response: one,
	},
	{
		name: 'uploads.blob',
		call: () =>
			api.uploads.blob({
				blob: {
					filename: 'a.zip',
					byte_size: 5,
					checksum: 'checksum',
					content_type: 'application/zip',
				},
			}),
		method: 'POST',
		path: '/v1/blobs',
		body: {
			blob: {
				filename: 'a.zip',
				byte_size: 5,
				checksum: 'checksum',
				content_type: 'application/zip',
			},
		},
		response: {
			signed_id: 'signed',
			service_url: 'https://example.com',
			headers: { 'Content-Type': 'application/zip' },
		},
	},
	{
		name: 'uploads.file',
		call: () =>
			api.uploads.file({
				filename: 'a.jpg',
				base64_file: 'data',
				content_type: 'image/jpeg',
			}),
		method: 'POST',
		path: '/v1/uploads',
		body: {
			filename: 'a.jpg',
			base64_file: 'data',
			content_type: 'image/jpeg',
		},
		response: {
			blob_id: 1304,
			signed_blob_id: 'signed',
			url: 'https://example.com',
		},
	},
	{
		name: 'workspaces.list',
		call: () => api.workspaces.list({ page: 2 }),
		method: 'GET',
		path: '/v1/workspaces?page=2',
		response: many,
	},
];
let mock: jest.SpyInstance;
beforeEach(() => {
	mock = jest.spyOn(globalThis, 'fetch');
});
afterEach(() => jest.restoreAllMocks());
it('covers every registered endpoint', () =>
	expect(cases.map((c) => c.name).sort()).toEqual(
		Object.keys(modelryEndpointSchemas).sort(),
	));
it('keeps the input and output schema registries aligned with public endpoints', () => {
	const publicNames = Object.keys(modelryEndpointSchemas)
		.map((name) => name.replace('.', '_'))
		.sort();
	expect(Object.keys(ModelryEndpointInputSchemas).sort()).toEqual(publicNames);
	expect(Object.keys(ModelryEndpointOutputSchemas).sort()).toEqual(publicNames);
});
it.each(cases)(
	'$name sends the documented request and parses its response',
	async (c) => {
		mock.mockResolvedValueOnce(
			new Response(c.status === 204 ? null : JSON.stringify(c.response), {
				status: c.status ?? 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		expect(await c.call()).toEqual(c.response);
		expect(mock).toHaveBeenCalledTimes(1);
		const [url, init] = mock.mock.calls[0];
		expect(url).toBe(`https://api.modelry.ai/api${c.path}`);
		expect(init.method).toBe(c.method);
		expect(new Headers(init.headers).get('Authorization')).toBe('test-token');
		if (c.body !== undefined) expect(JSON.parse(init.body)).toEqual(c.body);
		else expect(init.body).toBeUndefined();
	},
);
it.each(['', '..', '.', 'a/b', 'a\\b', 'a"b', "a'b"])(
	'rejects unsafe identifier %s before sending',
	async (id) => {
		await expect(api.products.get({ id })).rejects.toBeDefined();
		expect(mock).not.toHaveBeenCalled();
	},
);
it('rejects malformed provider fields', async () => {
	mock.mockResolvedValueOnce(
		new Response(
			JSON.stringify({
				data: { id: '1', type: 'product', attributes: { title: 42 } },
			}),
			{ headers: { 'Content-Type': 'application/json' } },
		),
	);
	await expect(api.products.get({ id: 1 })).rejects.toBeDefined();
});
it('does not retry a rate-limited write', async () => {
	mock.mockResolvedValueOnce(
		new Response(JSON.stringify({ error: 'rate limited' }), {
			status: 429,
			headers: { 'Content-Type': 'application/json', 'Retry-After': '1' },
		}),
	);
	await expect(
		api.products.create({ product: { title: 'Chair' } }),
	).rejects.toBeDefined();
	expect(mock).toHaveBeenCalledTimes(1);
});
it('forwards array filters with the documented bracket names', async () => {
	mock.mockResolvedValueOnce(
		new Response(JSON.stringify(many), {
			headers: { 'Content-Type': 'application/json' },
		}),
	);
	await api.products.list({ tags: ['a', 'b'], sort_by: ['title', 'desc'] });
	const url = new URL(mock.mock.calls[0][0]);
	expect(url.searchParams.getAll('tags[]')).toEqual(['a', 'b']);
	expect(url.searchParams.getAll('sort_by[]')).toEqual(['title', 'desc']);
});
