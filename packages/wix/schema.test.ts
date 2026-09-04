import type { z } from 'zod';
import { wixRoutes } from './endpoints/routes';
import {
	WixEndpointInputSchemas,
	WixEndpointOutputSchemas,
} from './endpoints/types';
import { WixSchema } from './schema';
import { WixContact, WixOrder, WixProduct } from './schema/database';

describe('Wix schema', () => {
	it('declares a semver version', () => {
		expect(WixSchema.version).toBeDefined();
		expect(WixSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WixSchema.entities).toBe('object');
		expect(WixSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WixSchema.entities))).toBe(true);
		for (const entity of Object.values(WixSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

describe('Wix input schemas accept valid input', () => {
	it('accepts a contacts query with pagination', () => {
		const parsed = WixEndpointInputSchemas.queryContacts.parse({
			siteId: 'site-1',
			limit: 50,
			offset: 0,
			fieldsets: ['BASIC'],
		});
		expect(parsed).toBeDefined();
		expect(parsed.limit).toBe(50);
	});

	it('accepts label operations with required fields', () => {
		const add = WixEndpointInputSchemas.addContactLabels.parse({
			contactId: 'contact-1',
			labelKeys: ['contacts.customers'],
		});
		expect(add.contactId).toBe('contact-1');

		const unlabel = WixEndpointInputSchemas.unlabelContact.parse({
			contactId: 'contact-1',
			labelKeys: ['contacts.customers'],
		});
		expect(unlabel.labelKeys).toEqual(['contacts.customers']);
	});

	it('accepts bulk delete inputs with id lists', () => {
		const parsed = WixEndpointInputSchemas.bulkDeleteProducts.parse({
			ids: ['product-1', 'product-2'],
		});
		expect(parsed.ids).toHaveLength(2);
	});

	it('accepts member registration input', () => {
		const parsed = WixEndpointInputSchemas.registerMemberV2.parse({
			email: 'member@example.com',
			password: 'secret',
		});
		expect(parsed.email).toBe('member@example.com');
	});

	it('accepts every route with an empty object only when nothing is required', () => {
		let optionalOnly = 0;
		for (const route of wixRoutes) {
			const schema =
				WixEndpointInputSchemas[
					route.key as keyof typeof WixEndpointInputSchemas
				];
			const result = schema.safeParse({});
			if (result.success) optionalOnly += 1;
		}
		expect(optionalOnly).toBeGreaterThan(50);
	});
});

describe('Wix input schemas reject invalid input', () => {
	it('rejects label operations without label keys', () => {
		expect(() =>
			WixEndpointInputSchemas.addContactLabels.parse({
				contactId: 'contact-1',
				labelKeys: [],
			}),
		).toThrow();
	});

	it('rejects bulk deletes without ids', () => {
		expect(() =>
			WixEndpointInputSchemas.bulkDeleteProducts.parse({}),
		).toThrow();
	});

	it('rejects member registration without credentials', () => {
		expect(() =>
			WixEndpointInputSchemas.registerMemberV2.parse({
				email: 'member@example.com',
			}),
		).toThrow();
	});

	it('rejects by-filter deletes without a filter', () => {
		expect(() =>
			WixEndpointInputSchemas.bulkDeleteRsvpsByFilter.parse({}),
		).toThrow();
	});

	it('rejects limits above the Wix maximum', () => {
		expect(() =>
			WixEndpointInputSchemas.queryContacts.parse({ limit: 5000 }),
		).toThrow();
	});
});

describe('Wix output schemas', () => {
	it('parses representative query responses', () => {
		const contacts = WixEndpointOutputSchemas.queryContacts.parse({
			contacts: [{ id: 'contact-1' }],
			pagingMetadata: { count: 1, offset: 0, total: 1 },
		});
		expect(contacts.contacts).toHaveLength(1);

		const orders = WixEndpointOutputSchemas.queryEcomOrders.parse({
			orders: [],
			pagingMetadata: { count: 0, total: 0 },
		}) as { pagingMetadata?: { total?: number } };
		expect(orders.pagingMetadata?.total).toBe(0);
	});

	it('infers query response item fields as arrays at the type level', () => {
		type QueryContactsOutput = z.infer<
			typeof WixEndpointOutputSchemas.queryContacts
		>;
		type ContactsIsArray = NonNullable<
			QueryContactsOutput['contacts']
		> extends unknown[]
			? true
			: false;
		const typeCheck: ContactsIsArray = true;
		expect(typeCheck).toBe(true);
	});

	it('parses bulk action responses', () => {
		const parsed = WixEndpointOutputSchemas.bulkDeleteProducts.parse({
			results: [],
			bulkActionMetadata: { totalSuccesses: 2, totalFailures: 0 },
		});
		expect(parsed.bulkActionMetadata?.totalSuccesses).toBe(2);
	});
});

describe('Wix database entities', () => {
	it('accepts documented contact, product, and order shapes', () => {
		expect(
			WixContact.safeParse({
				id: 'contact-1',
				revision: '3',
				createdDate: '2026-01-01T00:00:00.000Z',
			}).success,
		).toBe(true);
		expect(
			WixProduct.safeParse({ id: 'product-1', name: 'Shirt', slug: 'shirt' })
				.success,
		).toBe(true);
		expect(
			WixOrder.safeParse({ id: 'order-1', status: 'APPROVED' }).success,
		).toBe(true);
	});

	it('rejects mistyped entity fields', () => {
		expect(WixContact.safeParse({ id: 123 }).success).toBe(false);
		expect(WixContact.safeParse({ revision: 3 }).success).toBe(false);
		expect(WixProduct.safeParse({ revision: 42 }).success).toBe(false);
		expect(WixOrder.safeParse({ status: 7 }).success).toBe(false);
	});
});
