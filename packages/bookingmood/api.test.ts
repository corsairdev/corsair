import { createHash } from 'node:crypto';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ApiError } from 'corsair/http';
import { resourceEndpoints } from './endpoints';
import { errorHandlers } from './error-handlers';
import {
	bookingmood,
	bookingmoodAuthConfig,
	bookingmoodEndpointSchemas,
} from './index';
import { BookingmoodSchema } from './schema';
import { BookingmoodWebhooks } from './webhooks';
import { matchBookingmoodTenantWebhook } from './webhooks/tenant-matcher';
import {
	createBookingmoodMatch,
	verifyBookingmoodWebhookSignature,
} from './webhooks/types';

function jsonResponse(body: unknown, status = 200) {
	const payload = JSON.stringify(body);
	return {
		ok: status >= 200 && status < 300,
		status,
		statusText: 'OK',
		headers: {
			get: (name: string) =>
				name.toLowerCase() === 'content-type' ? 'application/json' : null,
		},
		text: async () => payload,
		json: async () => body,
		clone() {
			return jsonResponse(body, status);
		},
	};
}

function mockFetch(body: unknown, status = 200) {
	(global.fetch as jest.Mock).mockResolvedValue(jsonResponse(body, status));
}

function createMockContext() {
	return {
		key: 'test_api_key',
		authType: 'api_key' as const,
		options: {},
		db: {
			products: {
				upsertByEntityId: jest.fn(),
				findByEntityId: jest
					.fn()
					.mockResolvedValue({ id: 'p1', timezone: 'UTC' }),
				deleteByEntityId: jest.fn(),
			},
			bookings: {
				upsertByEntityId: jest.fn(),
				findByEntityId: jest.fn(),
				deleteByEntityId: jest.fn(),
			},
		},
	};
}

describe('Bookingmood plugin', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		global.fetch = jest.fn() as unknown as typeof fetch;
	});

	it('registers api_key auth and official entities', () => {
		const plugin = bookingmood();
		expect(plugin.id).toBe('bookingmood');
		expect(plugin.authConfig).toBe(bookingmoodAuthConfig);
		expect(plugin.schema).toBe(BookingmoodSchema);
		expect(BookingmoodSchema.entities.bookings).toBeDefined();
		expect(Object.keys(bookingmoodEndpointSchemas).length).toBeGreaterThan(50);
		expect(plugin.endpoints.bookings.create).toBeUndefined();
		expect(plugin.endpoints.products.create).toBeDefined();
		expect(plugin.endpoints.members.invite).toBeDefined();
		expect(plugin.endpoints.availability.query).toBeDefined();
	});

	it('sends list query params including pagination', async () => {
		mockFetch([{ id: 'b1', reference: 'ABC' }]);
		const rows = await resourceEndpoints.bookings.list(createMockContext(), {
			id: 'b1',
			limit: 10,
			offset: 0,
			select: 'id,reference',
		});
		expect(rows[0].id).toBe('b1');
		const [url, init] = (global.fetch as jest.Mock).mock.calls[0] as [
			string,
			RequestInit,
		];
		expect(init.method).toBe('GET');
		expect(String(url)).toContain('id=eq.b1');
		expect(String(url)).toContain('limit=10');
	});

	it('keeps PostgREST filters on PATCH and DELETE', async () => {
		mockFetch([{ id: 'p1', timezone: 'Europe/Amsterdam' }]);
		await resourceEndpoints.products.update(createMockContext(), {
			id: 'p1',
			timezone: 'Europe/Amsterdam',
		});
		const [patchUrl, patchInit] = (global.fetch as jest.Mock).mock.calls[0] as [
			string,
			RequestInit,
		];
		expect(patchInit.method).toBe('PATCH');
		expect(String(patchUrl)).toContain('id=eq.p1');

		mockFetch([{ id: 'p1' }]);
		await resourceEndpoints.products.delete(createMockContext(), { id: 'p1' });
		const [deleteUrl, deleteInit] = (global.fetch as jest.Mock).mock
			.calls[1] as [string, RequestInit];
		expect(deleteInit.method).toBe('DELETE');
		expect(String(deleteUrl)).toContain('id=eq.p1');
	});

	it('refuses unfiltered mutations', async () => {
		await expect(
			resourceEndpoints.bookings.delete(createMockContext(), {}),
		).rejects.toThrow(/at least one PostgREST filter/);
		expect(global.fetch).not.toHaveBeenCalled();
	});

	it('creates a product with official required fields', async () => {
		mockFetch([{ id: 'p1', timezone: 'UTC' }]);
		const result = await resourceEndpoints.products.create(
			createMockContext(),
			{
				name: { default: 'Cabin' },
				rent_period: 'nightly',
				timezone: 'UTC',
			},
		);
		expect(result[0].id).toBe('p1');
		const [, init] = (global.fetch as jest.Mock).mock.calls[0] as [
			string,
			RequestInit,
		];
		expect(init.method).toBe('POST');
		expect(JSON.parse(String(init.body))).toEqual({
			name: { default: 'Cabin' },
			rent_period: 'nightly',
			timezone: 'UTC',
		});
	});

	it('queries availability and searches via POST /search', async () => {
		mockFetch([{ product_id: 'p1', intervals: [] }]);
		await resourceEndpoints.availability.query(createMockContext(), {
			product_id: 'p1',
		});
		expect(String((global.fetch as jest.Mock).mock.calls[0][0])).toContain(
			'/availability',
		);

		mockFetch([{ productId: 'p1', match: true }]);
		await resourceEndpoints.search.availability(createMockContext(), {
			interval: { start: '2026-08-01', end: '2026-08-07' },
		});
		const [url, init] = (global.fetch as jest.Mock).mock.calls[1] as [
			string,
			RequestInit,
		];
		expect(String(url)).toContain('/search');
		expect(init.method).toBe('POST');
	});

	it('classifies 429 via preserved ApiError', () => {
		const error = new ApiError(
			{ method: 'GET', url: '/products' },
			{
				url: 'https://api.bookingmood.com/v1/products',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Too Many Requests',
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});

	it('verifies MD5 signatures from X-Signature', () => {
		const payload = {
			id: 'evt_1',
			date: 1680064028,
			event_type: 'bookings.created',
			payload: { new: { id: 'b1', organization_id: 'org_1' } },
		};
		const secret = 'signing-secret';
		const expected = createHash('md5')
			.update(
				`${secret}.${JSON.stringify({
					id: payload.id,
					event_type: payload.event_type,
					date: payload.date,
					payload: payload.payload,
				})}`,
			)
			.digest('hex');

		expect(
			verifyBookingmoodWebhookSignature(
				{
					payload,
					headers: { 'x-signature': expected },
				} as never,
				secret,
			).valid,
		).toBe(true);

		expect(
			verifyBookingmoodWebhookSignature(
				{
					payload,
					headers: { 'x-signature': 'deadbeef' },
				} as never,
				secret,
			).valid,
		).toBe(false);
	});

	it('matches official event_type and organization_id tenant', () => {
		expect(
			createBookingmoodMatch('bookings.created')({
				body: { event_type: 'bookings.created' },
				headers: {},
			}),
		).toBe(true);
		expect(
			createBookingmoodMatch('bookings.created')({
				body: { type: 'booking.created' },
				headers: {},
			}),
		).toBe(false);

		const match = matchBookingmoodTenantWebhook({
			body: JSON.stringify({
				event_type: 'products.updated',
				payload: { new: { id: 'p1', organization_id: 'org_9' } },
			}),
			headers: {},
		});
		expect(match).toEqual({ linkType: 'organization_id', externalId: 'org_9' });
	});

	it('does not acknowledge failed webhook persistence', async () => {
		const payload = {
			id: 'evt_1',
			date: 1,
			event_type: 'products.created',
			payload: { new: { id: 'p1' } },
		};
		const secret = 's';
		const signature = createHash('md5')
			.update(
				`${secret}.${JSON.stringify({
					id: payload.id,
					event_type: payload.event_type,
					date: payload.date,
					payload: payload.payload,
				})}`,
			)
			.digest('hex');

		const result = await BookingmoodWebhooks.productsCreated.handler(
			{
				key: secret,
				db: {
					products: {
						upsertByEntityId: jest.fn().mockRejectedValue(new Error('db down')),
					},
				},
			},
			{ payload, headers: { 'x-signature': signature } },
		);
		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(500);
	});
});
