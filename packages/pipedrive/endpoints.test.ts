import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Activities,
	Deals,
	Organizations,
	Persons,
	Products,
	Tasks,
} from './endpoints';
import { pipedriveCatalogEndpointFunctions } from './endpoints/catalog-registry';
import { PipedriveCatalog } from './endpoints/catalog-schemas';
import {
	PipedriveCatalogOperationKeys,
	PipedriveCatalogTestCases,
} from './endpoints/catalog-test-cases';
import type { PipedriveContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});
jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makePipedriveRequest: jest.fn(),
		makePipedriveBinaryRequest: jest.fn(),
	};
});

const mockedRequest = jest.mocked(client.makePipedriveRequest);
const mockedBinaryRequest = jest.mocked(client.makePipedriveBinaryRequest);
const mockedLog = jest.mocked(logEventFromContext);
type EndpointContext = Parameters<typeof Deals.list>[0];

function context(): EndpointContext {
	const ctx: PipedriveContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-token',
		options: { authType: 'api_key' },
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-token'),
			set_api_key: () => Promise.resolve(),
			get_access_token: () => Promise.resolve('oauth-token'),
			set_access_token: () => Promise.resolve(),
			get_refresh_token: () => Promise.resolve(null),
			set_refresh_token: () => Promise.resolve(),
			get_expires_at: () => Promise.resolve(null),
			set_expires_at: () => Promise.resolve(),
			get_scope: () => Promise.resolve(null),
			set_scope: () => Promise.resolve(),
			get_integration_credentials: () =>
				Promise.resolve({
					client_id: null,
					client_secret: null,
					redirect_url: null,
				}),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

const ctx = context();
const deal = { id: 12, title: 'Synthetic opportunity', status: 'open' };
const person = { id: 18, name: 'Synthetic person' };
const organization = {
	id: 23,
	name: 'Synthetic organization',
	address: null,
	custom_fields: { segment: 'enterprise' },
};
const activity = {
	id: 31,
	subject: 'Synthetic follow-up',
	type: 'call',
	deal_id: null,
	outcome: null,
};
const task = {
	id: 42,
	title: 'Synthetic project task',
	creator_id: 7,
	description: null,
	project_id: 11,
	is_done: false,
	is_milestone: false,
	due_date: null,
	start_date: null,
	parent_task_id: null,
	assignee_ids: [],
	priority: null,
	add_time: '2025-01-01T10:00:00Z',
	update_time: '2025-01-01T10:00:00Z',
	marked_as_done_time: null,
};
const product = {
	id: 52,
	name: 'Synthetic product',
	code: 'SYN-52',
	unit: 'unit',
	tax: 0,
	is_deleted: false,
	is_linkable: true,
	visible_to: 3,
	owner_id: 7,
	add_time: '2025-01-01T10:00:00Z',
	update_time: '2025-01-01T10:00:00Z',
	description: 'Synthetic product description',
	category: null,
	custom_fields: { tag: 'synthetic' },
	billing_frequency: 'one-time',
	billing_frequency_cycles: null,
	prices: [{ price: 20, currency: 'USD', product_id: 52 }],
};
const productVariation = {
	id: 53,
	name: 'Small',
	product_id: 52,
	prices: [{ price: 20, currency: 'USD', product_variation_id: 53 }],
};

beforeEach(() => {
	mockedRequest.mockReset();
	mockedBinaryRequest.mockReset();
	mockedLog.mockReset();
});

describe('Pipedrive deal endpoints', () => {
	it('lists deals with documented filters, comma-separated arrays, and cursor', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			data: [deal],
			additional_data: { next_cursor: 'next' },
		});
		const result = await Deals.list(ctx, {
			status: ['open', 'won'],
			include_fields: ['products_count'],
			limit: 100,
			cursor: 'opaque',
		});
		expect(result.data).toHaveLength(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/deals',
			'test-api-token',
			'api_key',
			{
				method: 'GET',
				query: {
					status: 'open,won',
					include_fields: 'products_count',
					limit: 100,
					cursor: 'opaque',
				},
			},
		);
	});

	it('gets a deal with path ID and include-field query', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: deal });
		await Deals.get(ctx, { id: 12, include_fields: ['products_count'] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/deals/12',
			'test-api-token',
			'api_key',
			{
				method: 'GET',
				query: { include_fields: 'products_count' },
			},
		);
	});

	it('creates a deal with the documented JSON body', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: deal });
		await Deals.create(ctx, {
			title: 'Synthetic opportunity',
			value: 250,
			currency: 'USD',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/deals',
			'test-api-token',
			'api_key',
			{
				method: 'POST',
				body: { title: 'Synthetic opportunity', value: 250, currency: 'USD' },
			},
		);
	});

	it('updates a deal with PATCH and keeps ID out of the body', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: deal });
		await Deals.update(ctx, { id: 12, title: 'Renamed opportunity' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/deals/12',
			'test-api-token',
			'api_key',
			{
				method: 'PATCH',
				body: { title: 'Renamed opportunity' },
			},
		);
	});

	it('deletes a deal and validates the deletion response', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: { id: 12 } });
		await Deals.delete(ctx, { id: 12 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/deals/12',
			'test-api-token',
			'api_key',
			{
				method: 'DELETE',
			},
		);
	});

	it('rejects invalid input before network activity and logs no deal fields', async () => {
		await expect(
			Reflect.apply(Deals.create, undefined, [
				ctx,
				{ title: 'x', callback: 'https://synthetic.invalid' },
			]),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
		mockedRequest.mockResolvedValue({ success: true, data: deal });
		await Deals.create(ctx, { title: 'Private customer opportunity' });
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'pipedrive.deals.create',
			{},
			'completed',
		);
		expect(JSON.stringify(mockedLog.mock.calls)).not.toContain(
			'Private customer opportunity',
		);
	});
});

describe('Pipedrive person endpoints', () => {
	it('lists persons with documented filters, comma-separated arrays, and cursor', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			data: [person],
			additional_data: { next_cursor: 'person-next' },
		});
		const result = await Persons.list(ctx, {
			ids: [18, 19],
			include_fields: ['open_deals_count'],
			limit: 100,
			cursor: 'person-cursor',
		});
		expect(result.data).toHaveLength(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/persons',
			'test-api-token',
			'api_key',
			{
				method: 'GET',
				query: {
					ids: '18,19',
					include_fields: 'open_deals_count',
					limit: 100,
					cursor: 'person-cursor',
				},
			},
		);
	});

	it('gets a person with path ID and include-field query', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: person });
		await Persons.get(ctx, { id: 18, include_fields: ['open_deals_count'] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/persons/18',
			'test-api-token',
			'api_key',
			{ method: 'GET', query: { include_fields: 'open_deals_count' } },
		);
	});

	it('creates a person with the documented JSON body', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: person });
		await Persons.create(ctx, {
			name: 'Synthetic person',
			emails: [{ value: 'person@example.test', primary: true, label: 'work' }],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/persons',
			'test-api-token',
			'api_key',
			{
				method: 'POST',
				body: {
					name: 'Synthetic person',
					emails: [
						{ value: 'person@example.test', primary: true, label: 'work' },
					],
				},
			},
		);
	});

	it('updates a person with PATCH and keeps ID out of the body', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: person });
		await Persons.update(ctx, { id: 18, name: 'Renamed person' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/persons/18',
			'test-api-token',
			'api_key',
			{ method: 'PATCH', body: { name: 'Renamed person' } },
		);
	});

	it('deletes a person and validates the deletion response', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: { id: 18 } });
		await Persons.delete(ctx, { id: 18 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/persons/18',
			'test-api-token',
			'api_key',
			{ method: 'DELETE' },
		);
	});

	it('rejects invalid person input before network activity and redacts contact data from logs', async () => {
		await expect(
			Reflect.apply(Persons.create, undefined, [
				ctx,
				{ name: 'Synthetic person', callback: 'https://synthetic.invalid' },
			]),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
		mockedRequest.mockResolvedValue({ success: true, data: person });
		await Persons.create(ctx, {
			name: 'Synthetic person',
			emails: [{ value: 'private@example.test' }],
		});
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'pipedrive.persons.create',
			{},
			'completed',
		);
		expect(JSON.stringify(mockedLog.mock.calls)).not.toContain(
			'private@example.test',
		);
	});
});

describe('Pipedrive organization endpoints', () => {
	it('lists organizations with filters, comma-separated arrays, and cursor', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			data: [organization],
			additional_data: { next_cursor: 'organization-next' },
		});
		const result = await Organizations.list(ctx, {
			ids: [23, 24],
			include_fields: ['people_count'],
			custom_fields: ['field_hash'],
			limit: 100,
			cursor: 'organization-cursor',
		});
		expect(result.data).toHaveLength(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/organizations',
			'test-api-token',
			'api_key',
			{
				method: 'GET',
				query: {
					ids: '23,24',
					include_fields: 'people_count',
					custom_fields: 'field_hash',
					limit: 100,
					cursor: 'organization-cursor',
				},
			},
		);
	});

	it('gets an organization with include and custom-field queries', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: organization });
		await Organizations.get(ctx, {
			id: 23,
			include_fields: ['people_count'],
			custom_fields: ['field_hash'],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/organizations/23',
			'test-api-token',
			'api_key',
			{
				method: 'GET',
				query: {
					include_fields: 'people_count',
					custom_fields: 'field_hash',
				},
			},
		);
	});

	it('creates an organization with documented JSON fields', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: organization });
		await Organizations.create(ctx, {
			name: 'Synthetic organization',
			address: { value: '100 Example Street', country: null },
			custom_fields: { segment: 'enterprise' },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/organizations',
			'test-api-token',
			'api_key',
			{
				method: 'POST',
				body: {
					name: 'Synthetic organization',
					address: { value: '100 Example Street', country: null },
					custom_fields: { segment: 'enterprise' },
				},
			},
		);
	});

	it('updates an organization with PATCH and keeps ID out of the body', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: organization });
		await Organizations.update(ctx, {
			id: 23,
			name: 'Renamed organization',
			website: null,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/organizations/23',
			'test-api-token',
			'api_key',
			{
				method: 'PATCH',
				body: { name: 'Renamed organization', website: null },
			},
		);
	});

	it('deletes an organization and validates the deletion response', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: { id: 23 } });
		await Organizations.delete(ctx, { id: 23 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/organizations/23',
			'test-api-token',
			'api_key',
			{ method: 'DELETE' },
		);
	});

	it('rejects invalid input before network activity and omits organization data from logs', async () => {
		await expect(
			Reflect.apply(Organizations.create, undefined, [
				ctx,
				{
					name: 'Synthetic organization',
					callback: 'https://synthetic.invalid',
				},
			]),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
		mockedRequest.mockResolvedValue({ success: true, data: organization });
		await Organizations.create(ctx, { name: 'Private customer company' });
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'pipedrive.organizations.create',
			{},
			'completed',
		);
		expect(JSON.stringify(mockedLog.mock.calls)).not.toContain(
			'Private customer company',
		);
	});
});

describe('Pipedrive activity endpoints', () => {
	it('lists activities with documented filters, comma-separated arrays, and cursor', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			data: [activity],
			additional_data: { next_cursor: 'activity-next' },
		});
		const result = await Activities.list(ctx, {
			ids: [31, 32],
			include_fields: ['attendees'],
			sort_by: 'due_date',
			limit: 100,
			cursor: 'activity-cursor',
		});
		expect(result.data).toHaveLength(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/activities',
			'test-api-token',
			'api_key',
			{
				method: 'GET',
				query: {
					ids: '31,32',
					include_fields: 'attendees',
					sort_by: 'due_date',
					limit: 100,
					cursor: 'activity-cursor',
				},
			},
		);
	});

	it('gets an activity with its optional attendees query', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: activity });
		await Activities.get(ctx, { id: 31, include_fields: ['attendees'] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/activities/31',
			'test-api-token',
			'api_key',
			{ method: 'GET', query: { include_fields: 'attendees' } },
		);
	});

	it('creates an activity with participant-based person assignment and JSON body', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: activity });
		await Activities.create(ctx, {
			subject: 'Synthetic follow-up',
			type: 'call',
			participants: [{ person_id: 18, primary: true }],
			outcome: null,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/activities',
			'test-api-token',
			'api_key',
			{
				method: 'POST',
				body: {
					subject: 'Synthetic follow-up',
					type: 'call',
					participants: [{ person_id: 18, primary: true }],
					outcome: null,
				},
			},
		);
	});

	it('updates an activity by path ID and keeps the ID out of the body', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: activity });
		await Activities.update(ctx, { id: 31, done: true });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/activities/31',
			'test-api-token',
			'api_key',
			{ method: 'PATCH', body: { done: true } },
		);
	});

	it('deletes an activity and validates the deleted ID response', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: { id: 31 } });
		await Activities.delete(ctx, { id: 31 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/activities/31',
			'test-api-token',
			'api_key',
			{ method: 'DELETE' },
		);
	});

	it('rejects undocumented activity fields before network activity and omits notes from logs', async () => {
		await expect(
			Reflect.apply(Activities.create, undefined, [
				ctx,
				{ subject: 'Private note', callback: 'https://synthetic.invalid' },
			]),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
		mockedRequest.mockResolvedValue({ success: true, data: activity });
		await Activities.create(ctx, { note: 'Private activity details' });
		expect(JSON.stringify(mockedLog.mock.calls)).not.toContain(
			'Private activity details',
		);
	});
});

describe('Pipedrive task endpoints', () => {
	it('lists tasks with cursor pagination, filters, and the root-task null filter', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			data: [task],
			additional_data: { next_cursor: 'task-next' },
		});
		const result = await Tasks.list(ctx, {
			is_done: false,
			is_milestone: true,
			assignee_id: 7,
			project_id: 11,
			parent_task_id: null,
			limit: 100,
			cursor: 'task-cursor',
		});
		expect(result.data).toHaveLength(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/tasks',
			'test-api-token',
			'api_key',
			{
				method: 'GET',
				query: {
					is_done: false,
					is_milestone: true,
					assignee_id: 7,
					project_id: 11,
					parent_task_id: 'null',
					limit: 100,
					cursor: 'task-cursor',
				},
			},
		);
	});

	it('gets a task by numeric path ID', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			data: task,
			additional_data: null,
		});
		const result = await Tasks.get(ctx, { id: 42 });
		expect(result.data?.id).toBe(42);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/tasks/42',
			'test-api-token',
			'api_key',
			{ method: 'GET' },
		);
	});

	it('creates a task using required project fields and documented integer flags', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			data: task,
			additional_data: null,
		});
		await Tasks.create(ctx, {
			title: 'Synthetic project task',
			project_id: 11,
			done: 0,
			milestone: 1,
			assignee_ids: [7, 8],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/tasks',
			'test-api-token',
			'api_key',
			{
				method: 'POST',
				body: {
					title: 'Synthetic project task',
					project_id: 11,
					done: 0,
					milestone: 1,
					assignee_ids: [7, 8],
				},
			},
		);
	});

	it('updates a task by path ID and validates its response envelope', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			data: task,
			additional_data: null,
		});
		await Tasks.update(ctx, { id: 42, done: 1, description: null });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/tasks/42',
			'test-api-token',
			'api_key',
			{ method: 'PATCH', body: { done: 1, description: null } },
		);
	});

	it('deletes a task by numeric path ID', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			data: { id: 42 },
			additional_data: null,
		});
		await Tasks.delete(ctx, { id: 42 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/tasks/42',
			'test-api-token',
			'api_key',
			{ method: 'DELETE' },
		);
	});

	it('rejects missing required task fields before network activity and omits private details from logs', async () => {
		await expect(
			Reflect.apply(Tasks.create, undefined, [ctx, { title: 'No project' }]),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
		mockedRequest.mockResolvedValue({
			success: true,
			data: task,
			additional_data: null,
		});
		await Tasks.create(ctx, {
			title: 'Private task title',
			project_id: 11,
		});
		expect(JSON.stringify(mockedLog.mock.calls)).not.toContain(
			'Private task title',
		);
	});
});

describe('Pipedrive product endpoints', () => {
	it('lists products with documented filters, comma-separated arrays, and cursor', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			data: [product],
			additional_data: { next_cursor: 'product-next' },
		});
		const result = await Products.list(ctx, {
			owner_id: 7,
			ids: [52, 53],
			custom_fields: ['field-a', 'field-b'],
			filter_id: 6,
			limit: 100,
			sort_by: 'name',
			sort_direction: 'desc',
			updated_since: '2025-01-01T00:00:00Z',
			cursor: 'product-cursor',
		});
		expect(result.data).toHaveLength(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/products',
			'test-api-token',
			'api_key',
			{
				method: 'GET',
				query: {
					owner_id: 7,
					ids: '52,53',
					custom_fields: 'field-a,field-b',
					filter_id: 6,
					limit: 100,
					sort_by: 'name',
					sort_direction: 'desc',
					updated_since: '2025-01-01T00:00:00Z',
					cursor: 'product-cursor',
				},
			},
		);
	});

	it('creates a product with documented fields and currency prices', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: product });
		await Products.create(ctx, {
			name: 'Synthetic product',
			code: 'SYN-52',
			category: 2,
			visible_to: 3,
			prices: [{ price: 20, currency: 'USD', cost: 8 }],
			billing_frequency: 'monthly',
			billing_frequency_cycles: null,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/products',
			'test-api-token',
			'api_key',
			{
				method: 'POST',
				body: {
					name: 'Synthetic product',
					code: 'SYN-52',
					category: 2,
					visible_to: 3,
					prices: [{ price: 20, currency: 'USD', cost: 8 }],
					billing_frequency: 'monthly',
					billing_frequency_cycles: null,
				},
			},
		);
	});

	it('searches products and forwards documented fields and pagination', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			data: {
				items: [
					{ result_score: 0.9, item: { id: 52, name: 'Synthetic product' } },
				],
			},
			additional_data: { next_cursor: null },
		});
		const result = await Products.search(ctx, {
			term: 'product',
			fields: ['name', 'code'],
			exact_match: false,
			include_fields: ['product.price'],
			limit: 25,
			cursor: 'search-cursor',
		});
		expect(result.data?.items).toHaveLength(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/products/search',
			'test-api-token',
			'api_key',
			{
				method: 'GET',
				query: {
					term: 'product',
					fields: 'name,code',
					exact_match: false,
					include_fields: 'product.price',
					limit: 25,
					cursor: 'search-cursor',
				},
			},
		);
	});

	it('gets a product by ID', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: product });
		await Products.get(ctx, { id: 52 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/products/52',
			'test-api-token',
			'api_key',
			{ method: 'GET' },
		);
	});

	it('updates a product with PATCH and excludes the ID from its body', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: product });
		await Products.update(ctx, { id: 52, name: 'Updated product', tax: 5 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/products/52',
			'test-api-token',
			'api_key',
			{ method: 'PATCH', body: { name: 'Updated product', tax: 5 } },
		);
	});

	it('deletes a product and validates its response', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: { id: 52 } });
		await Products.delete(ctx, { id: 52 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/products/52',
			'test-api-token',
			'api_key',
			{ method: 'DELETE' },
		);
	});

	it('duplicates a product with an empty JSON body (live API 400s on none)', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: product });
		await Products.duplicate(ctx, { id: 52 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/products/52/duplicate',
			'test-api-token',
			'api_key',
			{ method: 'POST', body: {} },
		);
	});

	it('lists product variations with cursor pagination', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			data: [productVariation],
			additional_data: { next_cursor: null },
		});
		const result = await Products.variations.list(ctx, {
			id: 52,
			limit: 500,
			cursor: 'variation-cursor',
		});
		expect(result.data).toHaveLength(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/products/52/variations',
			'test-api-token',
			'api_key',
			{ method: 'GET', query: { limit: 500, cursor: 'variation-cursor' } },
		);
	});

	it('creates a product variation with its required name and prices', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: productVariation });
		await Products.variations.create(ctx, {
			id: 52,
			name: 'Small',
			prices: [{ price: 20, currency: 'USD' }],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/products/52/variations',
			'test-api-token',
			'api_key',
			{
				method: 'POST',
				body: { name: 'Small', prices: [{ price: 20, currency: 'USD' }] },
			},
		);
	});

	it('updates a product variation with both IDs in the route', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: productVariation });
		await Products.variations.update(ctx, {
			id: 52,
			product_variation_id: 53,
			name: 'Medium',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/products/52/variations/53',
			'test-api-token',
			'api_key',
			{ method: 'PATCH', body: { name: 'Medium' } },
		);
	});

	it('deletes a product variation', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: { id: 53 } });
		await Products.variations.delete(ctx, { id: 52, product_variation_id: 53 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/products/52/variations/53',
			'test-api-token',
			'api_key',
			{ method: 'DELETE' },
		);
	});

	it('gets product image metadata', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			data: {
				id: 54,
				product_id: 52,
				public_url: 'https://images.synthetic.invalid/product.png',
			},
		});
		await Products.images.get(ctx, { id: 52 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/products/52/images',
			'test-api-token',
			'api_key',
			{ method: 'GET' },
		);
	});

	it.each(['upload', 'update'] as const)(
		'sends product image %s as multipart binary',
		async (action) => {
			mockedRequest.mockResolvedValue({
				success: true,
				data: { id: 54, product_id: 52 },
			});
			const image = new Blob(['synthetic image bytes'], { type: 'image/png' });
			await Products.images[action](ctx, { id: 52, data: image });
			const request = mockedRequest.mock.calls[0];
			expect(request?.[0]).toBe('/products/52/images');
			expect(request?.[2]).toBe('api_key');
			expect(request?.[3]?.method).toBe(action === 'upload' ? 'POST' : 'PUT');
			const body = request?.[3]?.body;
			expect(body).toBeInstanceOf(FormData);
			if (!(body instanceof FormData))
				throw new Error('Expected multipart body');
			const uploaded = body.get('data');
			// Live: an upload named `blob` (no extension) is stored but GET then 500s.
			expect(uploaded).toMatchObject({
				type: 'image/png',
				name: 'image.png',
			});
			if (!(uploaded instanceof File))
				throw new Error('Expected uploaded image');
			expect(await uploaded.text()).toBe('synthetic image bytes');
		},
	);

	it('sends the caller file name and maps jpeg to .jpg', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			data: { id: 54, product_id: 52 },
		});
		const jpeg = new Blob(['jpeg bytes'], { type: 'image/jpeg' });
		await Products.images.upload(ctx, { id: 52, data: jpeg });
		await Products.images.upload(ctx, {
			id: 52,
			data: jpeg,
			file_name: 'shoe.jpeg',
		});
		const names = mockedRequest.mock.calls.map((call) => {
			const body = call[3]?.body;
			const file = body instanceof FormData ? body.get('data') : null;
			return file instanceof File ? file.name : null;
		});
		expect(names).toEqual(['image.jpg', 'shoe.jpeg']);
		await expect(
			Products.images.upload(ctx, { id: 52, data: jpeg, file_name: 'shoe' }),
		).rejects.toThrow();
	});

	it('deletes a product image', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: { id: 54 } });
		await Products.images.delete(ctx, { id: 52 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/products/52/images',
			'test-api-token',
			'api_key',
			{ method: 'DELETE' },
		);
	});

	it('lists product followers with cursor pagination', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			data: [{ user_id: 7, add_time: '2025-01-01T00:00:00Z' }],
			additional_data: { next_cursor: null },
		});
		await Products.followers.list(ctx, {
			id: 52,
			limit: 100,
			cursor: 'follower-cursor',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/products/52/followers',
			'test-api-token',
			'api_key',
			{ method: 'GET', query: { limit: 100, cursor: 'follower-cursor' } },
		);
	});

	it('adds a product follower with documented user_id body', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			data: { user_id: 7, add_time: '2025-01-01T00:00:00Z' },
		});
		await Products.followers.create(ctx, { id: 52, user_id: 7 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/products/52/followers',
			'test-api-token',
			'api_key',
			{ method: 'POST', body: { user_id: 7 } },
		);
	});

	it('lists product follower changes with cursor pagination', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			data: [
				{
					action: 'added',
					actor_user_id: 7,
					follower_user_id: 8,
					time: '2025-01-01T00:00:00Z',
				},
			],
			additional_data: { next_cursor: null },
		});
		await Products.followers.changelog(ctx, {
			id: 52,
			limit: 50,
			cursor: 'change-cursor',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/products/52/followers/changelog',
			'test-api-token',
			'api_key',
			{ method: 'GET', query: { limit: 50, cursor: 'change-cursor' } },
		);
	});

	it('deletes a product follower by follower ID', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: { user_id: 7 } });
		await Products.followers.delete(ctx, { id: 52, follower_id: 7 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/products/52/followers/7',
			'test-api-token',
			'api_key',
			{ method: 'DELETE' },
		);
	});

	it('rejects undocumented product fields before network I/O and excludes private values from logs', async () => {
		await expect(
			Reflect.apply(Products.create, undefined, [
				ctx,
				{ name: 'Invalid', callback: 'https://synthetic.invalid' },
			]),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
		mockedRequest.mockResolvedValue({ success: true, data: product });
		await Products.create(ctx, { name: 'Confidential product title' });
		expect(JSON.stringify(mockedLog.mock.calls)).not.toContain(
			'Confidential product title',
		);
	});
});

// `unknown` is necessary because OpenAPI-generated test cases are checked dynamically by route key.
function catalogRecord(value: unknown): Record<string, unknown> {
	if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
		return Object.fromEntries(Object.entries(value));
	}
	return {};
}

describe('Pipedrive official OpenAPI catalog routes', () => {
	it.each(PipedriveCatalogOperationKeys)(
		'%s sends the documented version, method, path, query, and body',
		async (key) => {
			const route = PipedriveCatalog[key];
			const testCase = PipedriveCatalogTestCases[key];
			const endpoint = pipedriveCatalogEndpointFunctions[key];
			if (route.isBinary) {
				mockedBinaryRequest.mockResolvedValueOnce({
					content_type: 'application/octet-stream',
					base64: '',
					byte_length: 0,
				});
			} else {
				mockedRequest.mockResolvedValueOnce(testCase.response);
			}
			const result = await Reflect.apply(endpoint, undefined, [
				ctx,
				testCase.input,
			]);
			expect(result).toEqual(route.output.parse(testCase.response));
			if (route.isBinary) {
				expect(mockedBinaryRequest).toHaveBeenCalledWith(
					testCase.expected.path,
					'test-api-token',
					'api_key',
					expect.objectContaining({
						method: testCase.expected.method,
						query: testCase.expected.query,
						apiVersion: testCase.expected.apiVersion,
					}),
				);
			} else {
				expect(mockedRequest).toHaveBeenCalledWith(
					testCase.expected.path,
					'test-api-token',
					'api_key',
					expect.objectContaining({
						method: testCase.expected.method,
						query: testCase.expected.query,
						body:
							testCase.expected.requestContentType === 'multipart/form-data'
								? expect.any(FormData)
								: testCase.expected.body,
						headers: {},
						apiVersion: testCase.expected.apiVersion,
						contentType: testCase.expected.requestContentType || undefined,
					}),
				);
				if (testCase.expected.requestContentType === 'multipart/form-data') {
					const options = mockedRequest.mock.calls.at(-1)?.[3];
					const submittedBody = options?.body;
					const body = catalogRecord(catalogRecord(testCase.input).body);
					if (submittedBody instanceof FormData) {
						for (const field of Object.keys(body)) {
							expect(submittedBody.has(field)).toBe(true);
						}
					} else {
						throw new Error('Expected Pipedrive multipart request body');
					}
				}
			}
			expect(JSON.stringify(mockedLog.mock.calls)).not.toContain(
				'synthetic file bytes',
			);
		},
	);

	it.each(PipedriveCatalogOperationKeys)(
		'%s rejects undocumented top-level inputs before making a request',
		async (key) => {
			const route = PipedriveCatalog[key];
			const testCase = PipedriveCatalogTestCases[key];
			const invalidInput = {
				...testCase.input,
				undocumented_callback: 'not allowed',
			};
			expect(route.input.safeParse(invalidInput).success).toBe(false);
			await expect(
				Reflect.apply(pipedriveCatalogEndpointFunctions[key], undefined, [
					ctx,
					invalidInput,
				]),
			).rejects.toThrow();
			expect(mockedRequest).not.toHaveBeenCalled();
			expect(mockedBinaryRequest).not.toHaveBeenCalled();
		},
	);
});
