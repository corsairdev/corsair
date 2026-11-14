import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { Application, Events, Templates } from './endpoints';
import type { FomoContext } from './index';
import { fomo, fomoEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeFomoRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeFomoRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

function buildCtx(): FomoContext {
	const ctx: FomoContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-fomo-token',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-fomo-token'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

const ctx = buildCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

// ============================================================================
// Events Endpoints
// ============================================================================

describe('events endpoints', () => {
	it('events.list sends GET with pagination parameters and returns parsed list', async () => {
		const mockResponse = [
			{
				id: 1,
				title: 'Product purchase',
				first_name: 'Bob',
			},
		];
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Events.list(ctx, {
			per: 20,
			page: 2,
			show_meta: true,
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/applications/me/events',
			'test-fomo-token',
			{
				method: 'GET',
				query: { per: 20, page: 2, show_meta: true },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fomo.events.list',
			{ count: 1 },
			'completed',
		);
	});

	it('events.get sends GET with path id and returns event object', async () => {
		const mockResponse = {
			id: 42,
			title: 'Signed up',
			first_name: 'Carol',
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Events.get(ctx, { id: 42 });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/applications/me/events/42',
			'test-fomo-token',
			{
				method: 'GET',
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fomo.events.get',
			{ eventId: 42 },
			'completed',
		);
	});

	it('events.create sends POST with event payload and returns created event', async () => {
		const mockResponse = {
			id: 101,
			event_type_id: 5,
			first_name: 'Dave',
			city: 'Chicago',
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Events.create(ctx, {
			event_type_id: 5,
			first_name: 'Dave',
			city: 'Chicago',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/applications/me/events',
			'test-fomo-token',
			{
				method: 'POST',
				body: {
					event: {
						event_type_id: 5,
						first_name: 'Dave',
						city: 'Chicago',
					},
				},
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fomo.events.create',
			{ eventId: 101 },
			'completed',
		);
	});

	it('events.update sends PATCH with updated attributes', async () => {
		const mockResponse = {
			id: 101,
			event_type_id: 5,
			first_name: 'David',
			city: 'Chicago',
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Events.update(ctx, {
			id: 101,
			first_name: 'David',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/applications/me/events/101',
			'test-fomo-token',
			{
				method: 'PATCH',
				body: { event: { first_name: 'David' } },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fomo.events.update',
			{ eventId: 101 },
			'completed',
		);
	});

	it('events.delete sends DELETE and returns success message', async () => {
		const mockResponse = { message: 'Event successfully deleted' };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Events.delete(ctx, { id: 101 });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/applications/me/events/101',
			'test-fomo-token',
			{
				method: 'DELETE',
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fomo.events.delete',
			{ eventId: 101 },
			'completed',
		);
	});

	it('events.search sends GET to /events/find with field and q', async () => {
		const mockResponse = {
			id: 77,
			first_name: 'Eve',
			email_address: 'eve@example.com',
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Events.search(ctx, {
			field: 'email_address',
			q: 'eve@example.com',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/applications/me/events/find',
			'test-fomo-token',
			{
				method: 'GET',
				query: {
					field: 'email_address',
					q: 'eve@example.com',
				},
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fomo.events.search',
			{ field: 'email_address', eventId: 77 },
			'completed',
		);
	});

	it('rejects invalid event search without network call', async () => {
		// `unknown` because invalid input is intentionally malformed to test validation rejection.
		const invalidInput = { field: 'not_allowed', q: 'test' } as unknown;
		// `unknown` because caught rejection value has no static type before runtime assertion.
		const error = await Events.search(
			ctx,
			invalidInput as { field: 'email_address'; q: string },
		).catch((e: unknown) => e);

		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});
});

// ============================================================================
// Templates Endpoints
// ============================================================================

describe('templates endpoints', () => {
	it('templates.list sends GET to /event_types and returns templates', async () => {
		const mockResponse = [
			{
				id: 52,
				name: 'New Lead',
				message: '{{ first_name }} in {{ city }} just joined',
			},
		];
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Templates.list(ctx, { per: 10, page: 1 });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/applications/me/event_types',
			'test-fomo-token',
			{
				method: 'GET',
				query: { per: 10, page: 1 },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fomo.templates.list',
			{ count: 1 },
			'completed',
		);
	});

	it('templates.get sends GET with template id', async () => {
		const mockResponse = {
			id: 52,
			name: 'New Lead',
			message: '{{ first_name }} in {{ city }} just joined',
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Templates.get(ctx, { id: 52 });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/applications/me/event_types/52',
			'test-fomo-token',
			{
				method: 'GET',
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fomo.templates.get',
			{ templateId: 52 },
			'completed',
		);
	});

	it('templates.create sends POST to /event_types with template data', async () => {
		const mockResponse = {
			id: 53,
			name: 'Product Purchase',
			message: 'Someone bought {{ title }}',
			markdown_enabled: true,
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Templates.create(ctx, {
			name: 'Product Purchase',
			message: 'Someone bought {{ title }}',
			markdown_enabled: true,
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/applications/me/event_types',
			'test-fomo-token',
			{
				method: 'POST',
				body: {
					event_type: {
						name: 'Product Purchase',
						message: 'Someone bought {{ title }}',
						markdown_enabled: true,
					},
				},
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fomo.templates.create',
			{ templateId: 53 },
			'completed',
		);
	});

	it('templates.update sends PATCH to /event_types/:id', async () => {
		const mockResponse = {
			id: 53,
			name: 'Updated Purchase',
			message: 'Someone bought {{ title }}',
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Templates.update(ctx, {
			id: 53,
			name: 'Updated Purchase',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/applications/me/event_types/53',
			'test-fomo-token',
			{
				method: 'PATCH',
				body: { event_type: { name: 'Updated Purchase' } },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fomo.templates.update',
			{ templateId: 53 },
			'completed',
		);
	});

	it('templates.delete sends DELETE to /event_types/:id', async () => {
		const mockResponse = { message: 'Template successfully deleted' };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Templates.delete(ctx, { id: 53 });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/applications/me/event_types/53',
			'test-fomo-token',
			{
				method: 'DELETE',
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fomo.templates.delete',
			{ templateId: 53 },
			'completed',
		);
	});
});

// ============================================================================
// Application Endpoints
// ============================================================================

describe('application endpoints', () => {
	it('application.get retrieves application settings', async () => {
		const mockResponse = {
			id: 1,
			name: 'My Store',
			url: 'https://example.com',
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Application.get(ctx, {});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/applications/me',
			'test-fomo-token',
			{
				method: 'GET',
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fomo.application.get',
			{ applicationId: 1 },
			'completed',
		);
	});

	it('application.get with an id reads /users/me/applications/:id (/applications/me/:id is a 404)', async () => {
		mockedRequest.mockResolvedValue({ id: 7, name: 'Other Store' });

		await Application.get(ctx, { id: 7 });

		expect(mockedRequest).toHaveBeenCalledWith(
			'/users/me/applications/7',
			'test-fomo-token',
			{ method: 'GET' },
		);
	});

	it('application.update without an id patches /applications/me', async () => {
		mockedRequest.mockResolvedValue({ id: 1, name: 'Store' });

		await Application.update(ctx, { name: 'Store' });

		expect(mockedRequest).toHaveBeenCalledWith(
			'/applications/me',
			'test-fomo-token',
			{ method: 'PATCH', body: { application: { name: 'Store' } } },
		);
	});

	it('application.update modifies application settings', async () => {
		const mockResponse = {
			id: 1,
			name: 'Updated Store',
			position: 'bottom_right',
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Application.update(ctx, {
			id: 1,
			name: 'Updated Store',
			position: 'bottom_right',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/users/me/applications/1',
			'test-fomo-token',
			{
				method: 'PATCH',
				body: {
					application: {
						name: 'Updated Store',
						position: 'bottom_right',
					},
				},
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fomo.application.update',
			{ applicationId: 1 },
			'completed',
		);
	});

	it('application.getStats queries /dashboard with date_range', async () => {
		const mockResponse = {
			graph: {
				'2020-03-20': {
					click_count: 5,
					impr_count: 500,
				},
			},
			totals: {
				click_count: 100,
			},
			has_ga_conversions: false,
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Application.getStats(ctx, {
			date_range: {
				from: '2020-03-20',
				to: '2020-04-20',
			},
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/applications/me/dashboard',
			'test-fomo-token',
			{
				method: 'GET',
				query: {
					'date_range[from]': '2020-03-20',
					'date_range[to]': '2020-04-20',
				},
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fomo.application.getStats',
			{
				from: '2020-03-20',
				to: '2020-04-20',
			},
			'completed',
		);
	});
});

// ============================================================================
// Plugin Shape
// ============================================================================

describe('fomo plugin structure', () => {
	it('exposes all 14 endpoints under nested groups', () => {
		const plugin = fomo({});
		expect(plugin.endpoints).toBeDefined();
		if (!plugin.endpoints) throw new Error('endpoints undefined');

		expect(plugin.endpoints.events.list).toBeDefined();
		expect(plugin.endpoints.events.get).toBeDefined();
		expect(plugin.endpoints.events.create).toBeDefined();
		expect(plugin.endpoints.events.update).toBeDefined();
		expect(plugin.endpoints.events.delete).toBeDefined();
		expect(plugin.endpoints.events.search).toBeDefined();

		expect(plugin.endpoints.templates.list).toBeDefined();
		expect(plugin.endpoints.templates.get).toBeDefined();
		expect(plugin.endpoints.templates.create).toBeDefined();
		expect(plugin.endpoints.templates.update).toBeDefined();
		expect(plugin.endpoints.templates.delete).toBeDefined();

		expect(plugin.endpoints.application.get).toBeDefined();
		expect(plugin.endpoints.application.update).toBeDefined();
		expect(plugin.endpoints.application.getStats).toBeDefined();
	});

	it('uses api_key auth and declares no webhooks', () => {
		const plugin = fomo({ authType: 'api_key' });
		expect(plugin.options).toBeDefined();
		if (!plugin.options) throw new Error('options undefined');

		expect(plugin.options.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
	});

	it('marks events.create destructive: it publishes a notification visitors see (R8)', () => {
		const plugin = fomo({});
		expect(plugin.endpointMeta?.['events.create']?.riskLevel).toBe(
			'destructive',
		);
	});

	it('registers schemas for every endpoint', () => {
		const expectedEndpoints = [
			'events.list',
			'events.get',
			'events.create',
			'events.update',
			'events.delete',
			'events.search',
			'templates.list',
			'templates.get',
			'templates.create',
			'templates.update',
			'templates.delete',
			'application.get',
			'application.update',
			'application.getStats',
		] as const;

		for (const ep of expectedEndpoints) {
			expect(fomoEndpointSchemas[ep]).toBeDefined();
			expect(fomoEndpointSchemas[ep].input).toBeDefined();
			expect(fomoEndpointSchemas[ep].output).toBeDefined();
		}
	});
});
