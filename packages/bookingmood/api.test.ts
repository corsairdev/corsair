import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ApiError } from 'corsair/http';
import {
	Bookings,
	Contacts,
	Members,
	Organizations,
	Products,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import {
	bookingmood,
	bookingmoodAuthConfig,
	bookingmoodEndpointSchemas,
} from './index';
import { BookingmoodSchema } from './schema';
import { BookingmoodWebhooks } from './webhooks';
import { resolveBookingmoodOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchBookingmoodTenantWebhook } from './webhooks/tenant-matcher';
import { verifyBookingmoodWebhookSignature } from './webhooks/types';

function createMockContext() {
	return {
		key: 'test_api_key',
		authType: 'api_key' as const,
		options: {},
		db: {
			organizations: {
				upsertByEntityId: jest.fn(),
				findByEntityId: jest.fn(),
				deleteByEntityId: jest.fn(),
			},
			bookings: {
				upsertByEntityId: jest.fn(),
				findByEntityId: jest.fn(),
				deleteByEntityId: jest.fn(),
			},
			products: {
				upsertByEntityId: jest.fn(),
				findByEntityId: jest.fn(),
				deleteByEntityId: jest.fn(),
			},
			members: {
				upsertByEntityId: jest.fn(),
				findByEntityId: jest.fn(),
				deleteByEntityId: jest.fn(),
			},
			contacts: {
				upsertByEntityId: jest.fn(),
				findByEntityId: jest.fn(),
				deleteByEntityId: jest.fn(),
			},
		},
	};
}

describe('Bookingmood Plugin', () => {
	let mockContext: any;

	beforeEach(() => {
		jest.clearAllMocks();
		global.fetch = jest.fn() as any;
		mockContext = createMockContext();
	});

	describe('Plugin Initialization & Registration', () => {
		it('instantiates plugin correctly with default options', () => {
			const plugin = bookingmood();
			expect(plugin.id).toBe('bookingmood');
			expect(plugin.authConfig).toBe(bookingmoodAuthConfig);
			expect(plugin.schema).toBe(BookingmoodSchema);
			expect(typeof plugin.endpoints).toBe('object');
			expect(typeof plugin.webhooks).toBe('object');
		});

		it('validates schema version and entities', () => {
			expect(BookingmoodSchema.version).toBe('1.0.0');
			expect(BookingmoodSchema.entities.organizations).toBeDefined();
			expect(BookingmoodSchema.entities.bookings).toBeDefined();
			expect(BookingmoodSchema.entities.products).toBeDefined();
			expect(BookingmoodSchema.entities.members).toBeDefined();
			expect(BookingmoodSchema.entities.contacts).toBeDefined();
		});

		it('has valid endpoint schemas registered for all endpoints', () => {
			expect(bookingmoodEndpointSchemas['organizations.get']).toBeDefined();
			expect(bookingmoodEndpointSchemas['organizations.list']).toBeDefined();
			expect(bookingmoodEndpointSchemas['bookings.get']).toBeDefined();
			expect(bookingmoodEndpointSchemas['bookings.list']).toBeDefined();
			expect(bookingmoodEndpointSchemas['bookings.create']).toBeDefined();
			expect(bookingmoodEndpointSchemas['bookings.update']).toBeDefined();
			expect(bookingmoodEndpointSchemas['bookings.delete']).toBeDefined();
			expect(bookingmoodEndpointSchemas['products.get']).toBeDefined();
			expect(bookingmoodEndpointSchemas['products.list']).toBeDefined();
			expect(bookingmoodEndpointSchemas['products.create']).toBeDefined();
			expect(bookingmoodEndpointSchemas['products.update']).toBeDefined();
			expect(bookingmoodEndpointSchemas['products.delete']).toBeDefined();
			expect(bookingmoodEndpointSchemas['members.get']).toBeDefined();
			expect(bookingmoodEndpointSchemas['members.list']).toBeDefined();
			expect(bookingmoodEndpointSchemas['contacts.get']).toBeDefined();
			expect(bookingmoodEndpointSchemas['contacts.list']).toBeDefined();
			expect(bookingmoodEndpointSchemas['contacts.create']).toBeDefined();
			expect(bookingmoodEndpointSchemas['contacts.update']).toBeDefined();
			expect(bookingmoodEndpointSchemas['contacts.delete']).toBeDefined();
		});
	});

	describe('Organizations Endpoints', () => {
		it('organizations.get fetches organization and upserts to db', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				text: async () => JSON.stringify([{ id: 'org_123', name: 'Test Org' }]),
			});

			const result = await Organizations.get(mockContext, { id: 'org_123' });
			expect(result).toEqual({ id: 'org_123', name: 'Test Org' });
			expect(
				mockContext.db.organizations.upsertByEntityId,
			).toHaveBeenCalledWith(
				'org_123',
				expect.objectContaining({ id: 'org_123', name: 'Test Org' }),
			);
		});

		it('organizations.list fetches list of organizations', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				text: async () =>
					JSON.stringify([
						{ id: 'org_1', name: 'Org 1' },
						{ id: 'org_2', name: 'Org 2' },
					]),
			});

			const result = await Organizations.list(mockContext, { limit: 10 });
			expect(result).toHaveLength(2);
			expect(
				mockContext.db.organizations.upsertByEntityId,
			).toHaveBeenCalledTimes(2);
		});
	});

	describe('Bookings Endpoints', () => {
		it('bookings.get fetches single booking', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				text: async () =>
					JSON.stringify([
						{ id: 'b_1', product_id: 'p_1', status: 'confirmed' },
					]),
			});

			const result = await Bookings.get(mockContext, { id: 'b_1' });
			expect(result).toEqual({
				id: 'b_1',
				product_id: 'p_1',
				status: 'confirmed',
			});
			expect(mockContext.db.bookings.upsertByEntityId).toHaveBeenCalledWith(
				'b_1',
				expect.objectContaining({ id: 'b_1' }),
			);
		});

		it('bookings.list fetches array of bookings with filter query params', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				text: async () => JSON.stringify([{ id: 'b_1', status: 'confirmed' }]),
			});

			const result = await Bookings.list(mockContext, {
				status: 'confirmed',
				limit: 5,
			});
			expect(result).toHaveLength(1);
			expect(mockContext.db.bookings.upsertByEntityId).toHaveBeenCalledWith(
				'b_1',
				expect.objectContaining({ id: 'b_1' }),
			);
		});

		it('bookings.create sends POST request and upserts db', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				text: async () =>
					JSON.stringify({
						id: 'b_new',
						product_id: 'p_1',
						start_date: '2026-09-01',
						end_date: '2026-09-05',
					}),
			});

			const result = await Bookings.create(mockContext, {
				product_id: 'p_1',
				start_date: '2026-09-01',
				end_date: '2026-09-05',
			});
			expect(result.id).toBe('b_new');
			expect(mockContext.db.bookings.upsertByEntityId).toHaveBeenCalledWith(
				'b_new',
				expect.objectContaining({ id: 'b_new' }),
			);
		});

		it('bookings.update sends PATCH request and updates db', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				text: async () => JSON.stringify({ id: 'b_1', status: 'cancelled' }),
			});

			const result = await Bookings.update(mockContext, {
				id: 'b_1',
				status: 'cancelled',
			});
			expect(result.status).toBe('cancelled');
			expect(mockContext.db.bookings.upsertByEntityId).toHaveBeenCalledWith(
				'b_1',
				expect.objectContaining({ status: 'cancelled' }),
			);
		});

		it('bookings.delete sends DELETE request and deletes from db', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				text: async () => JSON.stringify({ success: true }),
			});

			const result = await Bookings.deleteBooking(mockContext, { id: 'b_1' });
			expect(result).toEqual({ success: true, id: 'b_1' });
			expect(mockContext.db.bookings.deleteByEntityId).toHaveBeenCalledWith(
				'b_1',
			);
		});
	});

	describe('Products Endpoints', () => {
		it('products.get fetches single product', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				text: async () =>
					JSON.stringify([{ id: 'p_1', name: 'Cabin 1', price: 150 }]),
			});

			const result = await Products.get(mockContext, { id: 'p_1' });
			expect(result).toEqual({ id: 'p_1', name: 'Cabin 1', price: 150 });
			expect(mockContext.db.products.upsertByEntityId).toHaveBeenCalledWith(
				'p_1',
				expect.objectContaining({ id: 'p_1' }),
			);
		});

		it('products.list fetches list of products', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				text: async () => JSON.stringify([{ id: 'p_1' }, { id: 'p_2' }]),
			});

			const result = await Products.list(mockContext, {});
			expect(result).toHaveLength(2);
		});

		it('products.create creates product', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				text: async () => JSON.stringify({ id: 'p_new', name: 'Villa' }),
			});

			const result = await Products.create(mockContext, {
				name: 'Villa',
				price: 300,
			});
			expect(result.id).toBe('p_new');
		});

		it('products.update updates product', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				text: async () => JSON.stringify({ id: 'p_1', price: 200 }),
			});

			const result = await Products.update(mockContext, {
				id: 'p_1',
				price: 200,
			});
			expect(result.price).toBe(200);
		});

		it('products.delete deletes product', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				text: async () => JSON.stringify({ success: true }),
			});

			const result = await Products.deleteProduct(mockContext, { id: 'p_1' });
			expect(result).toEqual({ success: true, id: 'p_1' });
			expect(mockContext.db.products.deleteByEntityId).toHaveBeenCalledWith(
				'p_1',
			);
		});
	});

	describe('Members Endpoints', () => {
		it('members.get fetches single member', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				text: async () =>
					JSON.stringify([
						{ id: 'm_1', email: 'user@example.com', role: 'admin' },
					]),
			});

			const result = await Members.get(mockContext, { id: 'm_1' });
			expect(result).toEqual({
				id: 'm_1',
				email: 'user@example.com',
				role: 'admin',
			});
			expect(mockContext.db.members.upsertByEntityId).toHaveBeenCalledWith(
				'm_1',
				expect.objectContaining({ email: 'user@example.com' }),
			);
		});

		it('members.list fetches list of members', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				text: async () => JSON.stringify([{ id: 'm_1' }]),
			});

			const result = await Members.list(mockContext, {});
			expect(result).toHaveLength(1);
		});
	});

	describe('Contacts Endpoints', () => {
		it('contacts.get fetches single contact', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				text: async () =>
					JSON.stringify([
						{ id: 'c_1', name: 'John Doe', email: 'john@example.com' },
					]),
			});

			const result = await Contacts.get(mockContext, { id: 'c_1' });
			expect(result).toEqual({
				id: 'c_1',
				name: 'John Doe',
				email: 'john@example.com',
			});
		});

		it('contacts.list fetches contacts', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				text: async () => JSON.stringify([{ id: 'c_1' }]),
			});

			const result = await Contacts.list(mockContext, {});
			expect(result).toHaveLength(1);
		});

		it('contacts.create creates contact', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				text: async () => JSON.stringify({ id: 'c_new', name: 'Alice' }),
			});

			const result = await Contacts.create(mockContext, {
				name: 'Alice',
				email: 'alice@example.com',
			});
			expect(result.id).toBe('c_new');
		});

		it('contacts.update updates contact', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				text: async () => JSON.stringify({ id: 'c_1', phone: '123456' }),
			});

			const result = await Contacts.update(mockContext, {
				id: 'c_1',
				phone: '123456',
			});
			expect(result.phone).toBe('123456');
		});

		it('contacts.delete deletes contact', async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				text: async () => JSON.stringify({ success: true }),
			});

			const result = await Contacts.deleteContact(mockContext, { id: 'c_1' });
			expect(result).toEqual({ success: true, id: 'c_1' });
		});
	});

	describe('Error Handlers', () => {
		it('handles RATE_LIMIT_ERROR (429)', async () => {
			const err = new ApiError(
				{ method: 'GET', url: 'http://test' },
				{
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: {},
					url: 'http://test',
				},
				'rate_limited',
			);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
			const res = await errorHandlers.RATE_LIMIT_ERROR.handler(err);
			expect(res.maxRetries).toBe(5);
		});

		it('handles AUTH_ERROR (401)', async () => {
			const err = new ApiError(
				{ method: 'GET', url: 'http://test' },
				{
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					body: {},
					url: 'http://test',
				},
				'Unauthorized',
			);
			expect(errorHandlers.AUTH_ERROR.match(err)).toBe(true);
			const res = await errorHandlers.AUTH_ERROR.handler(err, {
				operation: 'test',
			} as any);
			expect(res.maxRetries).toBe(0);
		});

		it('handles PERMISSION_ERROR (403)', async () => {
			const err = new ApiError(
				{ method: 'GET', url: 'http://test' },
				{
					ok: false,
					status: 403,
					statusText: 'Forbidden',
					body: {},
					url: 'http://test',
				},
				'Forbidden',
			);
			expect(errorHandlers.PERMISSION_ERROR.match(err)).toBe(true);
			const res = await errorHandlers.PERMISSION_ERROR.handler(err, {
				operation: 'test',
			} as any);
			expect(res.maxRetries).toBe(0);
		});

		it('handles NOT_FOUND_ERROR (404)', async () => {
			const err = new ApiError(
				{ method: 'GET', url: 'http://test' },
				{
					ok: false,
					status: 404,
					statusText: 'Not Found',
					body: {},
					url: 'http://test',
				},
				'not_found',
			);
			expect(errorHandlers.NOT_FOUND_ERROR.match(err)).toBe(true);
			const res = await errorHandlers.NOT_FOUND_ERROR.handler(err, {
				operation: 'test',
			} as any);
			expect(res.maxRetries).toBe(0);
		});
	});

	describe('Webhooks', () => {
		it('matches tenant external ID from webhook request', () => {
			const req = { body: { tenant_external_id: 'tenant_abc' } } as any;
			const match = matchBookingmoodTenantWebhook(req);
			expect(match).toEqual({
				linkType: 'tenant_external_id',
				externalId: 'tenant_abc',
			});
		});

		it('resolves oauth tenant link from tokens', async () => {
			const link = await resolveBookingmoodOAuthWebhookTenantLink({
				tenant_external_id: 'tenant_xyz',
			} as any);
			expect(link).toEqual({
				linkType: 'tenant_external_id',
				externalId: 'tenant_xyz',
			});
		});

		it('verifies webhook signature header', () => {
			const valid = verifyBookingmoodWebhookSignature(
				{ headers: { 'x-bookingmood-signature': 'sig' } } as any,
				'secret',
			);
			expect(valid.valid).toBe(true);
		});

		it('processes bookingCreated webhook event and upserts db', async () => {
			const payload = {
				type: 'booking.created',
				data: { id: 'b_wh_1', status: 'confirmed' },
			};
			const req = {
				payload,
				headers: { 'x-bookingmood-signature': 'sig' },
			} as any;
			const res = await BookingmoodWebhooks.bookingCreated.handler(
				mockContext,
				req,
			);
			expect(res).toEqual({ success: true, data: payload });
			expect(mockContext.db.bookings.upsertByEntityId).toHaveBeenCalledWith(
				'b_wh_1',
				expect.objectContaining({ id: 'b_wh_1' }),
			);
		});

		it('processes bookingDeleted webhook event and deletes from db', async () => {
			const payload = { type: 'booking.deleted', data: { id: 'b_wh_1' } };
			const req = {
				payload,
				headers: { 'x-bookingmood-signature': 'sig' },
			} as any;
			const res = await BookingmoodWebhooks.bookingDeleted.handler(
				mockContext,
				req,
			);
			expect(res).toEqual({ success: true, data: payload });
			expect(mockContext.db.bookings.deleteByEntityId).toHaveBeenCalledWith(
				'b_wh_1',
			);
		});
	});
});
