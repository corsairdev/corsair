import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { Activities, Deals, Organizations, Persons, Tasks } from './endpoints';
import type { PipedriveContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});
jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makePipedriveRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makePipedriveRequest);
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

beforeEach(() => {
	mockedRequest.mockReset();
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
