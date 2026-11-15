import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { Deals, Persons } from './endpoints';
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
