import {
	QuadernoEndpointInputSchemas as Inputs,
	nextCreatedBefore,
	QuadernoEndpointOutputSchemas as Outputs,
	QUADERNO_DEFAULT_LIMIT,
	QUADERNO_MAX_LIMIT,
} from './endpoints/types';
import {
	authorizationFixture,
	contactFixture,
	invoiceFixture,
	jurisdictionsFixture,
	pingFixture,
	productFixture,
	taxCodeFixture,
	validationErrorBody,
	voidedInvoiceFixture,
} from './test-fixtures';

/**
 * Each output schema is parsed against the response shape the API actually
 * sends, captured on a scratch account, so a schema that has drifted fails here
 * rather than in production.
 */
describe('output schemas accept the real responses', () => {
	const cases = [
		['ping', Outputs.ping, pingFixture],
		['authorization', Outputs.authorization, authorizationFixture],
		['contacts.create', Outputs.contactsCreate, { contact: contactFixture }],
		[
			'contacts.list',
			Outputs.contactsList,
			{ contacts: [contactFixture], next_created_before: null },
		],
		['products.create', Outputs.productsCreate, { product: productFixture }],
		['invoices.create', Outputs.invoicesCreate, { invoice: invoiceFixture }],
		['invoices.void', Outputs.invoicesVoid, { invoice: voidedInvoiceFixture }],
		['taxCodes.get', Outputs.taxCodesGet, { tax_code: taxCodeFixture }],
		[
			'jurisdictions.list',
			Outputs.jurisdictionsList,
			{ jurisdictions: jurisdictionsFixture },
		],
		['webhooks.list', Outputs.webhooksList, { webhooks: [] }],
		// The reference types `stock` as a string and the identity `id` as a
		// string; neither may fail a read.
		[
			'products.get with a string stock',
			Outputs.productsGet,
			{ product: { ...productFixture, stock: '12' } },
		],
		[
			'authorization with a string id',
			Outputs.authorization,
			{ identity: { ...authorizationFixture.identity, id: '999' } },
		],
		// `valid` is null when the external registry is unreachable.
		['taxIds.validate, registry down', Outputs.taxIdsValidate, { valid: null }],
		['invoices.deliver', Outputs.invoicesDeliver, { delivered: true }],
	] as const;

	for (const [name, schema, fixture] of cases) {
		it(`${name} parses its response`, () => {
			// unknown: the fixture is one of several unrelated shapes, narrowed by
			// the schema under test.
			const result = (
				schema as { safeParse: (v: unknown) => { success: boolean } }
			).safeParse(fixture);
			expect(result.success).toBe(true);
		});
	}
});

describe('output schemas reject wrong shapes', () => {
	it('rejects a contacts page whose rows are not objects', () => {
		expect(
			Outputs.contactsList.safeParse({
				contacts: ['bare'],
				next_created_before: null,
			}).success,
		).toBe(false);
	});

	it('rejects an invoice with no id', () => {
		expect(
			Outputs.invoicesGet.safeParse({ invoice: { number: 'X' } }).success,
		).toBe(false);
	});

	it('rejects a tax code whose id is a number', () => {
		// Verified live: the id is a slug string, which the spec gets wrong.
		expect(Outputs.taxCodesGet.safeParse({ tax_code: { id: 1 } }).success).toBe(
			false,
		);
	});

	it('rejects a ping without a status', () => {
		expect(Outputs.ping.safeParse({}).success).toBe(false);
	});

	it('requires the next_created_before key rather than inferring it', () => {
		expect(Outputs.contactsList.safeParse({ contacts: [] }).success).toBe(
			false,
		);
	});
});

describe('accepts the values the API sends', () => {
	it('takes a product whose unit_cost is a decimal string', () => {
		expect(
			Outputs.productsCreate.safeParse({
				product: { ...productFixture, unit_cost: '10.0' },
			}).success,
		).toBe(true);
	});

	it('takes an invoice with null contact and empty arrays', () => {
		expect(
			Outputs.invoicesCreate.safeParse({
				invoice: {
					...invoiceFixture,
					contact: null,
					items: null,
					payments: null,
				},
			}).success,
		).toBe(true);
	});

	it('takes a voided invoice carrying an offset payment and a credit', () => {
		const parsed = Outputs.invoicesVoid.safeParse({
			invoice: voidedInvoiceFixture,
		});
		expect(parsed.success).toBe(true);
		if (!parsed.success) return;
		expect(parsed.data.invoice.payments?.[0]?.payment_method).toBe('offset');
	});

	it('takes a field the spec omits, because outputs are loose', () => {
		// Quaderno adds response fields without a version bump, by policy.
		expect(
			Outputs.contactsGet.safeParse({
				contact: { ...contactFixture, a_field_from_the_future: 1 },
			}).success,
		).toBe(true);
	});
});

describe('input schemas reject what the API would refuse', () => {
	it('rejects a page size above the documented maximum', () => {
		expect(
			Inputs.contactsList.safeParse({ limit: QUADERNO_MAX_LIMIT + 1 }).success,
		).toBe(false);
		expect(
			Inputs.contactsList.safeParse({ limit: QUADERNO_MAX_LIMIT }).success,
		).toBe(true);
	});

	it('rejects a limit below 1', () => {
		expect(Inputs.contactsList.safeParse({ limit: 0 }).success).toBe(false);
	});

	it('requires first_name on a contact, which is what the API requires', () => {
		expect(Inputs.contactsCreate.safeParse({}).success).toBe(false);
		// An email alone is not enough: Quaderno answers 422 with no first_name.
		expect(
			Inputs.contactsCreate.safeParse({ email: 'a@example.com' }).success,
		).toBe(false);
		// A company with no email on file is a valid contact.
		expect(
			Inputs.contactsCreate.safeParse({ kind: 'company', first_name: 'Acme' })
				.success,
		).toBe(true);
	});

	it('offers no recipient override on a deliver, since the API has none', () => {
		// Quaderno sends to the address on file for the contact. An `email` input
		// would be dropped by the API and the document would go to someone else.
		for (const schema of [
			Inputs.invoicesDeliver,
			Inputs.receiptsDeliver,
			Inputs.creditsDeliver,
			Inputs.proformasDeliver,
		]) {
			expect(Object.keys(schema.shape)).toEqual(['id']);
		}
	});

	it('describes the date filter as a range, the only documented format', () => {
		for (const schema of [
			Inputs.invoicesList,
			Inputs.receiptsList,
			Inputs.creditsList,
			Inputs.proformasList,
		]) {
			expect(schema.shape.date.description).toContain('2026-01-01,2026-12-31');
		}
	});

	it('rejects a two-letter country that is not two letters', () => {
		expect(
			Inputs.contactsCreate.safeParse({
				first_name: 'Amelia',
				country: 'USA',
			}).success,
		).toBe(false);
	});

	it('rejects a product kind the API does not accept', () => {
		// Live: the API answers 422 `kind: is not included in the list` for
		// anything outside one_off and subscription.
		const base = { name: 'x', code: 'x', unit_cost: '1' };
		expect(
			Inputs.productsCreate.safeParse({ ...base, kind: 'standard' }).success,
		).toBe(false);
		expect(
			Inputs.productsCreate.safeParse({ ...base, kind: 'one_off' }).success,
		).toBe(true);
	});

	it('requires a contact and at least one line on an invoice', () => {
		expect(
			Inputs.invoicesCreate.safeParse({ contact: { id: 1 }, items: [] })
				.success,
		).toBe(false);
		expect(Inputs.invoicesCreate.safeParse({ items: [] }).success).toBe(false);
	});

	it('caps an invoice at 200 lines, which is the documented limit', () => {
		const one = { description: 'x', unit_price: 1 };
		expect(
			Inputs.invoicesCreate.safeParse({
				contact: { id: 1 },
				items: Array.from({ length: 201 }, () => one),
			}).success,
		).toBe(false);
	});

	it('requires void_reason, which the API demands', () => {
		// Live: without it the API answers 422 `void_reason is required`.
		expect(Inputs.invoicesVoid.safeParse({ id: 1 }).success).toBe(false);
		expect(
			Inputs.invoicesVoid.safeParse({ id: 1, void_reason: 'Probe' }).success,
		).toBe(true);
	});

	it('requires tax_code and amount on a tax calculation', () => {
		// The docs say both are required from API version 20210316.
		expect(
			Inputs.taxRatesCalculate.safeParse({ to_country: 'US' }).success,
		).toBe(false);
		expect(
			Inputs.taxRatesCalculate.safeParse({
				to_country: 'US',
				tax_code: 'standard',
				amount: 10,
			}).success,
		).toBe(true);
	});

	it('rejects a payment method outside the documented enum', () => {
		expect(
			Inputs.invoicesCreate.safeParse({
				contact: { id: 1 },
				items: [{ description: 'x', unit_price: 1 }],
				payment_method: 'bitcoin',
			}).success,
		).toBe(false);
	});

	it('has no limit on the jurisdiction list, because the route ignores it', () => {
		// Verified live: /jurisdictions always returns the full list, so offering
		// `limit` would be a lie. Zod strips the unknown key rather than rejecting
		// it, so the check is on the schema's own shape.
		expect(Inputs.jurisdictionsList.safeParse({}).success).toBe(true);
		const parsed = Inputs.jurisdictionsList.parse({ limit: 5, country: 'IN' });
		expect(parsed).not.toHaveProperty('limit');
		expect(parsed.country).toBe('IN');
	});

	it('takes a tax code id as a slug string', () => {
		expect(Inputs.taxCodesGet.safeParse({ id: 'standard' }).success).toBe(true);
		expect(Inputs.taxCodesGet.safeParse({ id: '' }).success).toBe(false);
	});
});

describe('nextCreatedBefore', () => {
	it('returns null for a page shorter than the limit', () => {
		expect(nextCreatedBefore([{ id: 5 }], 25)).toBeNull();
	});

	it('returns the last id when the page is full', () => {
		const rows = Array.from({ length: 25 }, (_, i) => ({ id: 100 - i }));
		expect(nextCreatedBefore(rows, 25)).toBe(76);
	});

	it('uses the default page size when the caller gave none', () => {
		const rows = Array.from({ length: QUADERNO_DEFAULT_LIMIT }, (_, i) => ({
			id: 50 - i,
		}));
		expect(nextCreatedBefore(rows, undefined)).toBe(26);
	});

	it('returns null for an empty page', () => {
		expect(nextCreatedBefore([], 25)).toBeNull();
	});

	it('returns null when the last row has no id', () => {
		const rows = Array.from({ length: 25 }, () => ({ id: null }));
		expect(nextCreatedBefore(rows, 25)).toBeNull();
	});
});

describe('error bodies the API actually sends', () => {
	it('names the field in a validation envelope', () => {
		// Captured live: the API answers `{"errors":{"kind":["is not included in
		// the list"]}}` for a bad product kind, which is why the client reads a
		// field map as well as the single `error` string.
		const messages = validationErrorBody.errors.kind;
		expect(messages).toHaveLength(1);
		expect(messages[0]).toContain('is not included');
	});
});
