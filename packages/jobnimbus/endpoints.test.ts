import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Account,
	Activities,
	Budgets,
	Contacts,
	Estimates,
	Files,
	Invoices,
	Jobs,
	MaterialOrders,
	Payments,
	Products,
	Tasks,
	WorkOrders,
} from './endpoints';
import type { JobNimbusContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeJobNimbusRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeJobNimbusRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

function buildContext(): JobNimbusContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-token',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-token'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
		// `unknown` cast because CorsairPluginContext includes framework-owned runtime state and methods unrelated to these endpoint unit tests; the mocks below provide the context fields exercised here without bootstrapping Corsair.
	} as unknown as JobNimbusContext;
}

const ctx = buildContext();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

function expectLogged(event: string, payload: object) {
	expect(mockedLogEvent).toHaveBeenCalledWith(
		ctx,
		`jobnimbus.${event}`,
		payload,
		'completed',
	);
	const loggedJson = JSON.stringify(mockedLogEvent.mock.calls[0]?.[2]) ?? '';
	expect(loggedJson).not.toContain('test-api-token');
	expect(loggedJson).not.toContain('secret');
}

describe('JobNimbus Endpoints', () => {
	describe('Contacts', () => {
		it('contacts.create sends POST /contacts', async () => {
			const raw = { jnid: 'c1', first_name: 'David', last_name: 'Jackson' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Contacts.create(ctx, {
				first_name: 'David',
				last_name: 'Jackson',
				record_type_name: 'Customer',
				status_name: 'Lead',
			});

			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/contacts',
				'test-api-token',
				{
					method: 'POST',
					body: {
						first_name: 'David',
						last_name: 'Jackson',
						record_type_name: 'Customer',
						status_name: 'Lead',
					},
				},
			);
			expectLogged('contacts.create', { count: 1 });
		});

		it('contacts.update sends PUT /contacts/{jnid}', async () => {
			const raw = { jnid: 'c1', first_name: 'Updated' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Contacts.update(ctx, {
				jnid: 'c1',
				first_name: 'Updated',
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/contacts/c1',
				'test-api-token',
				{
					method: 'PUT',
					body: { first_name: 'Updated' },
				},
			);
			expectLogged('contacts.update', { count: 1 });
		});

		it('contacts.delete sends PUT /contacts/{jnid} with is_active: false', async () => {
			const raw = { jnid: 'c1', is_active: false };
			mockedRequest.mockResolvedValue(raw);

			const result = await Contacts.delete(ctx, { jnid: 'c1' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/contacts/c1',
				'test-api-token',
				{
					method: 'PUT',
					body: { is_active: false },
				},
			);
			expectLogged('contacts.delete', { count: 1 });
		});

		it('contacts.get sends GET /contacts/{jnid}', async () => {
			const raw = { jnid: 'c1', first_name: 'David' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Contacts.get(ctx, { jnid: 'c1' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/contacts/c1',
				'test-api-token',
				{
					method: 'GET',
				},
			);
			expectLogged('contacts.get', { count: 1 });
		});

		it('contacts.list sends GET /contacts with query params', async () => {
			const raw = { count: 1, results: [{ jnid: 'c1', first_name: 'David' }] };
			mockedRequest.mockResolvedValue(raw);

			const result = await Contacts.list(ctx, {
				size: 50,
				from: 0,
				actor: 'sam@company.com',
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/contacts',
				'test-api-token',
				{
					method: 'GET',
					query: { size: 50, from: 0, actor: 'sam@company.com' },
				},
			);
			expectLogged('contacts.list', { count: 1 });
		});

		it('rejects invalid contacts input before network call', async () => {
			// @ts-expect-error Testing invalid input without jnid
			await expect(Contacts.get(ctx, {})).rejects.toThrow();
			expect(mockedRequest).not.toHaveBeenCalled();
		});
	});

	describe('Jobs', () => {
		it('jobs.create sends POST /jobs', async () => {
			const raw = { jnid: 'j1', name: 'Roof Repair' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Jobs.create(ctx, {
				name: 'Roof Repair',
				record_type_name: 'Job',
				status_name: 'Lead',
			});

			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith('/jobs', 'test-api-token', {
				method: 'POST',
				body: {
					name: 'Roof Repair',
					record_type_name: 'Job',
					status_name: 'Lead',
				},
			});
			expectLogged('jobs.create', { count: 1 });
		});

		it('jobs.update sends PUT /jobs/{jnid}', async () => {
			const raw = { jnid: 'j1', name: 'Updated Roof' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Jobs.update(ctx, {
				jnid: 'j1',
				name: 'Updated Roof',
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith('/jobs/j1', 'test-api-token', {
				method: 'PUT',
				body: { name: 'Updated Roof' },
			});
			expectLogged('jobs.update', { count: 1 });
		});

		it('jobs.delete sends PUT /jobs/{jnid} with is_active: false', async () => {
			const raw = { jnid: 'j1', is_active: false };
			mockedRequest.mockResolvedValue(raw);

			const result = await Jobs.delete(ctx, { jnid: 'j1' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith('/jobs/j1', 'test-api-token', {
				method: 'PUT',
				body: { is_active: false },
			});
			expectLogged('jobs.delete', { count: 1 });
		});

		it('jobs.get sends GET /jobs/{jnid}', async () => {
			const raw = { jnid: 'j1', name: 'Roof' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Jobs.get(ctx, { jnid: 'j1' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith('/jobs/j1', 'test-api-token', {
				method: 'GET',
			});
			expectLogged('jobs.get', { count: 1 });
		});

		it('jobs.list sends GET /jobs', async () => {
			const raw = { count: 1, results: [{ jnid: 'j1', name: 'Roof' }] };
			mockedRequest.mockResolvedValue(raw);

			const result = await Jobs.list(ctx, {
				size: 10,
				actor: 'sam@company.com',
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith('/jobs', 'test-api-token', {
				method: 'GET',
				query: { size: 10, actor: 'sam@company.com' },
			});
			expectLogged('jobs.list', { count: 1 });
		});
	});

	describe('Tasks', () => {
		it('tasks.create sends POST /tasks', async () => {
			const raw = { jnid: 't1', title: 'Inspection' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Tasks.create(ctx, {
				title: 'Inspection',
				date_start: 1700000000,
			});

			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith('/tasks', 'test-api-token', {
				method: 'POST',
				body: { title: 'Inspection', date_start: 1700000000 },
			});
			expectLogged('tasks.create', { count: 1 });
		});

		it('tasks.update sends PUT /tasks/{jnid}', async () => {
			const raw = { jnid: 't1', is_completed: true };
			mockedRequest.mockResolvedValue(raw);

			const result = await Tasks.update(ctx, {
				jnid: 't1',
				is_completed: true,
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/tasks/t1',
				'test-api-token',
				{
					method: 'PUT',
					body: { is_completed: true },
				},
			);
			expectLogged('tasks.update', { count: 1 });
		});

		it('tasks.delete sends PUT /tasks/{jnid} with is_active: false', async () => {
			const raw = { jnid: 't1', is_active: false };
			mockedRequest.mockResolvedValue(raw);

			const result = await Tasks.delete(ctx, { jnid: 't1' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/tasks/t1',
				'test-api-token',
				{
					method: 'PUT',
					body: { is_active: false },
				},
			);
			expectLogged('tasks.delete', { count: 1 });
		});

		it('tasks.get sends GET /tasks/{jnid}', async () => {
			const raw = { jnid: 't1', title: 'Inspection' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Tasks.get(ctx, { jnid: 't1' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/tasks/t1',
				'test-api-token',
				{
					method: 'GET',
				},
			);
			expectLogged('tasks.get', { count: 1 });
		});

		it('tasks.list sends GET /tasks', async () => {
			const raw = { count: 1, results: [{ jnid: 't1', title: 'Inspection' }] };
			mockedRequest.mockResolvedValue(raw);

			const result = await Tasks.list(ctx, { actor: 'sam@company.com' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith('/tasks', 'test-api-token', {
				method: 'GET',
				query: { actor: 'sam@company.com' },
			});
			expectLogged('tasks.list', { count: 1 });
		});
	});

	describe('Activities', () => {
		it('activities.create sends POST /activities', async () => {
			const raw = { jnid: 'a1', note: 'Note 1' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Activities.create(ctx, { note: 'Note 1' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/activities',
				'test-api-token',
				{
					method: 'POST',
					body: { note: 'Note 1' },
				},
			);
			expectLogged('activities.create', { count: 1 });
		});

		it('activities.get sends GET /activities/{jnid}', async () => {
			const raw = { jnid: 'a1', note: 'Note 1' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Activities.get(ctx, { jnid: 'a1' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/activities/a1',
				'test-api-token',
				{
					method: 'GET',
				},
			);
			expectLogged('activities.get', { count: 1 });
		});

		it('activities.list sends GET /activities', async () => {
			const raw = { count: 1, results: [{ jnid: 'a1', note: 'Note 1' }] };
			mockedRequest.mockResolvedValue(raw);

			const result = await Activities.list(ctx, { actor: 'sam@company.com' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/activities',
				'test-api-token',
				{
					method: 'GET',
					query: { actor: 'sam@company.com' },
				},
			);
			expectLogged('activities.list', { count: 1 });
		});
	});

	describe('Files', () => {
		it('files.create sends POST /files', async () => {
			const raw = { count: 1, files: [{ jnid: 'f1', filename: 'file.txt' }] };
			mockedRequest.mockResolvedValue(raw);

			const result = await Files.create(ctx, {
				data: 'aGVsbG8=',
				filename: 'file.txt',
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith('/files', 'test-api-token', {
				method: 'POST',
				body: { data: 'aGVsbG8=', filename: 'file.txt' },
			});
			expectLogged('files.create', { count: 1 });
		});

		it('files.createFromUrl sends POST /files/fromUrl', async () => {
			const raw = { id: 'f1' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Files.createFromUrl(ctx, {
				url: 'https://example.com/pic.jpg',
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/files/fromUrl',
				'test-api-token',
				{
					method: 'POST',
					body: { url: 'https://example.com/pic.jpg' },
				},
			);
			expectLogged('files.create_from_url', { count: 1 });
		});

		it('files.requestSinglePartUpload sends POST to files API host', async () => {
			const raw = { data: { presignedUrl: 'https://s3/test', jnid: 'f1' } };
			mockedRequest.mockResolvedValue(raw);

			const result = await Files.requestSinglePartUpload(ctx, {
				filename: 'doc.pdf',
				type: 1,
				related: ['c1'],
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/files/v1/uploads/url',
				'test-api-token',
				expect.objectContaining({
					method: 'POST',
					baseUrl: 'https://api.jobnimbus.com',
				}),
			);
			expectLogged('files.request_single_part_upload', { count: 1 });
		});

		it('files.completeSinglePartUpload sends POST to files complete URL', async () => {
			const raw = { data: { jnid: 'f1', thumbnailUrl: 'https://thumb' } };
			mockedRequest.mockResolvedValue(raw);

			const result = await Files.completeSinglePartUpload(ctx, {
				jnid: 'f1',
				generateThumbnail: true,
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/files/v1/uploads/f1/complete',
				'test-api-token',
				expect.objectContaining({
					method: 'POST',
					query: { generateThumbnail: true },
					baseUrl: 'https://api.jobnimbus.com',
				}),
			);
			expectLogged('files.complete_single_part_upload', { count: 1 });
		});

		it('files.requestMultipartUpload sends POST multi-urls', async () => {
			const raw = {
				data: { presignedUrls: ['https://s3/p1'], jnid: 'f1', uploadId: 'u1' },
			};
			mockedRequest.mockResolvedValue(raw);

			const result = await Files.requestMultipartUpload(ctx, {
				partCount: 1,
				fileSize: 1000,
				isPrivate: false,
				related: ['c1'],
				type: 1,
				filename: 'video.mp4',
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/files/v1/uploads/multi-urls',
				'test-api-token',
				expect.objectContaining({
					method: 'POST',
					baseUrl: 'https://api.jobnimbus.com',
				}),
			);
			expectLogged('files.request_multipart_upload', { count: 1 });
		});

		it('files.completeMultipartUpload sends POST with parts and uploadId', async () => {
			const raw = { jnid: 'f1' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Files.completeMultipartUpload(ctx, {
				jnid: 'f1',
				uploadId: 'u1',
				parts: [{ partNumber: 1, etag: 'etag1' }],
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/files/v1/uploads/f1/complete',
				'test-api-token',
				expect.objectContaining({
					method: 'POST',
					body: {
						jnid: 'f1',
						uploadId: 'u1',
						parts: [{ partNumber: 1, etag: 'etag1' }],
					},
					baseUrl: 'https://api.jobnimbus.com',
				}),
			);
			expectLogged('files.complete_multipart_upload', { count: 1 });
		});

		it('files.abortMultipartUpload sends POST multi-abort', async () => {
			const raw = { success: true };
			mockedRequest.mockResolvedValue(raw);

			const result = await Files.abortMultipartUpload(ctx, {
				key: 'k1',
				uploadId: 'u1',
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/files/v1/uploads/multi-abort',
				'test-api-token',
				expect.objectContaining({
					method: 'POST',
					baseUrl: 'https://api.jobnimbus.com',
				}),
			);
			expectLogged('files.abort_multipart_upload', { count: 1 });
		});

		it('files.list sends GET /files', async () => {
			const raw = { count: 1, files: [{ jnid: 'f1', filename: 'file.txt' }] };
			mockedRequest.mockResolvedValue(raw);

			const result = await Files.list(ctx, { actor: 'sam@company.com' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith('/files', 'test-api-token', {
				method: 'GET',
				query: { actor: 'sam@company.com' },
			});
			expectLogged('files.list', { count: 1 });
		});

		it('files.get sends GET /files/{jnid}', async () => {
			const raw = { jnid: 'f1', filename: 'file.txt' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Files.get(ctx, { jnid: 'f1' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/files/f1',
				'test-api-token',
				expect.objectContaining({
					method: 'GET',
					baseUrl: 'https://app.jobnimbus.com',
				}),
			);
			expectLogged('files.get', { count: 1 });
		});
	});

	describe('Products', () => {
		it('products.create sends POST /v2/products', async () => {
			const raw = { jnid: 'p1', name: 'Nails' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Products.create(ctx, { name: 'Nails' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/products',
				'test-api-token',
				{
					method: 'POST',
					body: { name: 'Nails' },
				},
			);
			expectLogged('products.create', { count: 1 });
		});

		it('products.update sends PUT /v2/products/{jnid}', async () => {
			const raw = { jnid: 'p1', name: 'Nails 2' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Products.update(ctx, {
				jnid: 'p1',
				name: 'Nails 2',
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/products/p1',
				'test-api-token',
				{
					method: 'PUT',
					body: { name: 'Nails 2' },
				},
			);
			expectLogged('products.update', { count: 1 });
		});

		it('products.delete sends PUT /v2/products/{jnid} with is_active: false', async () => {
			const raw = { jnid: 'p1', is_active: false };
			mockedRequest.mockResolvedValue(raw);

			const result = await Products.delete(ctx, { jnid: 'p1' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/products/p1',
				'test-api-token',
				{
					method: 'PUT',
					body: { is_active: false },
				},
			);
			expectLogged('products.delete', { count: 1 });
		});

		it('products.get sends GET /v2/products/{jnid}', async () => {
			const raw = { jnid: 'p1', name: 'Nails' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Products.get(ctx, { jnid: 'p1' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/products/p1',
				'test-api-token',
				{
					method: 'GET',
				},
			);
			expectLogged('products.get', { count: 1 });
		});

		it('products.list sends GET /v2/products', async () => {
			const raw = { count: 1, results: [{ jnid: 'p1', name: 'Nails' }] };
			mockedRequest.mockResolvedValue(raw);

			const result = await Products.list(ctx, { actor: 'sam@company.com' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/products',
				'test-api-token',
				{
					method: 'GET',
					query: { actor: 'sam@company.com' },
				},
			);
			expectLogged('products.list', { count: 1 });
		});
	});

	describe('MaterialOrders', () => {
		it('materialOrders.create sends POST /v2/materialorders', async () => {
			const raw = { jnid: 'mo1', customer_note: 'Deliver now' };
			mockedRequest.mockResolvedValue(raw);

			const result = await MaterialOrders.create(ctx, {
				customer_note: 'Deliver now',
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/materialorders',
				'test-api-token',
				{
					method: 'POST',
					body: { customer_note: 'Deliver now' },
				},
			);
			expectLogged('material_orders.create', { count: 1 });
		});

		it('materialOrders.update sends PUT /v2/materialorders/{jnid}', async () => {
			const raw = { jnid: 'mo1', customer_note: 'Updated note' };
			mockedRequest.mockResolvedValue(raw);

			const result = await MaterialOrders.update(ctx, {
				jnid: 'mo1',
				customer_note: 'Updated note',
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/materialorders/mo1',
				'test-api-token',
				{
					method: 'PUT',
					body: { customer_note: 'Updated note' },
				},
			);
			expectLogged('material_orders.update', { count: 1 });
		});

		it('materialOrders.delete sends PUT /v2/materialorders/{jnid} with is_active: false', async () => {
			const raw = { jnid: 'mo1', is_active: false };
			mockedRequest.mockResolvedValue(raw);

			const result = await MaterialOrders.delete(ctx, { jnid: 'mo1' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/materialorders/mo1',
				'test-api-token',
				{
					method: 'PUT',
					body: { is_active: false },
				},
			);
			expectLogged('material_orders.delete', { count: 1 });
		});

		it('materialOrders.get sends GET /v2/materialorders/{jnid}', async () => {
			const raw = { jnid: 'mo1', customer_note: 'Note' };
			mockedRequest.mockResolvedValue(raw);

			const result = await MaterialOrders.get(ctx, { jnid: 'mo1' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/materialorders/mo1',
				'test-api-token',
				{
					method: 'GET',
				},
			);
			expectLogged('material_orders.get', { count: 1 });
		});

		it('materialOrders.list sends GET /v2/materialorders', async () => {
			const raw = {
				count: 1,
				results: [{ jnid: 'mo1', customer_note: 'Note' }],
			};
			mockedRequest.mockResolvedValue(raw);

			const result = await MaterialOrders.list(ctx, {
				actor: 'sam@company.com',
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/materialorders',
				'test-api-token',
				{
					method: 'GET',
					query: { actor: 'sam@company.com' },
				},
			);
			expectLogged('material_orders.list', { count: 1 });
		});
	});

	describe('WorkOrders', () => {
		it('workOrders.create sends POST /v2/workorders', async () => {
			const raw = { jnid: 'wo1', customer: 'c1' };
			mockedRequest.mockResolvedValue(raw);

			const result = await WorkOrders.create(ctx, { customer: 'c1' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/workorders',
				'test-api-token',
				{
					method: 'POST',
					body: { customer: 'c1' },
				},
			);
			expectLogged('work_orders.create', { count: 1 });
		});

		it('workOrders.update sends PUT /v2/workorders/{id}', async () => {
			const raw = { jnid: 'wo1', customer: 'c1' };
			mockedRequest.mockResolvedValue(raw);

			const result = await WorkOrders.update(ctx, {
				id: 'wo1',
				customer: 'c1',
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/workorders/wo1',
				'test-api-token',
				{
					method: 'PUT',
					body: { customer: 'c1' },
				},
			);
			expectLogged('work_orders.update', { count: 1 });
		});

		it('workOrders.delete sends PUT /v2/workorders/{id} with is_active: false', async () => {
			const raw = { jnid: 'wo1', is_active: false };
			mockedRequest.mockResolvedValue(raw);

			const result = await WorkOrders.delete(ctx, { id: 'wo1' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/workorders/wo1',
				'test-api-token',
				{
					method: 'PUT',
					body: { is_active: false },
				},
			);
			expectLogged('work_orders.delete', { count: 1 });
		});

		it('workOrders.get sends GET /v2/workorders/{jnid}', async () => {
			const raw = { jnid: 'wo1', customer: 'c1' };
			mockedRequest.mockResolvedValue(raw);

			const result = await WorkOrders.get(ctx, { jnid: 'wo1' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/workorders/wo1',
				'test-api-token',
				{
					method: 'GET',
				},
			);
			expectLogged('work_orders.get', { count: 1 });
		});

		it('workOrders.list sends GET /v2/workorders', async () => {
			const raw = { count: 1, results: [{ jnid: 'wo1', customer: 'c1' }] };
			mockedRequest.mockResolvedValue(raw);

			const result = await WorkOrders.list(ctx, { actor: 'sam@company.com' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/workorders',
				'test-api-token',
				{
					method: 'GET',
					query: { actor: 'sam@company.com' },
				},
			);
			expectLogged('work_orders.list', { count: 1 });
		});
	});

	describe('Estimates', () => {
		it('estimates.create sends POST /v2/estimates', async () => {
			const raw = { jnid: 'e1', number: 'EST-101' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Estimates.create(ctx, { number: 'EST-101' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/estimates',
				'test-api-token',
				{
					method: 'POST',
					body: { number: 'EST-101' },
				},
			);
			expectLogged('estimates.create', { count: 1 });
		});

		it('estimates.update sends PUT /v2/estimates/{jnid}', async () => {
			const raw = { jnid: 'e1', number: 'EST-102' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Estimates.update(ctx, {
				jnid: 'e1',
				number: 'EST-102',
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/estimates/e1',
				'test-api-token',
				{
					method: 'PUT',
					body: { number: 'EST-102' },
				},
			);
			expectLogged('estimates.update', { count: 1 });
		});

		it('estimates.delete sends PUT /v2/estimates/{jnid} with is_active: false', async () => {
			const raw = { jnid: 'e1', is_active: false };
			mockedRequest.mockResolvedValue(raw);

			const result = await Estimates.delete(ctx, { jnid: 'e1' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/estimates/e1',
				'test-api-token',
				{
					method: 'PUT',
					body: { is_active: false },
				},
			);
			expectLogged('estimates.delete', { count: 1 });
		});

		it('estimates.get sends GET /v2/estimates/{jnid}', async () => {
			const raw = { jnid: 'e1', number: 'EST-101' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Estimates.get(ctx, { jnid: 'e1' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/estimates/e1',
				'test-api-token',
				{
					method: 'GET',
				},
			);
			expectLogged('estimates.get', { count: 1 });
		});

		it('estimates.list sends GET /v2/estimates', async () => {
			const raw = { count: 1, results: [{ jnid: 'e1', number: 'EST-101' }] };
			mockedRequest.mockResolvedValue(raw);

			const result = await Estimates.list(ctx, { actor: 'sam@company.com' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/estimates',
				'test-api-token',
				{
					method: 'GET',
					query: { actor: 'sam@company.com' },
				},
			);
			expectLogged('estimates.list', { count: 1 });
		});
	});

	describe('Invoices', () => {
		it('invoices.create sends POST /v2/invoices', async () => {
			const raw = { jnid: 'inv1', number: 'INV-101' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Invoices.create(ctx, { number: 'INV-101' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/invoices',
				'test-api-token',
				{
					method: 'POST',
					body: { number: 'INV-101' },
				},
			);
			expectLogged('invoices.create', { count: 1 });
		});

		it('invoices.update sends PUT /v2/invoices/{jnid}', async () => {
			const raw = { jnid: 'inv1', number: 'INV-102' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Invoices.update(ctx, {
				jnid: 'inv1',
				number: 'INV-102',
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/invoices/inv1',
				'test-api-token',
				{
					method: 'PUT',
					body: { number: 'INV-102' },
				},
			);
			expectLogged('invoices.update', { count: 1 });
		});

		it('invoices.delete sends PUT /v2/invoices/{jnid} with is_active: false', async () => {
			const raw = { jnid: 'inv1', is_active: false };
			mockedRequest.mockResolvedValue(raw);

			const result = await Invoices.delete(ctx, { jnid: 'inv1' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/invoices/inv1',
				'test-api-token',
				{
					method: 'PUT',
					body: { is_active: false },
				},
			);
			expectLogged('invoices.delete', { count: 1 });
		});

		it('invoices.get sends GET /v2/invoices/{jnid}', async () => {
			const raw = { jnid: 'inv1', number: 'INV-101' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Invoices.get(ctx, { jnid: 'inv1' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/invoices/inv1',
				'test-api-token',
				{
					method: 'GET',
				},
			);
			expectLogged('invoices.get', { count: 1 });
		});

		it('invoices.list sends GET /v2/invoices', async () => {
			const raw = { count: 1, results: [{ jnid: 'inv1', number: 'INV-101' }] };
			mockedRequest.mockResolvedValue(raw);

			const result = await Invoices.list(ctx, { actor: 'sam@company.com' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/invoices',
				'test-api-token',
				{
					method: 'GET',
					query: { actor: 'sam@company.com' },
				},
			);
			expectLogged('invoices.list', { count: 1 });
		});
	});

	describe('Payments', () => {
		it('payments.list sends GET /payments', async () => {
			const raw = { count: 1, results: [{ jnid: 'pay1', total: 100 }] };
			mockedRequest.mockResolvedValue(raw);

			const result = await Payments.list(ctx, { actor: 'sam@company.com' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/payments',
				'test-api-token',
				{
					method: 'GET',
					query: { actor: 'sam@company.com' },
				},
			);
			expectLogged('payments.list', { count: 1 });
		});

		it('payments.create sends POST to api2 payments', async () => {
			const raw = { jnid: 'pay1', isSuccess: true, message: 'Saved' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Payments.create(ctx, {
				customer: 'c1',
				date_payment: 1700000000,
				total: 100,
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/v2/payments',
				'test-api-token',
				expect.objectContaining({
					method: 'POST',
					baseUrl: 'https://app.jobnimbus.com/api2',
				}),
			);
			expectLogged('payments.create', { count: 1 });
		});
	});

	describe('Budgets', () => {
		it('budgets.list sends GET /budgets', async () => {
			const raw = { count: 1, results: [{ jnid: 'b1' }] };
			mockedRequest.mockResolvedValue(raw);

			const result = await Budgets.list(ctx, { actor: 'sam@company.com' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith('/budgets', 'test-api-token', {
				method: 'GET',
				query: { actor: 'sam@company.com' },
			});
			expectLogged('budgets.list', { count: 1 });
		});
	});

	describe('Account', () => {
		it('account.getSettings sends GET /account/settings', async () => {
			const raw = { workflows: [] };
			mockedRequest.mockResolvedValue(raw);

			const result = await Account.getSettings(ctx, {});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/account/settings',
				'test-api-token',
				{
					method: 'GET',
					query: {},
				},
			);
			expectLogged('account.get_settings', { count: 1 });
		});

		it('account.getGroups sends GET /account/settings?field=groups', async () => {
			const raw = [{ name: 'Sales' }];
			mockedRequest.mockResolvedValue(raw);

			const result = await Account.getGroups(ctx, {});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/account/settings',
				'test-api-token',
				{
					method: 'GET',
					query: { field: 'groups' },
				},
			);
			expectLogged('account.get_groups', { count: 1 });
		});

		it('account.getUsers sends GET /account/users', async () => {
			const raw = { users: [{ id: 'u1', email: 'test@example.com' }] };
			mockedRequest.mockResolvedValue(raw);

			const result = await Account.getUsers(ctx, {});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/account/users',
				'test-api-token',
				{
					method: 'GET',
				},
			);
			expectLogged('account.get_users', { count: 1 });
		});

		it('account.getUoms sends GET /utility/uoms', async () => {
			const raw = ['SQ', 'EA'];
			mockedRequest.mockResolvedValue(raw);

			const result = await Account.getUoms(ctx, {});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/utility/uoms',
				'test-api-token',
				{
					method: 'GET',
				},
			);
			expectLogged('account.get_uoms', { count: 2 });
		});

		it('account.createWorkflow sends POST /account/workflow', async () => {
			const raw = { id: 1, name: 'Commercial' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Account.createWorkflow(ctx, {
				name: 'Commercial',
				object_type: 'job',
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/account/workflow',
				'test-api-token',
				{
					method: 'POST',
					body: { name: 'Commercial', object_type: 'job' },
				},
			);
			expectLogged('account.create_workflow', { count: 1 });
		});

		it('account.createWorkflowStatus sends POST to status endpoint', async () => {
			const raw = { id: 2, name: 'In Progress' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Account.createWorkflowStatus(ctx, {
				workflowid: 'wf1',
				name: 'In Progress',
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/account/workflow/wf1/status',
				'test-api-token',
				{
					method: 'POST',
					body: { name: 'In Progress' },
				},
			);
			expectLogged('account.create_workflow_status', { count: 1 });
		});

		it('account.createLeadSource sends POST /account/leadsource', async () => {
			const raw = { JobSourceId: 1, SourceName: 'Google' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Account.createLeadSource(ctx, {
				SourceName: 'Google',
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/account/leadsource',
				'test-api-token',
				{
					method: 'POST',
					body: { SourceName: 'Google' },
				},
			);
			expectLogged('account.create_lead_source', { count: 1 });
		});

		it('account.createCustomField sends POST /account/customfield', async () => {
			const raw = { id: 10, title: 'Claim Number' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Account.createCustomField(ctx, {
				title: 'Claim Number',
				object_type: 'job',
				type: 'string',
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/account/customfield',
				'test-api-token',
				{
					method: 'POST',
					body: { title: 'Claim Number', object_type: 'job', type: 'string' },
				},
			);
			expectLogged('account.create_custom_field', { count: 1 });
		});

		it('account.createFileType sends POST /account/filetype', async () => {
			const raw = { FileTypeId: 1, TypeName: 'Document' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Account.createFileType(ctx, {
				TypeName: 'Document',
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/account/filetype',
				'test-api-token',
				{
					method: 'POST',
					body: { TypeName: 'Document' },
				},
			);
			expectLogged('account.create_file_type', { count: 1 });
		});

		it('account.createTaskType sends POST /account/tasktype', async () => {
			const raw = { TaskTypeId: 1, TypeName: 'Meeting' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Account.createTaskType(ctx, { TypeName: 'Meeting' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/account/tasktype',
				'test-api-token',
				{
					method: 'POST',
					body: { TypeName: 'Meeting' },
				},
			);
			expectLogged('account.create_task_type', { count: 1 });
		});

		it('account.createActivityType sends POST /account/activitytype', async () => {
			const raw = { ActivityTypeId: 1, TypeName: 'Call' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Account.createActivityType(ctx, {
				TypeName: 'Call',
			});
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/account/activitytype',
				'test-api-token',
				{
					method: 'POST',
					body: { TypeName: 'Call' },
				},
			);
			expectLogged('account.create_activity_type', { count: 1 });
		});

		it('account.createLocation sends POST /account/location', async () => {
			const raw = { id: 1, name: 'HQ' };
			mockedRequest.mockResolvedValue(raw);

			const result = await Account.createLocation(ctx, { name: 'HQ' });
			expect(result).toEqual(raw);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/account/location',
				'test-api-token',
				{
					method: 'POST',
					body: { name: 'HQ' },
				},
			);
			expectLogged('account.create_location', { count: 1 });
		});
	});
});
