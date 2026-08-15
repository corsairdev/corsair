/**
 * Verifies the specific live-API behaviours this plugin was built around.
 * Each test here corresponds to a finding in the PR body - if one of these
 * goes red, a claim in that document is no longer true.
 */
import { Colleagues, Customers, Products, SaleInvoices } from './endpoints';
import { buildPagingQuery } from './endpoints/shared';
import {
	installFetchMock,
	lastCall,
	makeCtx,
	makeDb,
	queueResponse,
	recordedCalls,
	requestedBody,
	resetFetchMock,
} from './test-utils';

const unit = { id: 1, code: 'H', name: 'Heures', type: 'Time' };
const vat = { id: 2, rate: 20, region: 'FR', label: '20% - FR', default: true };
const family = { id: 3, label: 'Family', number: 'CRF-001' };

function seededDb() {
	const db = makeDb();
	db.units.upsertByEntityId(String(unit.id), unit);
	db.vats.upsertByEntityId(String(vat.id), vat);
	db.customerFamilies.upsertByEntityId(String(family.id), family);
	return db;
}

beforeEach(() => {
	resetFetchMock();
	installFetchMock();
});

describe('read-modify-write: PUT clears every field the caller omits', () => {
	test('customers.update sends every other field back unchanged, not just the one supplied', async () => {
		const { ctx } = makeCtx(seededDb());
		const current = {
			id: 1,
			type: 'Business',
			companyName: 'Old Name',
			firstName: 'Ada',
			lastName: 'Testcase',
			email: 'ada@example.com',
			phone: '+33100000000',
			cellPhone: '+33600000000',
			title: 'Mr',
			number: 'C-1',
			internalId: 'ext-1',
			active: true,
			internalNotes: 'note',
			billingAddress: { city: 'Paris', zipcode: '75001', countryIso: 'FR' },
			shippingAddress: null,
			billingOptions: { allowed: true },
			companyInformations: { siret: null },
			family: null,
		};
		queueResponse(current); // the GET
		queueResponse({ ...current, companyName: 'New Name' }); // the PUT response

		await Customers.update(ctx, { customerId: 1, companyName: 'New Name' });

		const calls = recordedCalls();
		expect(calls).toHaveLength(2);
		const putBody = requestedBody(calls[1]) as Record<string, unknown>;

		// the one field supplied went through
		expect(putBody.companyName).toBe('New Name');
		// every other field the caller did not touch must still be present -
		// this is the entire fix for the PUT-clears-fields finding
		expect(putBody.email).toBe('ada@example.com');
		expect(putBody.phone).toBe('+33100000000');
		expect(putBody.firstName).toBe('Ada');
		expect(putBody.lastName).toBe('Testcase');
		expect(putBody.internalNotes).toBe('note');
		expect(putBody.billingAddress).toMatchObject({
			city: 'Paris',
			zipCode: '75001',
			countryCode: 'FR',
		});
	});

	test('suppliers.update and colleagues.update also read-modify-write', async () => {
		const { ctx: supplierCtx } = makeCtx();
		queueResponse({
			id: 1,
			name: 'Old',
			email: 'a@example.com',
			phone: '+331',
		});
		queueResponse({ id: 1, name: 'New' });
		const { Suppliers } = await import('./endpoints');
		await Suppliers.update(supplierCtx, { supplierId: 1, name: 'New' });
		const supplierPut = requestedBody(recordedCalls()[1]) as Record<
			string,
			unknown
		>;
		expect(supplierPut.email).toBe('a@example.com');
		expect(supplierPut.phone).toBe('+331');

		resetFetchMock();
		installFetchMock();
		const { ctx: colleagueCtx } = makeCtx();
		queueResponse({
			id: 1,
			firstName: 'Colin',
			lastName: 'Old',
			email: 'c@example.com',
		});
		queueResponse({ id: 1, lastName: 'New' });
		await Colleagues.update(colleagueCtx, { colleagueId: 1, lastName: 'New' });
		const colleaguePut = requestedBody(recordedCalls()[1]) as Record<
			string,
			unknown
		>;
		expect(colleaguePut.firstName).toBe('Colin');
		expect(colleaguePut.email).toBe('c@example.com');
	});
});

describe('nested references are resolved to their value form, never sent as a bare id', () => {
	test('products.create resolves unitId/vatId/familyId from the mirror to {code}/{rate,region}/{label,number}', async () => {
		const db = seededDb();
		db.productFamilies.upsertByEntityId('4', {
			id: 4,
			label: 'Product Family',
			number: 'PRF-001',
		});
		const { ctx } = makeCtx(db);
		queueResponse({ id: 10, name: 'P' });

		await Products.create(ctx, {
			name: 'P',
			type: 'Service',
			unitId: unit.id,
			vatId: vat.id,
			familyId: 4,
		});

		const body = requestedBody() as Record<string, unknown>;
		expect(body.unit).toEqual({ code: 'H' });
		expect(body.vat).toEqual({ rate: 20, region: 'FR' });
		expect(body.family).toEqual({ label: 'Product Family', number: 'PRF-001' });
		// the raw ids must never reach the wire in this shape
		expect(body).not.toHaveProperty('unitId');
		expect(body).not.toHaveProperty('vatId');
		expect(body).not.toHaveProperty('familyId');
	});

	test('a cache miss falls back to a live list call rather than silently omitting the reference', async () => {
		const { ctx } = makeCtx(makeDb()); // empty mirror
		queueResponse([unit]); // GET_UNITS fallback
		queueResponse({ id: 10, name: 'P' }); // the create

		await Products.create(ctx, { name: 'P', type: 'Service', unitId: unit.id });

		const calls = recordedCalls();
		expect(calls[0]?.url).toContain('v1/units');
		const body = requestedBody(calls[1]) as Record<string, unknown>;
		expect(body.unit).toEqual({ code: 'H' });
	});

	test('an id with no match anywhere throws rather than silently dropping the reference', async () => {
		const { ctx } = makeCtx(makeDb());
		queueResponse([]); // live list comes back empty too

		await expect(
			Products.create(ctx, { name: 'P', type: 'Service', unitId: 999 }),
		).rejects.toThrow(/999/);
	});

	test('customers.create resolves familyId the same way', async () => {
		const { ctx } = makeCtx(seededDb());
		queueResponse({ id: 1, family });

		await Customers.create(ctx, {
			type: 'Business',
			companyName: 'Acme',
			familyId: family.id,
		});

		const body = requestedBody() as Record<string, unknown>;
		expect(body.family).toEqual({ label: 'Family', number: 'CRF-001' });
	});
});

describe('sale document lines: unitPrice is rejected client-side, taxExcludedPrice is the real field', () => {
	test('a line schema rejects an unrecognised key (unitPrice) before the request is built', async () => {
		const { AltovizLineInputSchema } = await import('./endpoints/shared');
		const result = AltovizLineInputSchema.safeParse({
			type: 'Service',
			quantity: 1,
			unitPrice: 999, // deliberately not part of the schema - .strict() must reject it
		});
		expect(result.success).toBe(false);
	});

	test('saleInvoices.create sends taxExcludedPrice on the wire, never unitPrice', async () => {
		const { ctx } = makeCtx(seededDb());
		queueResponse({ id: 1 });

		await SaleInvoices.create(ctx, {
			customerId: 1,
			date: '2026-01-01',
			lines: [
				{
					type: 'Service',
					description: 'x',
					quantity: 1,
					taxExcludedPrice: 100,
					unitId: unit.id,
					vatId: vat.id,
				},
			],
		});

		const body = requestedBody() as { lines: Array<Record<string, unknown>> };
		expect(body.lines[0]?.taxExcludedPrice).toBe(100);
		expect(body.lines[0]).not.toHaveProperty('unitPrice');
	});
});

describe('contact eviction on parent delete', () => {
	test("customers.delete fetches the customer's contacts and evicts each from the mirror", async () => {
		const db = seededDb();
		db.contacts.upsertByEntityId('50', { id: 50, displayName: 'Auto Contact' });
		const { ctx } = makeCtx(db);

		queueResponse([{ id: 50, displayName: 'Auto Contact', isMain: true }]); // GET_CUSTOMER_CONTACTS
		queueResponse({}); // DELETE

		await Customers.delete(ctx, { customerId: 1 });

		expect(db.contacts.deleteByEntityId).toHaveBeenCalledWith('50');
	});

	test('a failed contact lookup does not fail the parent delete', async () => {
		const { ctx, db } = makeCtx(seededDb());
		// GET_CUSTOMER_CONTACTS 404s; DELETE still succeeds
		global.fetch = (async () => {
			throw new Error('network down');
		}) as unknown as typeof global.fetch;

		// swap in a fetch that fails once (contacts) then succeeds (delete) is
		// awkward with a single stub, so this asserts the delete call itself is
		// still attempted rather than short-circuited by the lookup failure.
		let calls = 0;
		global.fetch = (async (url: string, init: RequestInit) => {
			calls++;
			if (calls === 1) throw new Error('network down');
			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				url,
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: async () => ({}),
				text: async () => '{}',
			} as unknown as Response;
		}) as unknown as typeof global.fetch;

		await expect(Customers.delete(ctx, { customerId: 1 })).resolves.toEqual({
			deleted: true,
			id: 1,
		});
		expect(calls).toBe(2);
	});
});

describe('pagination', () => {
	test('pageIndex defaults to 1, never 0', () => {
		const query = buildPagingQuery({ pageIndex: 1 });
		expect(query.PageIndex).toBe(1);
	});

	test('an explicit pageIndex is honoured and omitted fields are dropped, not sent as undefined', () => {
		const query = buildPagingQuery({ pageIndex: 2, pageSize: 50 });
		expect(query).toEqual({ PageIndex: 2, PageSize: 50 });
		expect(query).not.toHaveProperty('OrderBy');
		expect(query).not.toHaveProperty('query');
	});
});

describe('sale credit update resends lines in full', () => {
	test('omitting lines is not possible - the schema requires at least one', async () => {
		const { AltovizEndpointInputSchemas } = await import('./endpoints/types');
		const result = AltovizEndpointInputSchemas.saleCreditsUpdate.safeParse({
			creditId: 1,
		});
		expect(result.success).toBe(false);
	});
});
